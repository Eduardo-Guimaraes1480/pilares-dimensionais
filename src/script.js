document.addEventListener('DOMContentLoaded', () => {
    // --- REFERÊNCIAS ---
    const canvas = document.getElementById('canvas-principal');
    const btnVoltar = document.getElementById('btn-voltar');
    const modoEdicaoToggle = document.getElementById('modo-edicao-toggle');
    const modal = document.getElementById('modal-geral');
    const modalFechar = document.getElementById('modal-fechar');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const btnCriarConceito = document.getElementById('btn-criar-conceito');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const mainTitle = document.getElementById('main-title');
    // Novas referências para Exportar/Importar
    const btnExportar = document.getElementById('btn-exportar');
    const btnImportar = document.getElementById('btn-importar');
    const inputImportar = document.getElementById('input-importar');
    const nomeArquivoAtual = document.getElementById('nome-arquivo-atual');

    // Referências do Modal/Form
    const viewContent = document.getElementById('view-content');
    const formEdicao = document.getElementById('form-edicao');
    const viewTitulo = document.getElementById('view-titulo'), viewSubtitulo = document.getElementById('view-subtitulo'), viewPai = document.getElementById('view-pai'), viewDefinicao = document.getElementById('view-definicao'), viewConexao = document.getElementById('view-conexao'), viewAparicoes = document.getElementById('view-aparicoes');
    const editId = document.getElementById('edit-id'), editTitulo = document.getElementById('edit-titulo'), editSubtitulo = document.getElementById('edit-subtitulo'), editPaisContainer = document.getElementById('edit-pais-container'), editDefinicao = document.getElementById('edit-definicao'), editConexao = document.getElementById('edit-conexao');
    const btnExcluirForm = document.querySelector('.btn-excluir');
    const editImagemInput = document.getElementById('edit-imagem-input');
    const btnSelecionarImagem = document.getElementById('btn-selecionar-imagem');
    const editPreviewImagem = document.getElementById('edit-preview-imagem');
    const editImagemBase64 = document.getElementById('edit-imagem-base64');

    // --- VARIÁVEIS DE ESTADO ---
    let todosConceitos = [];
    let historico = [];
    let currentParentId = 'inicio';
    let sortable = null;

    // --- INICIALIZAÇÃO ---
    async function iniciar() {
        const mapaSalvo = localStorage.getItem('mapaFilosofico');
        if (mapaSalvo) {
            todosConceitos = JSON.parse(mapaSalvo);
        } else {
            try {
                const response = await fetch('dados.json');
                if (!response.ok) throw new Error('Não foi possível carregar os dados.');
                const data = await response.json();
                todosConceitos = data.conceitos;
                salvarNoLocalStorage();
            } catch (error) { canvas.innerHTML = `<p>Erro: ${error.message}</p>`; return; }
        }
        inicializarDragDrop();
        aplicarTemaSalvo();
        aplicarModoEdicaoSalvo();
        mostrarConceitos(currentParentId);
    }

    // --- FUNÇÕES DE DADOS (CRUD) ---
    function salvarNoLocalStorage() { localStorage.setItem('mapaFilosofico', JSON.stringify(todosConceitos)); }
    function getPaisDoConceito(filhoId) { return todosConceitos.filter(p => p.filhos && p.filhos.includes(filhoId)); }
    
    function createConceito(dados) {
        const novoConceito = { id: 'conceito_' + Date.now(), filhos: [], ...dados };
        delete novoConceito.pais;
        todosConceitos.push(novoConceito);
        dados.pais.forEach(paiId => {
            const pai = getConceito(paiId);
            if (pai) {
                if (!pai.filhos) pai.filhos = [];
                pai.filhos.push(novoConceito.id);
            }
        });
        salvarNoLocalStorage();
        mostrarConceitos(currentParentId);
    }

    function updateConceito(id, dadosAtualizados) {
        const index = todosConceitos.findIndex(c => c.id === id);
        if (index === -1) return;
        const { pais: paisNovosIds, ...outrosDados } = dadosAtualizados;
        const paisAntigosIds = getPaisDoConceito(id).map(p => p.id);
        todosConceitos[index] = { ...todosConceitos[index], ...outrosDados };
        
        paisAntigosIds.forEach(paiId => {
            if (!paisNovosIds.includes(paiId)) {
                const pai = getConceito(paiId);
                if (pai && pai.filhos) { pai.filhos = pai.filhos.filter(filhoId => filhoId !== id); }
            }
        });
        paisNovosIds.forEach(paiId => {
            if (!paisAntigosIds.includes(paiId)) {
                const pai = getConceito(paiId);
                if (pai) {
                    if (!pai.filhos) pai.filhos = [];
                    pai.filhos.push(id);
                }
            }
        });
        salvarNoLocalStorage();
        mostrarConceitos(currentParentId);
    }

    function deleteConceito(id) {
        const pais = getPaisDoConceito(id);
        pais.forEach(pai => { if (pai.filhos) { pai.filhos = pai.filhos.filter(filhoId => filhoId !== id); } });
        todosConceitos = todosConceitos.filter(c => c.id !== id);
        salvarNoLocalStorage();
        mostrarConceitos(currentParentId);
    }

    // --- IMPORTAR E EXPORTAR (NOVO) ---
    function exportarDados() {
        const dadosStr = JSON.stringify({ conceitos: todosConceitos }, null, 2);
        const blob = new Blob([dadosStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "meus-pilares.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function importarDados(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const dadosImportados = JSON.parse(e.target.result);
                // Validação simples
                if (dadosImportados.conceitos && Array.isArray(dadosImportados.conceitos)) {
                    todosConceitos = dadosImportados.conceitos;
                    salvarNoLocalStorage(); // Salva os novos dados
                    mostrarConceitos('inicio'); // Reinicia a visualização
                    historico = []; // Limpa o histórico
                    // Atualiza o nome do arquivo na tela
                    nomeArquivoAtual.textContent = file.name;
                    alert("Dados importados com sucesso!");
                } else {
                    alert("Arquivo inválido. Certifique-se de que é um backup válido do Mapa.");
                }
            } catch (error) {
                alert("Erro ao ler o arquivo: " + error.message);
            }
        };
        reader.readAsText(file);
    }
    
    // --- FUNÇÕES DE INTERFACE ---
    function getConceito(id) { return todosConceitos.find(c => c.id === id); }
    function mostrarConceitos(idDoPai) {
        currentParentId = idDoPai;
        canvas.innerHTML = '';
        const conceitoPai = getConceito(idDoPai);
        if (!conceitoPai || !conceitoPai.filhos) { ativarOuDesativarDragDrop(); return; }
        
        conceitoPai.filhos.forEach(idFilho => {
            const conceito = getConceito(idFilho);
            if (conceito) {
                const caixa = document.createElement('div');
                caixa.className = 'caixa-conceito';
                caixa.dataset.id = conceito.id;
                caixa.innerHTML = `<p class="titulo">${conceito.titulo}</p><img src="${conceito.imagem || ''}" alt="${conceito.titulo}"><p class="subtitulo">${conceito.subtitulo || ''}</p>`;
                caixa.addEventListener('click', () => navegarPara(conceito.id));
                caixa.addEventListener('contextmenu', (event) => {
                    event.preventDefault();
                    if (modoEdicaoToggle.checked) abrirModalEdicao(conceito.id);
                    else abrirModalVisualizacao(conceito.id);
                });
                canvas.appendChild(caixa);
            }
        });
        btnVoltar.classList.toggle('escondido', historico.length === 0);
        ativarOuDesativarDragDrop();
    }

    function navegarPara(id) {
        const conceito = getConceito(id);
        if (conceito && conceito.filhos && conceito.filhos.length > 0) {
            historico.push(currentParentId);
            mostrarConceitos(id);
        }
    }
    function navegarDeVolta() { if (historico.length > 0) mostrarConceitos(historico.pop()); }
    function calcularAparicoes(id) { return getPaisDoConceito(id).length; }

    // --- LÓGICA DE PESQUISA ---
    function handleSearch(event) {
        const query = event.target.value.toLowerCase().trim();
        searchResults.innerHTML = '';
        if (query.length < 2) { searchResults.classList.add('escondido'); return; }
        const resultadosFiltrados = todosConceitos.filter(c => c.titulo && c.titulo.toLowerCase().includes(query));
        if (resultadosFiltrados.length > 0) {
            resultadosFiltrados.forEach(conceito => {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                item.textContent = conceito.titulo;
                item.addEventListener('click', () => navegarParaResultado(conceito.id));
                searchResults.appendChild(item);
            });
            searchResults.classList.remove('escondido');
        } else { searchResults.classList.add('escondido'); }
    }
    function navegarParaResultado(conceitoId) {
        const pais = getPaisDoConceito(conceitoId);
        const paiParaNavegar = pais.length > 0 ? pais[0].id : 'inicio';
        searchInput.value = '';
        searchResults.classList.add('escondido');
        if (currentParentId === paiParaNavegar) {
            highlightConceito(conceitoId);
        } else {
            mostrarConceitos(paiParaNavegar);
            setTimeout(() => highlightConceito(conceitoId), 100);
        }
    }
    function highlightConceito(conceitoId) {
        const caixa = document.querySelector(`.caixa-conceito[data-id="${conceitoId}"]`);
        if (caixa) {
            caixa.scrollIntoView({ behavior: 'smooth', block: 'center' });
            caixa.classList.add('highlight');
            setTimeout(() => { caixa.classList.remove('highlight'); }, 2500);
        }
    }

    // --- FUNÇÕES DO MODAL ---
    function abrirModalVisualizacao(id) {
        const conceito = getConceito(id);
        if (!conceito) return;
        const pais = getPaisDoConceito(id);
        const nomesDosPais = pais.map(p => p.titulo).join(', ') || 'Nenhum (Raiz)';
        viewTitulo.textContent = conceito.titulo; viewSubtitulo.textContent = conceito.subtitulo; viewPai.textContent = nomesDosPais; viewDefinicao.textContent = conceito.definicao || "N/A"; viewConexao.textContent = conceito.explicacao_conexao || "N/A"; viewAparicoes.textContent = pais.length;
        formEdicao.style.display = 'none'; viewContent.style.display = 'block'; modal.classList.remove('escondido');
    }
    function abrirModalEdicao(id) {
        const isCreating = !id;
        const conceito = isCreating ? {} : getConceito(id);
        formEdicao.reset();
        editId.value = conceito.id || '';
        editTitulo.value = conceito.titulo || '';
        editSubtitulo.value = conceito.subtitulo || '';
        editDefinicao.value = conceito.definicao || '';
        editConexao.value = conceito.explicacao_conexao || '';
        if (conceito.imagem) {
            editPreviewImagem.src = conceito.imagem; editPreviewImagem.classList.remove('escondido'); editImagemBase64.value = conceito.imagem;
        } else {
            editPreviewImagem.src = ''; editPreviewImagem.classList.add('escondido'); editImagemBase64.value = '';
        }
        editPaisContainer.innerHTML = '';
        const paisAtuaisIds = isCreating ? (currentParentId === 'inicio' ? [] : [currentParentId]) : getPaisDoConceito(id).map(p => p.id);
        todosConceitos.forEach(c => {
            if (c.id !== conceito.id) {
                const isChecked = paisAtuaisIds.includes(c.id);
                const item = document.createElement('div');
                item.className = 'checkbox-item';
                item.innerHTML = `<label><input type="checkbox" name="pais" value="${c.id}" ${isChecked ? 'checked' : ''}> ${c.titulo}</label>`;
                editPaisContainer.appendChild(item);
            }
        });
        btnExcluirForm.style.display = isCreating ? 'none' : 'inline-block';
        viewContent.style.display = 'none'; formEdicao.style.display = 'block'; modal.classList.remove('escondido');
    }
    function fecharModal() { modal.classList.add('escondido'); }
    
    // --- LÓGICA DO DRAG & DROP ---
    function inicializarDragDrop() {
        if (sortable) return;
        sortable = new Sortable(canvas, {
            animation: 150, ghostClass: 'sortable-ghost', disabled: true,
            onEnd: (evt) => {
                const pai = getConceito(currentParentId);
                if (!pai || !pai.filhos) return;
                const [itemMovido] = pai.filhos.splice(evt.oldIndex, 1);
                pai.filhos.splice(evt.newIndex, 0, itemMovido);
                salvarNoLocalStorage();
            }
        });
    }
    function ativarOuDesativarDragDrop(ativar) { if (sortable) sortable.option("disabled", !ativar); }

    // --- LÓGICA DO TEMA E MODO EDIÇÃO ---
    function aplicarTemaSalvo() {
        const temaSalvo = localStorage.getItem('tema');
        document.body.classList.toggle('dark-theme', temaSalvo === 'dark');
        themeToggleBtn.textContent = temaSalvo === 'dark' ? '☀️' : '🌙';
    }
    function aplicarModoEdicaoSalvo() {
        const modoEdicaoSalvo = localStorage.getItem('modoEdicao') === 'true';
        modoEdicaoToggle.checked = modoEdicaoSalvo;
        document.body.classList.toggle('edit-mode-active', modoEdicaoSalvo);
        btnCriarConceito.classList.toggle('escondido', !modoEdicaoSalvo);
        ativarOuDesativarDragDrop(modoEdicaoSalvo);
    }
    
    // --- EVENT LISTENERS ---
    // Listeners de Exportar/Importar
    btnExportar.addEventListener('click', exportarDados);
    btnImportar.addEventListener('click', () => { inputImportar.click(); });
    inputImportar.addEventListener('change', importarDados);

    mainTitle.addEventListener('click', () => { historico = []; mostrarConceitos('inicio'); });
    modoEdicaoToggle.addEventListener('change', () => { const isChecked = modoEdicaoToggle.checked; document.body.classList.toggle('edit-mode-active', isChecked); btnCriarConceito.classList.toggle('escondido', !isChecked); localStorage.setItem('modoEdicao', isChecked); ativarOuDesativarDragDrop(isChecked); });
    themeToggleBtn.addEventListener('click', () => { const isDark = document.body.classList.toggle('dark-theme'); localStorage.setItem('tema', isDark ? 'dark' : 'light'); themeToggleBtn.textContent = isDark ? '☀️' : '🌙'; });
    searchInput.addEventListener('input', handleSearch);
    document.addEventListener('click', (event) => { if (!event.target.closest('.search-container')) { searchResults.classList.add('escondido'); } });
    btnCriarConceito.addEventListener('click', () => abrirModalEdicao(null));
    btnVoltar.addEventListener('click', navegarDeVolta);
    modalFechar.addEventListener('click', fecharModal);
    modal.addEventListener('click', (event) => { if (event.target === modal) fecharModal(); });
    btnSelecionarImagem.addEventListener('click', () => { editImagemInput.click(); });
    editImagemInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64String = e.target.result;
            editPreviewImagem.src = base64String; editPreviewImagem.classList.remove('escondido'); editImagemBase64.value = base64String;
        };
        reader.readAsDataURL(file);
    });
    formEdicao.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = editId.value;
        const paisSelecionados = Array.from(document.querySelectorAll('#edit-pais-container input[name="pais"]:checked')).map(cb => cb.value);
        const dados = { titulo: editTitulo.value, subtitulo: editSubtitulo.value, imagem: editImagemBase64.value, definicao: editDefinicao.value, explicacao_conexao: editConexao.value, pais: paisSelecionados };
        if (id) { updateConceito(id, dados); } else { createConceito(dados); }
        fecharModal();
    });
    btnExcluirForm.addEventListener('click', () => {
        const id = editId.value;
        if (!id) return;
        const conceito = getConceito(id);
        if (confirm(`Tem certeza que deseja excluir "${conceito.titulo}"?`)) {
            deleteConceito(id); fecharModal();
        }
    });

    iniciar();
});