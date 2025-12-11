import { todosConceitos, setTodosConceitos, salvarNoLocalStorage, createConceito, updateConceito, deleteConceito, getConceito, getPaisDoConceito, DADOS_PADRAO } from './data.js';
import { mostrarConceitos, inicializarDragDrop, ativarOuDesativarDragDrop, aplicarTemaSalvo, aplicarModoEdicaoSalvo, renderizarResultadosPesquisa, highlightConceito, currentParentId, historico, pushHistorico, popHistorico, resetHistorico, setCurrentParentId } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- REFERÊNCIAS ---
    const canvas = document.getElementById('canvas-principal');
    const mainTitle = document.getElementById('main-title');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    // Menu e Sidebar
    const btnMenu = document.getElementById('btn-menu-hamburguer');
    const btnFecharSidebar = document.getElementById('btn-fechar-sidebar');
    const overlay = document.getElementById('overlay');
    const sidebar = document.getElementById('sidebar');
    
    // Botões Sidebar
    const btnVoltar = document.getElementById('btn-voltar');
    const btnCriarConceito = document.getElementById('btn-criar-conceito');
    const btnExportar = document.getElementById('btn-exportar');
    const btnImportar = document.getElementById('btn-importar');
    const inputImportar = document.getElementById('input-importar');
    const btnResetar = document.getElementById('btn-resetar'); // NOVO
    const nomeArquivoAtual = document.getElementById('nome-arquivo-atual');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const modoEdicaoToggle = document.getElementById('modo-edicao-toggle');

    // Modais
    const modal = document.getElementById('modal-geral');
    const modalFechar = document.getElementById('modal-fechar');
    const formEdicao = document.getElementById('form-edicao');
    const editId = document.getElementById('edit-id');
    const btnExcluirForm = document.querySelector('.btn-excluir');
    
    // Imagem Upload
    const btnSelecionarImagem = document.getElementById('btn-selecionar-imagem');
    const editImagemInput = document.getElementById('edit-imagem-input');
    const editPreviewImagem = document.getElementById('edit-preview-imagem');
    const editImagemBase64 = document.getElementById('edit-imagem-base64');
    
    // WELCOME SCREEN
    const modalWelcome = document.getElementById('modal-boas-vindas');
    // const btnFecharWelcome = document.getElementById('btn-fechar-welcome'); // Removido no HTML
    const btnAutoSetup = document.getElementById('btn-auto-setup');
    const btnWelcomeImport = document.getElementById('btn-welcome-import');
    const btnDownloadSetup = document.getElementById('btn-download-setup');
    const btnIniciarZero = document.getElementById('btn-iniciar-zero'); // NOVO

// Listener para o evento customizado do Breadcrumb (Início)
    document.addEventListener('reset-navigation', () => {
        resetHistorico();
        setCurrentParentId('inicio');
        atualizarTela();
    });

    // BUSCA APRIMORADA
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 2) { searchResults.classList.add('escondido'); return; }
        
        // Filtra buscando em Título, Subtítulo e Definição
        const filtrados = todosConceitos.filter(c => {
            if (!c.titulo) return false;
            const matchTitulo = c.titulo.toLowerCase().includes(query);
            const matchSub = c.subtitulo && c.subtitulo.toLowerCase().includes(query);
            const matchDef = c.definicao && c.definicao.toLowerCase().includes(query);
            
            // Adiciona uma flag temporária para mostrar na UI onde achou
            if (matchTitulo) c.matchType = 'Título';
            else if (matchSub) c.matchType = 'Subtítulo';
            else if (matchDef) c.matchType = 'Definição';
            
            return matchTitulo || matchSub || matchDef;
        });

        renderizarResultadosPesquisa(filtrados, (id) => {
            const pais = getPaisDoConceito(id);
            // Tenta achar o pai mais relevante ou vai pro inicio
            const paiDestino = pais.length > 0 ? pais[0].id : 'inicio';
            
            // Lógica para não bugar o histórico ao pular direto
            if (currentParentId !== paiDestino) { 
                pushHistorico(currentParentId); // Salva onde estava antes de pular
                setCurrentParentId(paiDestino); 
                atualizarTela(); 
            }
            setTimeout(() => highlightConceito(id), 300);
        });
    });

    // --- INICIALIZAÇÃO INTELIGENTE ---
    async function iniciar() {
        inicializarDragDrop();
        aplicarTemaSalvo();
        aplicarModoEdicaoSalvo();

        const mapaSalvo = localStorage.getItem('mapaFilosofico');
        
        if (mapaSalvo) {
            try {
                const dados = JSON.parse(mapaSalvo);
                if (Array.isArray(dados) && dados.length > 0) {
                    setTodosConceitos(dados);
                    atualizarTela();
                } else {
                    abrirBoasVindas(); 
                }
            } catch (e) { abrirBoasVindas(); }
        } else {
            abrirBoasVindas();
        }
    }

    // --- LÓGICA DE BOAS VINDAS ---
    function abrirBoasVindas() {
        modalWelcome.classList.remove('escondido');
    }
    
    function fecharBoasVindas() {
        modalWelcome.classList.add('escondido');
    }

    function executarAutoSetup() {
        setTodosConceitos([...DADOS_PADRAO]); 
        salvarNoLocalStorage();
        setCurrentParentId('inicio');
        atualizarTela();
        fecharBoasVindas();
        alert("Universo gerado com sucesso! Bem-vindo.");
    }

    function baixarSetupInicial() {
        const dadosStr = JSON.stringify({ conceitos: DADOS_PADRAO }, null, 2);
        const blob = new Blob([dadosStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "setup-inicial-ese.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function iniciarDoZero() {
        if(confirm("Tem certeza? Isso criará um mapa vazio apenas com o nó 'Início'. Se você tiver dados não salvos, eles serão perdidos.")) {
            // Cria apenas o nó inicial obrigatório
            const inicio = {
                id: "inicio",
                filhos: [],
                titulo: "Início",
                definicao: "Ponto de partida.",
                explicacao_conexao: "Raiz."
            };
            setTodosConceitos([inicio]);
            salvarNoLocalStorage();
            setCurrentParentId('inicio');
            atualizarTela();
            fecharBoasVindas();
        }
    }

    // --- LÓGICA DE RESETAR / SAIR ---
    function resetarDados() {
        if (confirm("ATENÇÃO: Você está prestes a sair e limpar os dados deste navegador. Certifique-se de ter baixado um backup se quiser salvar seu progresso.\n\nDeseja continuar?")) {
            localStorage.removeItem('mapaFilosofico');
            setTodosConceitos([]);
            resetHistorico();
            
            // Limpa visualmente
            const canvas = document.getElementById('canvas-principal');
            canvas.innerHTML = '';
            nomeArquivoAtual.textContent = "Seus Pilares Dimensionais";
            
            // Fecha menu e mostra boas vindas
            document.body.classList.remove('menu-aberto');
            abrirBoasVindas();
        }
    }

    // Listeners Welcome
    if(btnAutoSetup) btnAutoSetup.addEventListener('click', executarAutoSetup);
    if(btnDownloadSetup) btnDownloadSetup.addEventListener('click', baixarSetupInicial);
    if(btnIniciarZero) btnIniciarZero.addEventListener('click', iniciarDoZero);
    if(btnWelcomeImport) btnWelcomeImport.addEventListener('click', () => {
        inputImportar.click();
    });

    // Listener Resetar
    if(btnResetar) btnResetar.addEventListener('click', resetarDados);


    // --- FUNÇÕES DE ATUALIZAÇÃO ---
    function atualizarTela() {
        const isEditMode = modoEdicaoToggle.checked;
        mostrarConceitos(
            currentParentId, 
            isEditMode, 
            navegarPara, 
            abrirModalEdicao, 
            abrirModalVisualizacao
        );
    }

    // --- NAVEGAÇÃO E MODAIS ---
    function navegarPara(id) {
        const conceito = getConceito(id);
        if (conceito && conceito.filhos && conceito.filhos.length > 0) {
            pushHistorico(currentParentId);
            setCurrentParentId(id);
            atualizarTela();
        }
    }

    function navegarDeVolta() {
        if (historico.length > 0) {
            const anterior = popHistorico();
            setCurrentParentId(anterior);
            atualizarTela();
        }
    }

    function abrirModalVisualizacao(id) {
        const conceito = getConceito(id);
        if (!conceito) return;
        document.getElementById('view-titulo').textContent = conceito.titulo;
        document.getElementById('view-subtitulo').textContent = conceito.subtitulo;
        document.getElementById('view-pai').textContent = getPaisDoConceito(id).map(p => p.titulo).join(', ') || 'Nenhum (Raiz)';
        document.getElementById('view-definicao').textContent = conceito.definicao || "N/A";
        document.getElementById('view-conexao').textContent = conceito.explicacao_conexao || "N/A";
        document.getElementById('view-aparicoes').textContent = getPaisDoConceito(id).length;
        document.getElementById('view-content').style.display = 'block';
        formEdicao.style.display = 'none';
        btnExcluirForm.style.display = 'none';
        modal.classList.remove('escondido');
    }

    function abrirModalEdicao(id) {
        const isCreating = !id;
        const conceito = isCreating ? {} : getConceito(id);
        formEdicao.reset();
        editId.value = conceito.id || '';
        document.getElementById('edit-titulo').value = conceito.titulo || '';
        document.getElementById('edit-subtitulo').value = conceito.subtitulo || '';
        document.getElementById('edit-definicao').value = conceito.definicao || '';
        document.getElementById('edit-conexao').value = conceito.explicacao_conexao || '';
        if (conceito && conceito.imagem) {
            editPreviewImagem.src = conceito.imagem; editPreviewImagem.classList.remove('escondido'); editImagemBase64.value = conceito.imagem;
        } else {
            editPreviewImagem.src = ''; editPreviewImagem.classList.add('escondido'); editImagemBase64.value = '';
        }
        const container = document.getElementById('edit-pais-container');
        container.innerHTML = '';
        const paisAtuaisIds = isCreating ? (currentParentId === 'inicio' ? [] : [currentParentId]) : getPaisDoConceito(id).map(p => p.id);
        todosConceitos.forEach(c => {
            if (c.id !== conceito.id) {
                const isChecked = paisAtuaisIds.includes(c.id);
                const item = document.createElement('div');
                item.className = 'checkbox-item';
                item.innerHTML = `<label><input type="checkbox" name="pais" value="${c.id}" ${isChecked ? 'checked' : ''}> ${c.titulo}</label>`;
                container.appendChild(item);
            }
        });
        document.getElementById('view-content').style.display = 'none';
        formEdicao.style.display = 'block';
        btnExcluirForm.style.display = isCreating ? 'none' : 'inline-block';
        modal.classList.remove('escondido');
    }

    // --- EVENT LISTENERS GERAIS ---
    const toggleSidebar = () => document.body.classList.toggle('menu-aberto');
    const fecharSidebar = () => document.body.classList.remove('menu-aberto');
    
    btnMenu.addEventListener('click', toggleSidebar);
    btnFecharSidebar.addEventListener('click', fecharSidebar);
    overlay.addEventListener('click', fecharSidebar);
    
    mainTitle.addEventListener('click', () => { resetHistorico(); setCurrentParentId('inicio'); atualizarTela(); });
    
    btnVoltar.addEventListener('click', navegarDeVolta);
    btnCriarConceito.addEventListener('click', () => { abrirModalEdicao(null); if (window.innerWidth < 768) fecharSidebar(); });
    
    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('tema', isDark ? 'dark' : 'light');
        themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
    });

    modoEdicaoToggle.addEventListener('change', () => {
        const isChecked = modoEdicaoToggle.checked;
        document.body.classList.toggle('edit-mode-active', isChecked);
        if(btnCriarConceito) btnCriarConceito.classList.toggle('escondido', !isChecked);
        localStorage.setItem('modoEdicao', isChecked);
        atualizarTela();
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 2) { searchResults.classList.add('escondido'); return; }
        const filtrados = todosConceitos.filter(c => c.titulo && c.titulo.toLowerCase().includes(query));
        renderizarResultadosPesquisa(filtrados, (id) => {
            const pais = getPaisDoConceito(id);
            const paiDestino = pais.length > 0 ? pais[0].id : 'inicio';
            if (currentParentId !== paiDestino) { setCurrentParentId(paiDestino); atualizarTela(); }
            setTimeout(() => highlightConceito(id), 100);
        });
    });
    document.addEventListener('click', (e) => { if (!e.target.closest('.search-container')) searchResults.classList.add('escondido'); });

    modalFechar.addEventListener('click', () => modal.classList.add('escondido'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('escondido'); });

    btnSelecionarImagem.addEventListener('click', () => editImagemInput.click());
    editImagemInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                editPreviewImagem.src = evt.target.result;
                editPreviewImagem.classList.remove('escondido');
                editImagemBase64.value = evt.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    formEdicao.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = editId.value;
        const pais = Array.from(document.querySelectorAll('#edit-pais-container input:checked')).map(cb => cb.value);
        const dados = {
            titulo: document.getElementById('edit-titulo').value,
            subtitulo: document.getElementById('edit-subtitulo').value,
            imagem: editImagemBase64.value,
            definicao: document.getElementById('edit-definicao').value,
            explicacao_conexao: document.getElementById('edit-conexao').value,
            pais: pais
        };
        if (id) updateConceito(id, dados);
        else createConceito(dados, currentParentId);
        modal.classList.add('escondido');
        atualizarTela();
    });

    btnExcluirForm.addEventListener('click', () => {
        const id = editId.value;
        if (id && confirm('Tem certeza?')) {
            deleteConceito(id);
            modal.classList.add('escondido');
            atualizarTela();
        }
    });

    // Import/Export
    btnExportar.addEventListener('click', () => {
        const str = JSON.stringify({ conceitos: todosConceitos }, null, 2);
        const blob = new Blob([str], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = "backup-mapa.json";
        a.click();
    });

    btnImportar.addEventListener('click', () => inputImportar.click());
    inputImportar.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const json = JSON.parse(evt.target.result);
                const dadosNovos = json.conceitos || json; 
                if (Array.isArray(dadosNovos)) {
                    setTodosConceitos(dadosNovos);
                    salvarNoLocalStorage();
                    nomeArquivoAtual.textContent = file.name;
                    resetHistorico();
                    setCurrentParentId('inicio');
                    atualizarTela();
                    alert('Importado com sucesso!');
                    document.body.classList.remove('menu-aberto');
                    fecharBoasVindas(); 
                } else { alert("Formato inválido."); }
            } catch (err) { alert('Erro ao importar.'); }
        };
        reader.readAsText(file);
    });

    iniciar();
});