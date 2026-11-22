# HelpDesk Web — Atividade Complementar (SPA + Bootstrap)

Desenvolvimento Web III | Fatec Franco da Rocha

**Aluno(a):** NOME COMPLETO — RA: 0000000000

O front-end funciona como **SPA**: existe só um `index.html`, e o JavaScript troca o conteúdo da `<div id="app">`.
Ainda não existe servidor. Os dados ficam em memória e desaparecem ao atualizar a página.

## Como executar

Abra o `index.html` no navegador (ou use o Live Server do VS Code).

## O que foi implementado

| # | Requisito | Onde está |
|---|-----------|-----------|
| 1 | Prioridade com badge: **Alta vermelha piscando**, Média laranja, Baixa verde | `badgePrioridade()` em `app.js` e `@keyframes piscar` em `style.css` |
| 2 | Array de prioridades montando o `<select>` dinamicamente | `const prioridades` e `mostrarNovoChamado()` |
| 3 | Coluna **Ações** (Visualizar, Atender, Encerrar; encerrados não podem ser encerrados de novo) | `botoesAcoes()` |
| 4 | Tela **Encerrar chamado** com o campo "O que foi feito?" | `mostrarEncerrarChamado()` |
| 5 | Solução gravada no objeto (`solucao`) e status alterado para `Encerrado` | `encerrarChamado()` |
| 6 | Tela **Detalhes do chamado**, exibindo a solução quando encerrado | `mostrarDetalhes()` |
| 7 | Status com badges de cores diferentes | `const listaStatus` e `badgeStatus()` |
| 8 | Dashboard com Total, Abertos, Em atendimento, Encerrados e Prioridade Alta (calculados com `filter()`) | `mostrarDashboard()` |
| 9 | Validações: encerramento exige a solução; cadastro exige título e prioridade | `encerrarChamado()` e `cadastrarChamado()` |
| 10 | Continua SPA: novas telas são funções que substituem o `#app` | todas as funções `mostrar...()` |

Para adicionar uma prioridade nova (ex.: "Urgente"), basta incluir `{ nome: "Urgente", classe: "bg-dark" }` no array `prioridades`: ela aparece automaticamente no formulário.

Exemplo de objeto depois do encerramento:

```js
{
  id: 1,
  titulo: "Computador não liga",
  descricao: "O computador não apresenta sinal de energia.",
  prioridade: "Alta",
  status: "Encerrado",
  solucao: "Foi realizada a troca da fonte de alimentação do computador."
}
```
