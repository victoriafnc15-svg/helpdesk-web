// ======================================================================
// HELPDESK WEB - SPA COM JAVASCRIPT PURO
// Atividade complementar: evolução do projeto da Aula 02.
//
// Novidades desta versão:
//  - badges de prioridade (Alta piscando) e de status;
//  - array de prioridades montando o <select> dinamicamente;
//  - coluna Ações (Visualizar / Atender / Encerrar);
//  - telas de Encerrar chamado e Detalhes do chamado;
//  - propriedade "solucao" gravada no objeto do chamado;
//  - Dashboard com 5 indicadores calculados a partir do array;
//  - validações no cadastro e no encerramento.
// ======================================================================

// ----------------------------------------------------------------------
// ARRAY DE PRIORIDADES
// O <select> do formulário e as badges são montados a partir dele.
// Para criar uma nova prioridade (ex.: "Urgente"), basta acrescentar um
// objeto aqui: ela aparece automaticamente no formulário e na listagem.
// ----------------------------------------------------------------------
const prioridades = [
    // nome: texto exibido e gravado no chamado.
    // classe: classes CSS usadas na badge.
    { nome: "Baixa", classe: "bg-success" },
    { nome: "Média", classe: "bg-laranja" },
    { nome: "Alta",  classe: "bg-danger piscar" }
];

// ----------------------------------------------------------------------
// ARRAY DE STATUS (mesma ideia, para as badges de status).
// ----------------------------------------------------------------------
const listaStatus = [
    { nome: "Aberto",         classe: "bg-primary" },
    { nome: "Em atendimento", classe: "bg-info text-dark" },
    { nome: "Encerrado",      classe: "bg-secondary" }
];

// Array com dados temporários.
// Eles existem apenas enquanto a página está aberta.
const chamados = [
    {
        // Identificador único deste exemplo.
        id: 1,

        // Título curto.
        titulo: "Computador não liga",

        // Descrição detalhada.
        descricao: "O computador não apresenta sinal de energia.",

        // Prioridade do atendimento.
        prioridade: "Alta",

        // Situação atual.
        status: "Aberto"
    },
    {
        id: 2,
        titulo: "Senha bloqueada",
        descricao: "Usuário não consegue acessar o sistema.",
        prioridade: "Média",
        status: "Em atendimento"
    },
    {
        id: 3,
        titulo: "notebook não liga",
        descricao: "O computador não apresenta sinal de energia.",
        prioridade: "Alta",
        status: "Encerrado",

        // Chamado já encerrado: guarda o que foi feito.
        solucao: "Substituição do carregador do notebook."
    }
];

// Procura o elemento <div id="app">.
// Guardaremos a referência para alterar a tela.
const app = document.getElementById("app");

// ======================================================================
// FUNÇÕES AUXILIARES
// ======================================================================

// Monta a badge (etiqueta colorida) de uma prioridade.
function badgePrioridade(nomePrioridade) {

    // find procura no array o objeto com aquele nome.
    const prioridade = prioridades.find(p => p.nome === nomePrioridade);

    // Se não encontrar (prioridade nova sem cor), usa cinza escuro.
    const classe = prioridade ? prioridade.classe : "bg-dark";

    return `<span class="badge badge-prioridade ${classe}">${nomePrioridade}</span>`;
}

// Monta a badge de um status.
function badgeStatus(nomeStatus) {
    const status = listaStatus.find(s => s.nome === nomeStatus);
    const classe = status ? status.classe : "bg-dark";

    return `<span class="badge badge-status ${classe}">${nomeStatus}</span>`;
}

// Localiza um chamado pelo id.
function buscarChamado(id) {
    return chamados.find(chamado => chamado.id === id);
}

// Evita que textos digitados pelo usuário sejam interpretados como HTML.
function escaparHTML(texto) {
    return String(texto ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// ======================================================================
// DASHBOARD
// ======================================================================

// Monta um card de indicador do Dashboard.
function cardIndicador(titulo, valor, cor) {
    return `
        <div class="col-sm-6 col-lg">
            <div class="card card-indicador h-100" style="--cor-indicador: ${cor}">
                <div class="card-body">
                    <h2 class="h6 text-muted">${titulo}</h2>
                    <p class="display-6 mb-0">${valor}</p>
                </div>
            </div>
        </div>
    `;
}

// Função que desenha o Dashboard.
function mostrarDashboard() {

    // Todos os valores são calculados a partir do array com filter().
    // length conta quantos itens o novo array possui.
    const abertos = chamados
        .filter(chamado => chamado.status === "Aberto")
        .length;

    const emAtendimento = chamados
        .filter(chamado => chamado.status === "Em atendimento")
        .length;

    const encerrados = chamados
        .filter(chamado => chamado.status === "Encerrado")
        .length;

    const prioridadeAlta = chamados
        .filter(chamado => chamado.prioridade === "Alta")
        .length;

    // innerHTML substitui o conteúdo da área principal.
    app.innerHTML = `
        <h1 class="mb-4">Dashboard</h1>

        <div class="row g-3">
            ${cardIndicador("Total de chamados", chamados.length, "#212529")}
            ${cardIndicador("Abertos", abertos, "#0d6efd")}
            ${cardIndicador("Em atendimento", emAtendimento, "#0dcaf0")}
            ${cardIndicador("Encerrados", encerrados, "#6c757d")}
            ${cardIndicador("Prioridade Alta", prioridadeAlta, "#dc3545")}
        </div>
    `;
}

// ======================================================================
// LISTAGEM DE CHAMADOS
// ======================================================================

// Monta os botões da coluna Ações de acordo com a situação do chamado.
function botoesAcoes(chamado) {

    // Visualizar existe para todos os chamados.
    let botoes = `
        <button class="btn btn-sm btn-outline-primary"
                data-acao="visualizar" data-id="${chamado.id}">
            Visualizar
        </button>
    `;

    // Chamado aberto pode passar para "Em atendimento".
    if (chamado.status === "Aberto") {
        botoes += `
            <button class="btn btn-sm btn-outline-info"
                    data-acao="atender" data-id="${chamado.id}">
                Atender
            </button>
        `;
    }

    // Somente chamados NÃO encerrados podem ser encerrados.
    if (chamado.status !== "Encerrado") {
        botoes += `
            <button class="btn btn-sm btn-danger"
                    data-acao="encerrar" data-id="${chamado.id}">
                Encerrar chamado
            </button>
        `;
    }

    return `<div class="d-flex flex-wrap gap-1">${botoes}</div>`;
}

// Função que desenha a listagem.
function mostrarChamados() {

    app.innerHTML = `
        <h1 class="mb-4">Chamados</h1>

        <div class="table-responsive">
            <table class="table table-striped align-middle">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Prioridade</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    ${
                        // map transforma cada objeto em uma linha HTML.
                        chamados.map(chamado => `
                            <tr>
                                <td>${chamado.id}</td>
                                <td>${escaparHTML(chamado.titulo)}</td>
                                <td>${badgePrioridade(chamado.prioridade)}</td>
                                <td>${badgeStatus(chamado.status)}</td>
                                <td>${botoesAcoes(chamado)}</td>
                            </tr>
                        `)
                        // join une todas as linhas sem vírgula.
                        .join("")
                    }
                </tbody>
            </table>
        </div>
    `;

    // Seleciona todos os botões de ação que acabaram de ser criados.
    const botoes = app.querySelectorAll("[data-acao]");

    botoes.forEach(botao => {
        botao.addEventListener("click", () => {

            // dataset lê os atributos data-acao e data-id.
            // Number converte o id de texto para número.
            const acao = botao.dataset.acao;
            const id = Number(botao.dataset.id);

            if (acao === "visualizar") {
                mostrarDetalhes(id);
            }

            if (acao === "atender") {
                iniciarAtendimento(id);
            }

            if (acao === "encerrar") {
                mostrarEncerrarChamado(id);
            }
        });
    });
}

// Altera o status de um chamado aberto para "Em atendimento".
function iniciarAtendimento(id) {
    const chamado = buscarChamado(id);

    if (chamado && chamado.status === "Aberto") {
        chamado.status = "Em atendimento";
    }

    mostrarChamados();
}

// ======================================================================
// TELA: DETALHES DO CHAMADO
// ======================================================================

function mostrarDetalhes(id) {

    const chamado = buscarChamado(id);

    // Se o id não existir, volta para a lista.
    if (!chamado) {
        mostrarChamados();
        return;
    }

    // A solução só aparece se o chamado estiver encerrado.
    const blocoSolucao = chamado.status === "Encerrado"
        ? `
            <h2 class="h5 mt-4">Solução realizada</h2>
            <p class="solucao bg-light p-3 mb-0">${escaparHTML(chamado.solucao)}</p>
        `
        : "";

    app.innerHTML = `
        <h1 class="mb-4">Detalhes do chamado #${chamado.id}</h1>

        <div class="card mb-3">
            <div class="card-body">
                <dl class="row mb-0">
                    <dt class="col-sm-3">Chamado</dt>
                    <dd class="col-sm-9">#${chamado.id}</dd>

                    <dt class="col-sm-3">Título</dt>
                    <dd class="col-sm-9">${escaparHTML(chamado.titulo)}</dd>

                    <dt class="col-sm-3">Descrição</dt>
                    <dd class="col-sm-9">${escaparHTML(chamado.descricao) || "<em>Sem descrição</em>"}</dd>

                    <dt class="col-sm-3">Prioridade</dt>
                    <dd class="col-sm-9">${badgePrioridade(chamado.prioridade)}</dd>

                    <dt class="col-sm-3">Status</dt>
                    <dd class="col-sm-9">${badgeStatus(chamado.status)}</dd>
                </dl>

                ${blocoSolucao}
            </div>
        </div>

        <button class="btn btn-secondary" id="btnVoltar" type="button">
            Voltar
        </button>
    `;

    document.getElementById("btnVoltar").addEventListener("click", mostrarChamados);
}

// ======================================================================
// TELA: ENCERRAR CHAMADO
// ======================================================================

function mostrarEncerrarChamado(id) {

    const chamado = buscarChamado(id);

    // Não abre a tela se o chamado não existir ou já estiver encerrado.
    if (!chamado || chamado.status === "Encerrado") {
        mostrarChamados();
        return;
    }

    app.innerHTML = `
        <h1 class="mb-4">Encerrar chamado</h1>

        <div class="card mb-4">
            <div class="card-body">
                <p class="mb-1"><strong>Chamado:</strong> #${chamado.id}</p>
                <p class="mb-1"><strong>Problema:</strong> ${escaparHTML(chamado.titulo)}</p>
                <p class="mb-1"><strong>Descrição:</strong> ${escaparHTML(chamado.descricao) || "<em>Sem descrição</em>"}</p>
                <p class="mb-1"><strong>Prioridade:</strong> ${badgePrioridade(chamado.prioridade)}</p>
                <p class="mb-0"><strong>Status atual:</strong> ${badgeStatus(chamado.status)}</p>
            </div>
        </div>

        <form id="formEncerrar" novalidate>
            <div class="mb-3">
                <label class="form-label" for="solucao">
                    O que foi feito?
                </label>

                <textarea
                    class="form-control"
                    id="solucao"
                    rows="4"
                    placeholder="Descreva o procedimento realizado para resolver o problema."></textarea>

                <!-- Mensagem exibida quando o campo está vazio. -->
                <div class="invalid-feedback">
                    O preenchimento do campo "O que foi feito?" é obrigatório para encerrar o chamado.
                </div>
            </div>

            <button class="btn btn-danger" type="submit">
                Confirmar encerramento
            </button>

            <button class="btn btn-secondary" id="btnCancelar" type="button">
                Cancelar
            </button>
        </form>
    `;

    // Envio do formulário: valida e encerra.
    document.getElementById("formEncerrar").addEventListener("submit", evento => {
        evento.preventDefault();
        encerrarChamado(chamado.id);
    });

    // Cancelar volta para a lista sem alterar nada.
    document.getElementById("btnCancelar").addEventListener("click", mostrarChamados);
}

// Grava a solução no objeto e muda o status para "Encerrado".
function encerrarChamado(id) {

    const campoSolucao = document.getElementById("solucao");

    // trim remove espaços: um campo só com espaços também é vazio.
    const solucao = campoSolucao.value.trim();

    // VALIDAÇÃO: não encerra sem informar o que foi realizado.
    if (solucao === "") {
        campoSolucao.classList.add("is-invalid");
        campoSolucao.focus();
        return;
    }

    // Localiza o objeto dentro do array.
    const chamado = buscarChamado(id);

    // Altera o estado do próprio objeto:
    // acrescenta a propriedade solucao e muda o status.
    chamado.solucao = solucao;
    chamado.status = "Encerrado";

    // Mostra os detalhes já com a solução registrada.
    mostrarDetalhes(id);
}

// ======================================================================
// TELA: NOVO CHAMADO
// ======================================================================

// Função que desenha o formulário.
function mostrarNovoChamado() {

    app.innerHTML = `
        <h1 class="mb-4">Novo chamado</h1>

        <!-- Mensagem de erro de validação (escondida no início). -->
        <div id="erroCadastro" class="alert alert-danger d-none"></div>

        <form id="formChamado">
            <div class="mb-3">
                <label class="form-label" for="titulo">
                    Título
                </label>

                <input
                    class="form-control"
                    id="titulo"
                    required>
            </div>

            <div class="mb-3">
                <label class="form-label" for="descricao">
                    Descrição
                </label>

                <textarea
                    class="form-control"
                    id="descricao"
                    rows="4"></textarea>
            </div>

            <div class="mb-3">
                <label class="form-label" for="prioridade">
                    Prioridade
                </label>

                <select class="form-select" id="prioridade" required>
                    <option value="">Selecione</option>
                    ${
                        // As opções vêm do array prioridades (não são fixas no HTML).
                        prioridades
                            .map(p => `<option value="${p.nome}">${p.nome}</option>`)
                            .join("")
                    }
                </select>
            </div>

            <button class="btn btn-success" type="submit">
                Cadastrar
            </button>
        </form>
    `;

    // Procura o formulário que acabou de ser criado.
    const formulario = document.getElementById("formChamado");

    // Escuta o envio do formulário.
    formulario.addEventListener("submit", cadastrarChamado);
}

// Função executada no submit.
function cadastrarChamado(evento) {

    // Impede o navegador de recarregar a página.
    evento.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const prioridade = document.getElementById("prioridade").value;

    // Validações existentes mantidas (required) + reforço em JavaScript:
    // título não pode ser só espaços e a prioridade precisa existir no array.
    const prioridadeValida = prioridades.some(p => p.nome === prioridade);

    if (titulo === "" || !prioridadeValida) {
        const erro = document.getElementById("erroCadastro");
        erro.textContent = "Informe o título e selecione uma prioridade.";
        erro.classList.remove("d-none");
        return;
    }

    // Próximo id: maior id existente + 1 (evita ids repetidos).
    const proximoId = chamados.length > 0
        ? Math.max(...chamados.map(c => c.id)) + 1
        : 1;

    // push adiciona um novo objeto no array.
    chamados.push({
        id: proximoId,
        titulo: titulo,
        descricao: descricao,
        prioridade: prioridade,

        // Novo chamado começa aberto.
        status: "Aberto"
    });

    // Depois do cadastro, mostra a lista.
    mostrarChamados();
}

// ======================================================================
// NAVEGAÇÃO DA SPA (menu com data-view)
// ======================================================================

// Seleciona todos os elementos que têm data-view.
const links = document.querySelectorAll("[data-view]");

// Percorre os links.
links.forEach(link => {

    // Escuta clique.
    link.addEventListener("click", evento => {

        // Impede navegação padrão.
        evento.preventDefault();

        // Lê data-view.
        const view = link.dataset.view;

        // Decide qual "tela" mostrar.
        if (view === "dashboard") {
            mostrarDashboard();
        }

        if (view === "chamados") {
            mostrarChamados();
        }

        if (view === "novo") {
            mostrarNovoChamado();
        }
    });
});

// Primeira tela.
mostrarDashboard();
