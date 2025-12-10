// --- ESTADO GLOBAL (Exportado para ser compartilhado) ---
export let todosConceitos = [];

// --- DADOS INICIAIS (Hardcoded para garantir funcionamento offline) ---
export const DADOS_PADRAO = [
    {
      "id": "inicio",
      "filhos": ["dimensao_0d", "dimensao_1d", "dimensao_2d", "dimensao_3d", "dimensao_4d", "dimensao_5d", "dimensao_6d"],
      "titulo": "Início",
      "definicao": "O ponto de partida de toda a exploração conceitual, a origem de onde todas as dimensões emanam.",
      "explicacao_conexao": "Não possui pai, é o nó raiz de toda a estrutura."
    },
    {
      "id": "dimensao_0d", "pai": "inicio", "titulo": "0D", "subtitulo": "Inexistência", "imagem": "https://via.placeholder.com/150/7f8c8d/FFFFFF?text=0D", "filhos": ["nao_existe"],
      "definicao": "A dimensão zero representa um único ponto, a ausência de espaço e a singularidade. Filosoficamente, é o potencial puro e a inexistência manifesta.",
      "explicacao_conexao": "É uma das dimensões primordiais que surgem do 'Início', representando o polo da negação."
    },
    {
      "id": "dimensao_1d", "pai": "inicio", "titulo": "1D", "subtitulo": "Linha/Existência", "imagem": "https://via.placeholder.com/150/2ecc71/FFFFFF?text=1D", "filhos": ["existe"],
      "definicao": "A primeira dimensão, uma linha que conecta dois pontos. Representa o movimento, a dualidade inicial e a afirmação da existência.",
      "explicacao_conexao": "É o contraponto de 0D, a afirmação que surge do 'Início'."
    },
    {
      "id": "dimensao_2d", "pai": "inicio", "titulo": "2D", "subtitulo": "Papel/Equilíbrio", "imagem": "https://via.placeholder.com/150/3498db/FFFFFF?text=2D", "filhos": ["equilibrio"],
      "definicao": "A segunda dimensão, um plano com largura e altura. Simboliza a superfície das interações e a busca pelo equilíbrio entre múltiplas forças.",
      "explicacao_conexao": "Evolui das dimensões lineares, introduzindo a complexidade e a necessidade de equilíbrio."
    },
    {
      "id": "dimensao_3d", "pai": "inicio", "titulo": "3D", "subtitulo": "Personagem/Fundamentos", "imagem": "https://via.placeholder.com/150/9b59b6/FFFFFF?text=3D", "filhos": ["ciencia", "tempo", "social", "individual"],
      "definicao": "A terceira dimensão, o espaço que percebemos. Contém os fundamentos da nossa realidade manifesta, como a ciência e o tempo.",
      "explicacao_conexao": "Define o palco físico e conceitual onde os fundamentos da existência operam."
    },
    {
      "id": "dimensao_4d", "pai": "inicio", "titulo": "4D", "subtitulo": "Livro/Tempo", "imagem": "https://via.placeholder.com/150/f1c40f/FFFFFF?text=4D", "filhos": ["padroes", "mapa", "organizacao", "interesse"],
      "definicao": "A quarta dimensão, onde sistemas e padrões complexos emergem e interagem ao longo do tempo.",
      "explicacao_conexao": "Representa a organização e a estrutura dinâmica que governam os fundamentos da 3D."
    },
    {
      "id": "dimensao_5d", "pai": "inicio", "titulo": "5D", "subtitulo": "Estante/Gênero", "imagem": "https://via.placeholder.com/150/e67e22/FFFFFF?text=5D", "filhos": ["sentimento", "dinheiro", "informacao", "espirito"],
      "definicao": "A quinta dimensão, o reino das abstrações, ideias e valores que não existem fisicamente mas que possuem grande poder sobre as dimensões inferiores.",
      "explicacao_conexao": "Transcende o físico e o sistêmico para explorar o significado e o valor."
    },
    {
      "id": "dimensao_6d", "pai": "inicio", "titulo": "6D", "subtitulo": "Biblioteca/Individuo", "imagem": "https://via.placeholder.com/150/e74c3c/FFFFFF?text=6D", "filhos": ["preguica", "fim", "sentidos", "logico"],
      "definicao": "A sexta dimensão, que abrange a totalidade da experiência subjetiva e os limites da percepção e da existência.",
      "explicacao_conexao": "Engloba a forma como as outras dimensões são percebidas e os limites inerentes a essa percepção."
    },
    { 
      "id": "nao_existe", "pai": "dimensao_0d", "titulo": "0 - Não existe", "subtitulo": "Não", "imagem": "https://via.placeholder.com/150/c0392b/FFFFFF?text=Não", "filhos": ["alienacao", "consequencias", "verdade", "extremo"],
      "definicao": "O conceito da negação, do vazio e da ausência. É a base para entender o que 'É' por contraste com o que 'Não É'.",
      "explicacao_conexao": "É a manifestação primária da dimensão 0D, o conceito central da inexistência."
    },
    { 
      "id": "existe", "pai": "dimensao_1d", "titulo": "1 - Existe", "subtitulo": "Sim", "imagem": "https://via.placeholder.com/150/27ae60/FFFFFF?text=Sim", "filhos": ["impacto", "conexao", "perspectiva", "limites"],
      "definicao": "A afirmação do ser, a presença e a manifestação. É a base para a ação e o impacto no universo.",
      "explicacao_conexao": "É a manifestação primária da dimensão 1D, o conceito central da existência."
    },
    { 
      "id": "equilibrio", "pai": "dimensao_2d", "titulo": "2 - Equilíbrio", "subtitulo": "Bem/Mal", "imagem": "https://via.placeholder.com/150/2980b9/FFFFFF?text=Equilíbrio", "filhos": ["ciencia", "tempo", "social", "individual", "padroes", "mapa", "organizacao", "interesse", "sentimento", "dinheiro", "informacao", "espirito", "preguica", "fim", "sentidos", "logico"],
      "definicao": "O estado de balanço entre forças opostas. É o ponto central de onde todos os conceitos complexos são observados em harmonia.",
      "explicacao_conexao": "É a manifestação da 2D. Seus filhos são todos os conceitos das dimensões superiores, pois o equilíbrio é necessário para observar a totalidade."
    },
    { "id": "alienacao", "pai": "nao_existe", "titulo": "3.0 - Alienação", "subtitulo": "Não Alienado", "imagem": "https://via.placeholder.com/150/ecf0f1/000000?text=3.0", "filhos": [], "definicao": "Definição de Alienação...", "explicacao_conexao": "Surge da negação da conexão e do pertencimento." },
    { "id": "consequencias", "pai": "nao_existe", "titulo": "4.0 - Consequências", "subtitulo": "Problemas", "imagem": "https://via.placeholder.com/150/ecf0f1/000000?text=4.0", "filhos": [], "definicao": "Definição de Consequências...", "explicacao_conexao": "Representa os resultados e reações, muitas vezes problemáticos, que surgem no vácuo da ação consciente." },
    { "id": "verdade", "pai": "nao_existe", "titulo": "5.0 - Verdade", "subtitulo": "Mentira", "imagem": "https://via.placeholder.com/150/ecf0f1/000000?text=5.0", "filhos": [], "definicao": "Definição de Verdade...", "explicacao_conexao": "A verdade é definida em oposição à mentira, que é uma forma de 'não-ser' ou negação da realidade." },
    { "id": "extremo", "pai": "nao_existe", "titulo": "6.0 - Extremo", "subtitulo": "Pouco", "imagem": "https://via.placeholder.com/150/ecf0f1/000000?text=6.0", "filhos": [], "definicao": "Definição de Extremo...", "explicacao_conexao": "O extremo é a ausência de moderação, um conceito que ganha forma a partir da negação do equilíbrio." },
    { "id": "impacto", "pai": "existe", "titulo": "3.1 - Impacto", "subtitulo": "Marca", "imagem": "https://via.placeholder.com/150/bdc3c7/000000?text=3.1", "filhos": [], "definicao": "Definição de Impacto...", "explicacao_conexao": "É a consequência direta da existência, a prova de que algo 'é' por meio da marca que deixa." },
    { "id": "conexao", "pai": "existe", "titulo": "4.1 - Conexão", "subtitulo": "Parecido", "imagem": "https://via.placeholder.com/150/bdc3c7/000000?text=4.1", "filhos": [], "definicao": "Definição de Conexão...", "explicacao_conexao": "A conexão só pode ocorrer entre coisas que existem; é a afirmação de uma relação." },
    { "id": "perspectiva", "pai": "existe", "titulo": "5.1 - Perspectiva", "subtitulo": "Proporção", "imagem": "https://via.placeholder.com/150/bdc3c7/000000?text=5.1", "filhos": [], "definicao": "Definição de Perspectiva...", "explicacao_conexao": "Uma perspectiva é o ponto de vista de um ser existente; não há perspectiva sem existência." },
    { "id": "limites", "pai": "existe", "titulo": "6.1 - Limites", "subtitulo": "Liberdade", "imagem": "https://via.placeholder.com/150/bdc3c7/000000?text=6.1", "filhos": [], "definicao": "Definição de Limites...", "explicacao_conexao": "Os limites definem a forma de algo que existe; a própria existência é um limite." },
    { "id": "ciencia", "pai": "dimensao_3d", "titulo": "1.3 - Ciência", "subtitulo": "Saúde", "imagem": "https://via.placeholder.com/150/8e44ad/FFFFFF?text=1.3", "filhos": [], "definicao": "Definição de Ciência...", "explicacao_conexao": "É um fundamento para entender o espaço físico (3D) em que vivemos." },
    { "id": "tempo", "pai": "dimensao_3d", "titulo": "2.3 - Tempo", "subtitulo": "História", "imagem": "https://via.placeholder.com/150/8e44ad/FFFFFF?text=2.3", "filhos": [], "definicao": "Definição de Tempo...", "explicacao_conexao": "É inseparável do espaço na nossa percepção da realidade 3D, formando o tecido do espaço-tempo." },
    { "id": "social", "pai": "dimensao_3d", "titulo": "3.3 - Social", "subtitulo": "Conexões", "imagem": "https://via.placeholder.com/150/8e44ad/FFFFFF?text=3.3", "filhos": [], "definicao": "Definição de Social...", "explicacao_conexao": "As interações sociais são um pilar fundamental da experiência humana dentro do nosso espaço tridimensional." },
    { "id": "individual", "pai": "dimensao_3d", "titulo": "4.3 - Individual", "subtitulo": "Diferença", "imagem": "https://via.placeholder.com/150/8e44ad/FFFFFF?text=4.3", "filhos": [], "definicao": "Definição de Individual...", "explicacao_conexao": "O indivíduo é a unidade fundamental que ocupa e percebe o espaço 3D." },
    { "id": "padroes", "pai": "dimensao_4d", "titulo": "5.4 - Padrões", "subtitulo": "Ritmo e Constância", "imagem": "https://via.placeholder.com/150/f39c12/FFFFFF?text=5.4", "filhos": [], "definicao": "Definição de Padrões...", "explicacao_conexao": "Padrões são sistemas que se repetem e governam as interações, uma característica da 4D." },
    { "id": "mapa", "pai": "dimensao_4d", "titulo": "6.4 - Mapa", "subtitulo": "Se-adaptar", "imagem": "https://via.placeholder.com/150/f39c12/FFFFFF?text=6.4", "filhos": [], "definicao": "Definição de Mapa...", "explicacao_conexao": "Um mapa é uma representação de um sistema (4D), uma ferramenta para navegar em sua complexidade." },
    { "id": "organizacao", "pai": "dimensao_4d", "titulo": "7.4 - Organização", "subtitulo": "Classificar", "imagem": "https://via.placeholder.com/150/f39c12/FFFFFF?text=7.4", "filhos": [], "definicao": "Definição de Organização...", "explicacao_conexao": "A organização é a estrutura de um sistema (4D), a forma como suas partes se relacionam." },
    { "id": "interesse", "pai": "dimensao_4d", "titulo": "8.4 - Interesse", "subtitulo": "Dopamina", "imagem": "https://via.placeholder.com/150/f39c12/FFFFFF?text=8.4", "filhos": [], "definicao": "Definição de Interesse...", "explicacao_conexao": "O interesse é o motor que nos impulsiona a explorar e entender os sistemas (4D)." },
    { "id": "sentimento", "pai": "dimensao_5d", "titulo": "9.5 - Sentimento", "subtitulo": "Amor", "imagem": "https://via.placeholder.com/150/d35400/FFFFFF?text=9.5", "filhos": [], "definicao": "Definição de Sentimento...", "explicacao_conexao": "Sentimentos são valores abstratos que guiam o comportamento, uma característica chave da 5D." },
    { "id": "dinheiro", "pai": "dimensao_5d", "titulo": "10.5 - Dinheiro", "subtitulo": "Bens/Poder", "imagem": "https://via.placeholder.com/150/d35400/FFFFFF?text=10.5", "filhos": [], "definicao": "Definição de Dinheiro...", "explicacao_conexao": "O dinheiro é um conceito abstrato (5D) que representa valor e poder nas dimensões inferiores." },
    { "id": "informacao", "pai": "dimensao_5d", "titulo": "11.5 - Informação", "subtitulo": "Dados", "imagem": "https://via.placeholder.com/150/d35400/FFFFFF?text=11.5", "filhos": [], "definicao": "Definição de Informação...", "explicacao_conexao": "A informação é a interpretação abstrata de dados brutos, transformando-os em significado (5D)." },
    { "id": "espirito", "pai": "dimensao_5d", "titulo": "12.5 - Espirito", "subtitulo": "Religião", "imagem": "https://via.placeholder.com/150/d35400/FFFFFF?text=12.5", "filhos": [], "definicao": "Definição de Espirito...", "explicacao_conexao": "O espírito representa a busca por significado e conexão transcendental, o ápice das abstrações da 5D." },
    { "id": "preguica", "pai": "dimensao_6d", "titulo": "13.6 - Preguiça", "subtitulo": "Descanso", "imagem": "https://via.placeholder.com/150/c0392b/FFFFFF?text=13.6", "filhos": [], "definicao": "Definição de Preguiça...", "explicacao_conexao": "A preguiça é uma experiência subjetiva relacionada aos limites de energia e motivação do ser (6D)." },
    { "id": "fim", "pai": "dimensao_6d", "titulo": "14.6 - Fim", "subtitulo": "Morte", "imagem": "https://via.placeholder.com/150/c0392b/FFFFFF?text=14.6", "filhos": [], "definicao": "Definição de Fim...", "explicacao_conexao": "O fim, ou a morte, é o limite final da experiência existencial (6D)." },
    { "id": "sentidos", "pai": "dimensao_6d", "titulo": "15.6 - 5 Sentidos", "subtitulo": "Sensores", "imagem": "https://via.placeholder.com/150/c0392b/FFFFFF?text=15.6", "filhos": [], "definicao": "Definição de 5 Sentidos...", "explicacao_conexao": "Os sentidos são os sensores que definem os limites da nossa percepção da realidade (6D)." },
    { "id": "logico", "pai": "dimensao_6d", "titulo": "16.6 - Lógico", "subtitulo": "Imaginação", "imagem": "https://via.placeholder.com/150/c0392b/FFFFFF?text=16.6", "filhos": [], "definicao": "Definição de Lógico...", "explicacao_conexao": "A lógica e a imaginação são ferramentas mentais que usamos para explorar e testar os limites da nossa experiência (6D)." }
];

// --- FUNÇÕES DE DADOS ---
export function setTodosConceitos(novosDados) {
    todosConceitos = novosDados;
}

export function getConceito(id) { 
    return todosConceitos.find(c => c.id === id); 
}

export function getPaisDoConceito(filhoId) { 
    return todosConceitos.filter(p => p.filhos && p.filhos.includes(filhoId)); 
}

export function salvarNoLocalStorage() { 
    localStorage.setItem('mapaFilosofico', JSON.stringify(todosConceitos)); 
}

// --- CRUD ---
export function createConceito(dados) {
    const novoConceito = { id: 'conceito_' + Date.now(), filhos: [], ...dados };
    delete novoConceito.pais;
    todosConceitos.push(novoConceito);
    
    // Vincula aos pais
    if (dados.pais && dados.pais.length > 0) {
        dados.pais.forEach(paiId => {
            const pai = getConceito(paiId);
            if (pai) {
                if (!pai.filhos) pai.filhos = [];
                pai.filhos.push(novoConceito.id);
            }
        });
    }
    salvarNoLocalStorage();
}

export function updateConceito(id, dadosAtualizados) {
    const index = todosConceitos.findIndex(c => c.id === id);
    if (index === -1) return;
    const { pais: paisNovosIds, ...outrosDados } = dadosAtualizados;
    const paisAntigosIds = getPaisDoConceito(id).map(p => p.id);
    todosConceitos[index] = { ...todosConceitos[index], ...outrosDados };
    
    // Remove dos antigos
    paisAntigosIds.forEach(paiId => {
        if (!paisNovosIds.includes(paiId)) {
            const pai = getConceito(paiId);
            if (pai && pai.filhos) { pai.filhos = pai.filhos.filter(filhoId => filhoId !== id); }
        }
    });
    // Adiciona nos novos
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
}

export function deleteConceito(id) {
    const pais = getPaisDoConceito(id);
    pais.forEach(pai => { if (pai.filhos) { pai.filhos = pai.filhos.filter(filhoId => filhoId !== id); } });
    todosConceitos = todosConceitos.filter(c => c.id !== id);
    salvarNoLocalStorage();
}