import { todosConceitos, setTodosConceitos, salvarNoLocalStorage, createConceito, updateConceito, deleteConceito, getConceito, getPaisDoConceito, DADOS_PADRAO } from './data.js';
import { mostrarConceitos, inicializarDragDrop, ativarOuDesativarDragDrop, aplicarTemaSalvo, aplicarModoEdicaoSalvo, renderizarResultadosPesquisa, highlightConceito, currentParentId, historico, pushHistorico, popHistorico, resetHistorico, setCurrentParentId } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    // REFERÊNCIAS
    const mainTitle = document.getElementById('main-title');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const btnMenu = document.getElementById('btn-menu-hamburguer');
    const btnFecharSidebar = document.getElementById('btn-fechar-sidebar');
    const overlay = document.getElementById('overlay');
    const btnVoltar = document.getElementById('btn-voltar');
    const btnCriarConceito = document.getElementById('btn-criar-conceito');
    const btnExportar = document.getElementById('btn-exportar');
    const btnImportar = document.getElementById('btn-importar');
    const inputImportar = document.getElementById('input-importar');
    const nomeArquivoAtual = document.getElementById('nome-arquivo-atual');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const modoEdicaoToggle = document.getElementById('modo-edicao-toggle');
    const modal = document.getElementById('modal-geral');
    const modalFechar = document.getElementById('modal-fechar');
    const formEdicao = document.getElementById('form-edicao');
    const editId = document.getElementById('edit-id');
    const btnExcluirForm = document.querySelector('.btn-excluir');
    const btnSelecionarImagem = document.getElementById('btn-selecionar-imagem');
    const editImagemInput = document.getElementById('edit-imagem-input');
    const editPreviewImagem = document.getElementById('edit-preview-imagem');
    const editImagemBase64 = document.getElementById('edit-imagem-base64');
    
    // REFERÊNCIAS WELCOME SCREEN
    const welcomeScreen = document.getElementById('welcome-screen');
    const btnAutoSetup = document.getElementById('btn-auto-setup');
    const btnWelcomeImport = document.getElementById('btn-welcome-import');

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
                    mostrarBoasVindas(); // Dados vazios -> Mostra tela cheia
                }
            } catch (e) { mostrarBoasVindas(); }
        } else {
            mostrarBoasVindas(); // Sem dados -> Mostra tela cheia
        }
    }

    function mostrarBoasVindas() {
        if(welcomeScreen) welcomeScreen.classList.remove('escondido');
    }

    function esconderBoasVindas() {
        if(welcomeScreen) welcomeScreen.classList.add('escondido');
    }

    // AÇÃO: Gerar Universo
    if(btnAutoSetup) {
        btnAutoSetup.addEventListener('click', () => {
            setTodosConceitos([...DADOS_PADRAO]); // Carrega do data.js
            salvarNoLocalStorage();
            setCurrentParentId('inicio');
            atualizarTela();
            esconderBoasVindas();
            alert("Universo gerado com sucesso!");
        });
    }

    // AÇÃO: Importar na tela de boas vindas
    if(btnWelcomeImport) {
        btnWelcomeImport.addEventListener('click', () => {
            inputImportar.click();
        });
    }

    // ... (RESTO DOS LISTENERS IGUAIS AO ANTERIOR: Menu, Navegação, Pesquisa, Edição, etc.) ...
    // Copie os listeners do btnMenu, btnVoltar, themeToggle, searchInput, formEdicao...
    // MANTENHA A LÓGICA DE IMPORTAÇÃO (inputImportar change) POIS ELA AGORA TAMBÉM PRECISA ESCONDER O BOAS VINDAS:
    
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
                    esconderBoasVindas(); // <<-- IMPORTANTE
                } else { alert("Formato inválido."); }
            } catch (err) { alert('Erro ao importar.'); }
        };
        reader.readAsText(file);
    });

    // ... (Listeners de Search, Form, etc. permanecem iguais) ...
    // --- LÓGICA DO MENU SIDEBAR ---
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
        const paisSelecionados = Array.from(document.querySelectorAll('#edit-pais-container input[name="pais"]:checked')).map(cb => cb.value);
        const dados = { titulo: editTitulo.value, subtitulo: editSubtitulo.value, imagem: editImagemBase64.value, definicao: editDefinicao.value, explicacao_conexao: editConexao.value, pais: paisSelecionados };
        if (id) { updateConceito(id, dados); } else { createConceito(dados); }
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

    // FUNÇÕES DE ATUALIZAÇÃO
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

    // NAVEGAÇÃO E MODAIS (Mesma lógica de antes)
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
        if (conceito.imagem) {
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

    iniciar();
});