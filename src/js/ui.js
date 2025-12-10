import { todosConceitos, getConceito, getPaisDoConceito, salvarNoLocalStorage } from './data.js';

// Variáveis de controle de UI
let sortable = null;
export let currentParentId = 'inicio';
export let historico = [];

// Função para atualizar o ID atual (usada pelo main.js)
export function setCurrentParentId(id) { currentParentId = id; }
export function resetHistorico() { historico = []; }
export function pushHistorico(id) { historico.push(id); }
export function popHistorico() { return historico.pop(); }

// --- RENDERIZAÇÃO ---
export function mostrarConceitos(idDoPai, modoEdicaoAtivo, callbackNavegar, callbackAbrirModalEdit, callbackAbrirModalView) {
    setCurrentParentId(idDoPai);
    const canvas = document.getElementById('canvas-principal');
    const btnVoltar = document.getElementById('btn-voltar');
    
    canvas.innerHTML = '';
    const conceitoPai = getConceito(idDoPai);
    
    // Se não achar o pai ou não tiver filhos, apenas atualiza DragDrop e sai
    if (!conceitoPai || !conceitoPai.filhos) { 
        ativarOuDesativarDragDrop(modoEdicaoAtivo); 
        return; 
    }

    conceitoPai.filhos.forEach(idFilho => {
        const conceito = getConceito(idFilho);
        if (conceito) {
            const caixa = document.createElement('div');
            caixa.className = 'caixa-conceito';
            caixa.dataset.id = conceito.id;
            caixa.innerHTML = `<p class="titulo">${conceito.titulo}</p><img src="${conceito.imagem || ''}" alt="${conceito.titulo}"><p class="subtitulo">${conceito.subtitulo || ''}</p>`;
            
            caixa.addEventListener('click', () => callbackNavegar(conceito.id));
            caixa.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                if (modoEdicaoAtivo) callbackAbrirModalEdit(conceito.id);
                else callbackAbrirModalView(conceito.id);
            });
            canvas.appendChild(caixa);
        }
    });
    
    // Controle do Botão Voltar na Sidebar
    if (historico.length > 0) btnVoltar.classList.remove('escondido');
    else btnVoltar.classList.add('escondido');

    ativarOuDesativarDragDrop(modoEdicaoAtivo);
}

// --- DRAG AND DROP ---
export function inicializarDragDrop() {
    const canvas = document.getElementById('canvas-principal');
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

export function ativarOuDesativarDragDrop(ativar) { 
    if (sortable) sortable.option("disabled", !ativar); 
}

// --- TEMA E MODO EDIÇÃO ---
export function aplicarTemaSalvo() {
    const temaSalvo = localStorage.getItem('tema');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    document.body.classList.toggle('dark-theme', temaSalvo === 'dark');
    themeToggleBtn.textContent = temaSalvo === 'dark' ? '☀️' : '🌙';
}

export function aplicarModoEdicaoSalvo() {
    const modoEdicaoSalvo = localStorage.getItem('modoEdicao') === 'true';
    const modoEdicaoToggle = document.getElementById('modo-edicao-toggle');
    const btnCriarConceito = document.getElementById('btn-criar-conceito');
    
    modoEdicaoToggle.checked = modoEdicaoSalvo;
    document.body.classList.toggle('edit-mode-active', modoEdicaoSalvo);
    if(btnCriarConceito) btnCriarConceito.classList.toggle('escondido', !modoEdicaoSalvo);
    ativarOuDesativarDragDrop(modoEdicaoSalvo);
    return modoEdicaoSalvo;
}

// --- PESQUISA ---
export function renderizarResultadosPesquisa(resultados, callbackNavegar) {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
    
    if (resultados.length > 0) {
        resultados.forEach(conceito => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.textContent = conceito.titulo;
            item.addEventListener('click', () => {
                callbackNavegar(conceito.id);
                document.getElementById('search-input').value = '';
                searchResults.classList.add('escondido');
            });
            searchResults.appendChild(item);
        });
        searchResults.classList.remove('escondido');
    } else {
        searchResults.classList.add('escondido');
    }
}

export function highlightConceito(conceitoId) {
    const caixa = document.querySelector(`.caixa-conceito[data-id="${conceitoId}"]`);
    if (caixa) {
        caixa.scrollIntoView({ behavior: 'smooth', block: 'center' });
        caixa.classList.add('highlight');
        setTimeout(() => { caixa.classList.remove('highlight'); }, 2500);
    }
}