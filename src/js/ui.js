import { todosConceitos, getConceito, salvarNoLocalStorage } from './data.js';

// Variáveis de controle de UI
let sortable = null;
export let currentParentId = 'inicio';
export let historico = []; // Armazena o ID dos pais anteriores

// Função para atualizar o ID atual
export function setCurrentParentId(id) { currentParentId = id; }
export function resetHistorico() { historico = []; }

// Lógica de Histórico para Breadcrumbs
export function pushHistorico(id) { 
    // Evita duplicatas consecutivas ou loops simples
    if (historico[historico.length - 1] !== id) {
        historico.push(id); 
    }
}
export function popHistorico() { return historico.pop(); }

// --- AUXILIAR: Toque Longo para Mobile ---
function adicionarEventosToque(elemento, callbackClick, callbackLongPress) {
    let timer;
    let isLongPress = false;
    let touchMoved = false;

    elemento.addEventListener('touchstart', (e) => {
        touchMoved = false;
        isLongPress = false;
        timer = setTimeout(() => {
            isLongPress = true;
            if (navigator.vibrate) navigator.vibrate(50); // Feedback tátil
            callbackLongPress(e);
        }, 600); // 600ms para considerar long press
    }, { passive: true });

    elemento.addEventListener('touchmove', () => { touchMoved = true; clearTimeout(timer); }, { passive: true });
    
    elemento.addEventListener('touchend', (e) => {
        clearTimeout(timer);
        if (!isLongPress && !touchMoved) {
            callbackClick(e); // Toque rápido = Navegar
        }
        // Se foi long press, o preventDefault deve ser tratado no callback se necessário
    });
}

// --- RENDERIZAÇÃO ---
export function mostrarConceitos(idDoPai, modoEdicaoAtivo, callbackNavegar, callbackAbrirModalEdit, callbackAbrirModalView) {
    setCurrentParentId(idDoPai);
    const canvas = document.getElementById('canvas-principal');
    const containerBreadcrumbs = document.getElementById('breadcrumbs-container'); // Elemento novo que criaremos no HTML
    
    canvas.innerHTML = '';
    const conceitoPai = getConceito(idDoPai);
    
    // 1. Atualiza Breadcrumbs (Se existir o container no HTML)
    if (containerBreadcrumbs) {
        atualizarBreadcrumbs(containerBreadcrumbs, conceitoPai, callbackNavegar);
    }

    // Se não achar o pai ou não tiver filhos
    if (!conceitoPai || !conceitoPai.filhos) { 
        ativarOuDesativarDragDrop(modoEdicaoAtivo); 
        return; 
    }

    // 2. Renderiza Filhos
    conceitoPai.filhos.forEach(idFilho => {
        const conceito = getConceito(idFilho);
        if (conceito) {
            const caixa = document.createElement('div');
            caixa.className = 'caixa-conceito';
            caixa.dataset.id = conceito.id;
            
            // Conteúdo do Card
            let htmlContent = `<p class="titulo">${conceito.titulo}</p>`;
            if (conceito.imagem) {
                htmlContent += `<img src="${conceito.imagem}" alt="${conceito.titulo}" loading="lazy">`;
            }
            htmlContent += `<p class="subtitulo">${conceito.subtitulo || ''}</p>`;
            caixa.innerHTML = htmlContent;
            
            // --- EVENTOS DE INTERAÇÃO (Desktop e Mobile) ---
            
            // Clique Esquerdo (Desktop) / Toque Rápido (Mobile via helper)
            const acaoNavegar = () => callbackNavegar(conceito.id);
            
            // Clique Direito (Desktop) / Toque Longo (Mobile via helper)
            const acaoDetalhes = (e) => {
                if (e) e.preventDefault(); // Previne menu de contexto nativo
                if (modoEdicaoAtivo) callbackAbrirModalEdit(conceito.id);
                else callbackAbrirModalView(conceito.id);
            };

            // Aplica listeners Desktop
            caixa.addEventListener('click', acaoNavegar);
            caixa.addEventListener('contextmenu', acaoDetalhes);

            // Aplica listeners Mobile (Toque Longo)
            adicionarEventosToque(caixa, acaoNavegar, acaoDetalhes);

            canvas.appendChild(caixa);
        }
    });
    
    // Oculta/Mostra botão voltar antigo (opcional se usarmos breadcrumbs, mas bom manter)
    const btnVoltar = document.getElementById('btn-voltar');
    if (btnVoltar) {
        if (historico.length > 0) btnVoltar.classList.remove('escondido');
        else btnVoltar.classList.add('escondido');
    }

    ativarOuDesativarDragDrop(modoEdicaoAtivo);
}

// Nova função para renderizar o caminho
function atualizarBreadcrumbs(container, conceitoAtual, callbackNavegar) {
    container.innerHTML = '';
    
    // Cria o item "Início" sempre
    const homeSpan = document.createElement('span');
    homeSpan.className = 'breadcrumb-item home';
    homeSpan.textContent = '🏠 Início';
    homeSpan.onclick = () => {
        // Lógica simples: resetar para o início
        // Idealmente, o main.js manipularia o resetHistorico, mas aqui forçamos a navegação
        const event = new CustomEvent('reset-navigation');
        document.dispatchEvent(event);
    };
    container.appendChild(homeSpan);

    // Adiciona separador se não estivermos no início
    if (conceitoAtual && conceitoAtual.id !== 'inicio') {
        const sep = document.createElement('span');
        sep.className = 'breadcrumb-separator';
        sep.textContent = ' / ';
        container.appendChild(sep);

        const currentSpan = document.createElement('span');
        currentSpan.className = 'breadcrumb-item current';
        currentSpan.textContent = conceitoAtual.titulo;
        container.appendChild(currentSpan);
    }
}

// --- DRAG AND DROP ---
export function inicializarDragDrop() {
    const canvas = document.getElementById('canvas-principal');
    if (sortable) return;
    // Verifica se Sortable está carregado
    if (typeof Sortable !== 'undefined') {
        sortable = new Sortable(canvas, {
            animation: 150, 
            ghostClass: 'sortable-ghost', 
            disabled: true,
            delay: 200, // Ajuda a não ativar drag acidentalmente no touch
            delayOnTouchOnly: true,
            onEnd: (evt) => {
                const pai = getConceito(currentParentId);
                if (!pai || !pai.filhos) return;
                const [itemMovido] = pai.filhos.splice(evt.oldIndex, 1);
                pai.filhos.splice(evt.newIndex, 0, itemMovido);
                salvarNoLocalStorage();
            }
        });
    } else {
        console.warn("SortableJS não carregado.");
    }
}

export function ativarOuDesativarDragDrop(ativar) { 
    if (sortable) sortable.option("disabled", !ativar); 
}

// --- TEMA E MODO EDIÇÃO ---
export function aplicarTemaSalvo() {
    const temaSalvo = localStorage.getItem('tema');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    document.body.classList.toggle('dark-theme', temaSalvo === 'dark');
    if(themeToggleBtn) themeToggleBtn.textContent = temaSalvo === 'dark' ? '☀️' : '🌙';
}

export function aplicarModoEdicaoSalvo() {
    const modoEdicaoSalvo = localStorage.getItem('modoEdicao') === 'true';
    const modoEdicaoToggle = document.getElementById('modo-edicao-toggle');
    const btnCriarConceito = document.getElementById('btn-criar-conceito');
    
    if(modoEdicaoToggle) modoEdicaoToggle.checked = modoEdicaoSalvo;
    document.body.classList.toggle('edit-mode-active', modoEdicaoSalvo);
    if(btnCriarConceito) btnCriarConceito.classList.toggle('escondido', !modoEdicaoSalvo);
    ativarOuDesativarDragDrop(modoEdicaoSalvo);
    return modoEdicaoSalvo;
}

// --- PESQUISA (Melhorada) ---
export function renderizarResultadosPesquisa(resultados, callbackNavegar) {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
    
    if (resultados.length > 0) {
        resultados.forEach(conceito => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            // Mostra onde o termo foi encontrado
            item.innerHTML = `<strong>${conceito.titulo}</strong><br><small>${conceito.matchType || ''}</small>`;
            
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