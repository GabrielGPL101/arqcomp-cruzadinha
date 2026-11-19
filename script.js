const nomesJogos = ["Cruzadinha", "Quiz tático", "Jogo da memória", "Ordem de execução"];
const descricoesJogos = [
    "Escolha uma pista e digite nas casas. Use as setas para mudar de casa.",
    "Escolha uma alternativa por pergunta e leia a explicação antes de avançar.",
    "Vire duas cartas por vez para juntar cada termo à sua definição.",
    "Use os controles ao lado de cada etapa para colocá-la na posição certa."
];
const progresso = [0, 0, 0, 0];
const concluidos = [false, false, false, false];
const rascunhoCruz = {};
let jogoAtual = -1;

try {
    const salvo = JSON.parse(localStorage.getItem("operacaoArqcomp"));
    if (salvo && Array.isArray(salvo.progresso) && Array.isArray(salvo.concluidos)) {
        for (let i = 0; i < progresso.length; i++) {
            const pontos = Number(salvo.progresso[i]);
            if (pontos >= 0 && pontos <= [160, 120, 80, 40][i]) {
                progresso[i] = pontos;
                concluidos[i] = salvo.concluidos[i] === true;
            }
        }
    }
} catch {}

function atualizarPainel() {
    let xp = 0;
    let total = 0;
    let marcas = "";
    for (let i = 0; i < progresso.length; i++) {
        xp += progresso[i];
        if (concluidos[i]) {
            total++;
            marcas += '<span class="feito"></span>';
        } else {
            marcas += "<span></span>";
        }
    }
    totalXp.innerHTML = xp;
    resumoProgresso.innerHTML = total + "/4 MODOS CONCLUÍDOS";
    marcasProgresso.innerHTML = marcas;
}

function registrar(pontos, completo) {
    progresso[jogoAtual] = Math.max(progresso[jogoAtual], pontos);
    concluidos[jogoAtual] = concluidos[jogoAtual] || completo;
    try {
        localStorage.setItem("operacaoArqcomp", JSON.stringify({ progresso, concluidos }));
    } catch {}
    atualizarPainel();
}

function voltarInicio() {
    jogoAtual = -1;
    clearTimeout(tempoCartas);
    inicio.hidden = false;
    treino.hidden = true;
    areaJogo.innerHTML = "";
    window.scrollTo(0, 0);
    document.querySelector(".marca").focus({ preventScroll: true });
}

function abrirJogo(indice) {
    clearTimeout(tempoCartas);
    jogoAtual = indice;
    inicio.hidden = true;
    treino.hidden = false;
    nomeJogo.innerHTML = nomesJogos[indice];
    descricaoJogo.innerHTML = descricoesJogos[indice];

    if (indice === 0) montarCruzadinha();
    if (indice === 1) iniciarQuiz();
    if (indice === 2) iniciarMemoria();
    if (indice === 3) iniciarOrdem();

    window.scrollTo(0, 0);
    nomeJogo.focus({ preventScroll: true });
}

function embaralhar(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
        const sorteado = Math.floor(Math.random() * (i + 1));
        const atual = lista[i];
        lista[i] = lista[sorteado];
        lista[sorteado] = atual;
    }
}

const letras = {};
const numeros = {};
const caminhos = [];
const numeroPista = [];
let pistaAtiva = 0;

for (let i = 0; i < palavras.length; i++) {
    const [termo, linha, coluna, direcao] = palavras[i];
    const partida = linha + "-" + coluna;
    if (!numeros[partida]) numeros[partida] = Object.keys(numeros).length + 1;
    numeroPista.push(numeros[partida]);
    const caminho = [];
    for (let j = 0; j < termo.length; j++) {
        const y = linha + (direcao === "V" ? j : 0);
        const x = coluna + (direcao === "H" ? j : 0);
        const chave = y + "-" + x;
        letras[chave] = termo[j];
        caminho.push(chave);
    }
    caminhos.push(caminho);
}

function montarCruzadinha() {
    let grade = "";
    let horizontais = "";
    let verticais = "";
    for (let i = 0; i < 14; i++) {
        for (let j = 0; j < 16; j++) {
            const chave = i + "-" + j;
            if (letras[chave]) {
                const numero = numeros[chave] ? '<span class="numero">' + numeros[chave] + '</span>' : "";
                const valor = rascunhoCruz[chave] || "";
                grade += '<div class="casa">' + numero + '<input id="casa-' + chave + '" value="' + valor + '" inputmode="text" maxlength="1" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Linha ' + (i + 1) + ', coluna ' + (j + 1) + '" onfocus="focarCasa(\'' + chave + '\')" oninput="digitarCasa(this, \'' + chave + '\')" onkeydown="teclaCasa(event, \'' + chave + '\')"></div>';
            } else {
                grade += '<div aria-hidden="true"></div>';
            }
        }
    }
    for (let i = 0; i < palavras.length; i++) {
        const botao = '<button class="pista" id="pista-' + i + '" aria-pressed="false" onclick="selecionarPista(' + i + ')"><b>' + numeroPista[i] + '</b><span>' + palavras[i][4] + '</span><span class="statusPista" aria-hidden="true"></span></button>';
        if (palavras[i][3] === "H") horizontais += botao;
        else verticais += botao;
    }
    areaJogo.innerHTML = '<div class="layoutCruz"><div class="painel"><p id="placarCruz" class="estado" aria-live="polite">0 de ' + palavras.length + ' palavras</p><div class="rolagem"><div class="tabuleiro" style="grid-template-columns: repeat(16, var(--casa))">' + grade + '</div></div><div class="controles"><button class="botao primario" onclick="conferirCruzadinha()">Conferir</button><button class="botao secundario" onclick="reiniciarCruzadinha()">Reiniciar</button></div><p id="feedbackCruz" class="feedback" aria-live="polite">Para ver o resultado, clique em Conferir.</p></div><div class="painel pistas"><div><h3>Horizontais</h3>' + horizontais + '</div><div><h3>Verticais</h3>' + verticais + '</div></div></div>';
    pistaAtiva = 0;
    destacarPista();
}

function destacarPista() {
    for (const chave in letras) {
        document.querySelector("#casa-" + chave).classList.toggle("ativa", caminhos[pistaAtiva].includes(chave));
    }
    for (let i = 0; i < palavras.length; i++) {
        document.querySelector("#pista-" + i).ariaPressed = i === pistaAtiva ? "true" : "false";
    }
}

function selecionarPista(indice) {
    pistaAtiva = indice;
    destacarPista();
    const primeira = caminhos[indice][0];
    document.querySelector("#casa-" + primeira).focus();
}

function focarCasa(chave) {
    if (!caminhos[pistaAtiva].includes(chave)) {
        pistaAtiva = caminhos.findIndex(caminho => caminho.includes(chave));
        destacarPista();
    }
    document.querySelector("#casa-" + chave).select();
}

function digitarCasa(campo, chave) {
    campo.value = campo.value.toUpperCase().normalize("NFD").replace(/[^A-Z]/g, "").slice(0, 1);
    rascunhoCruz[chave] = campo.value;
    campo.classList.remove("certa", "errada");
    for (let i = 0; i < caminhos.length; i++) {
        if (caminhos[i].includes(chave)) {
            const pista = document.querySelector("#pista-" + i);
            pista.classList.remove("certa", "errada");
            pista.removeAttribute("aria-description");
            pista.querySelector(".statusPista").innerHTML = "";
        }
    }
    placarCruz.innerHTML = "Resultado pendente";
    feedbackCruz.innerHTML = "Clique em Conferir para atualizar o resultado.";
    const caminho = caminhos[pistaAtiva];
    const proxima = caminho[caminho.indexOf(chave) + 1];
    if (campo.value && proxima) document.querySelector("#casa-" + proxima).focus();
}

function teclaCasa(evento, chave) {
    const [linha, coluna] = chave.split("-").map(Number);
    const movimentos = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
    const movimento = movimentos[evento.key];
    if (movimento) {
        evento.preventDefault();
        const alvo = (linha + movimento[0]) + "-" + (coluna + movimento[1]);
        if (letras[alvo]) {
            const direcao = movimento[0] ? "V" : "H";
            const pista = caminhos.findIndex((caminho, i) => palavras[i][3] === direcao && caminho.includes(chave) && caminho.includes(alvo));
            if (pista >= 0) {
                pistaAtiva = pista;
                destacarPista();
            }
            document.querySelector("#casa-" + alvo).focus();
        }
    }
    if (evento.key === "Backspace" && !evento.target.value) {
        const caminho = caminhos[pistaAtiva];
        const anterior = caminho[caminho.indexOf(chave) - 1];
        if (anterior) {
            evento.preventDefault();
            document.querySelector("#casa-" + anterior).focus();
        }
    }
}

function conferirCruzadinha() {
    let acertos = 0;
    let erros = 0;
    for (const chave in letras) {
        const campo = document.querySelector("#casa-" + chave);
        campo.classList.toggle("certa", campo.value === letras[chave]);
        campo.classList.toggle("errada", campo.value !== "" && campo.value !== letras[chave]);
    }
    for (let i = 0; i < palavras.length; i++) {
        const valores = caminhos[i].map(chave => document.querySelector("#casa-" + chave).value);
        const completa = valores.every(valor => valor !== "");
        const certa = valores.join("") === palavras[i][0];
        const pista = document.querySelector("#pista-" + i);
        pista.classList.toggle("certa", certa);
        pista.classList.toggle("errada", completa && !certa);
        pista.setAttribute("aria-description", certa ? "Correta" : completa ? "Incorreta" : "Incompleta");
        pista.querySelector(".statusPista").innerHTML = certa ? "✓" : completa ? "×" : "";
        if (certa) acertos++;
        if (completa && !certa) erros++;
    }
    placarCruz.innerHTML = acertos + " de " + palavras.length + " palavras corretas";
    const incompletas = palavras.length - acertos - erros;
    feedbackCruz.innerHTML = acertos === palavras.length
        ? "Cruzadinha concluída. Recorde de 160 XP!"
        : erros + " incorretas · " + incompletas + " incompletas";
    registrar(acertos * 10, acertos === palavras.length);
}

function reiniciarCruzadinha() {
    for (const chave in rascunhoCruz) delete rascunhoCruz[chave];
    montarCruzadinha();
    selecionarPista(0);
}

let rodadaQuiz = [];
let indiceQuiz = 0;
let acertosQuiz = 0;
let respondeuQuiz = false;
let alternativas = [];

function iniciarQuiz() {
    rodadaQuiz = perguntas.slice();
    embaralhar(rodadaQuiz);
    indiceQuiz = 0;
    acertosQuiz = 0;
    mostrarPergunta();
}

function mostrarPergunta() {
    if (indiceQuiz === rodadaQuiz.length) {
        areaJogo.innerHTML = '<div class="painel painelJogo"><h2 tabindex="-1" id="focoQuiz">Quiz concluído</h2><p>Você acertou ' + acertosQuiz + ' de ' + rodadaQuiz.length + ' perguntas nesta rodada.</p><button class="botao primario" onclick="abrirJogo(1)">Jogar novamente</button></div>';
    } else {
        respondeuQuiz = false;
        alternativas = [0, 1, 2, 3];
        embaralhar(alternativas);
        const pergunta = rodadaQuiz[indiceQuiz];
        let botoes = "";
        for (let i = 0; i < alternativas.length; i++) {
            botoes += '<button class="opcao" onclick="responderQuiz(' + i + ')"><span>' + "ABCD"[i] + '</span>' + pergunta[1][alternativas[i]] + '</button>';
        }
        areaJogo.innerHTML = '<div class="painel painelJogo"><p class="estado">Pergunta ' + (indiceQuiz + 1) + ' de ' + rodadaQuiz.length + ' · ' + acertosQuiz + ' acertos</p><h2 tabindex="-1" id="focoQuiz">' + pergunta[0] + '</h2><div class="opcoes">' + botoes + '</div><p id="feedbackQuiz" class="feedback" aria-live="polite"></p><div class="controles"><button id="avancarQuiz" class="botao primario" onclick="proximaPergunta()" hidden>' + (indiceQuiz === rodadaQuiz.length - 1 ? "Ver resultado" : "Próxima pergunta") + '</button></div></div>';
    }
}

function responderQuiz(posicao) {
    if (!respondeuQuiz) {
        respondeuQuiz = true;
        const acertou = alternativas[posicao] === 0;
        if (acertou) acertosQuiz++;
        const botoes = areaJogo.querySelectorAll(".opcao");
        for (let i = 0; i < botoes.length; i++) {
            botoes[i].disabled = true;
            if (alternativas[i] === 0) botoes[i].classList.add("certa");
            if (i === posicao && !acertou) botoes[i].classList.add("errada");
        }
        feedbackQuiz.classList.add(acertou ? "certa" : "errada");
        feedbackQuiz.innerHTML = (acertou ? "Correto! " : "Resposta certa: " + rodadaQuiz[indiceQuiz][1][0] + ". ") + rodadaQuiz[indiceQuiz][2];
        avancarQuiz.hidden = false;
        avancarQuiz.focus();
        registrar(acertosQuiz * 10, indiceQuiz === rodadaQuiz.length - 1);
    }
}

function proximaPergunta() {
    if (respondeuQuiz) {
        indiceQuiz++;
        mostrarPergunta();
        focoQuiz.focus();
    }
}

let cartas = [];
let abertas = [];
let totalPares = 0;
let tentativas = 0;
let tempoCartas;

function iniciarMemoria() {
    clearTimeout(tempoCartas);
    cartas = [];
    abertas = [];
    totalPares = 0;
    tentativas = 0;
    for (let i = 0; i < pares.length; i++) {
        cartas.push({ par: i, texto: pares[i][0] });
        cartas.push({ par: i, texto: pares[i][1] });
    }
    embaralhar(cartas);
    let botoes = "";
    for (let i = 0; i < cartas.length; i++) {
        botoes += '<button id="carta-' + i + '" class="carta" aria-label="Carta ' + (i + 1) + ', fechada" onclick="virarCarta(' + i + ')">◇</button>';
    }
    areaJogo.innerHTML = '<div class="painel painelJogo"><p id="placarMemoria" class="estado" aria-live="polite">0 de ' + pares.length + ' pares · 0 tentativas</p><div class="memoria">' + botoes + '</div><p id="feedbackMemoria" class="feedback" aria-live="polite">Vire duas cartas para começar.</p><div class="controles"><button id="reinicioMemoria" class="botao secundario" onclick="reiniciarMemoria()">Reiniciar</button></div></div>';
}

function reiniciarMemoria() {
    iniciarMemoria();
    areaJogo.querySelector(".carta").focus();
}

function virarCarta(indice) {
    if (abertas.length < 2 && !abertas.includes(indice) && !cartas[indice].encontrada) {
        const botao = document.querySelector("#carta-" + indice);
        botao.classList.add("virada");
        botao.innerHTML = cartas[indice].texto;
        botao.ariaLabel = cartas[indice].texto;
        abertas.push(indice);
        if (abertas.length === 2) {
            tentativas++;
            if (cartas[abertas[0]].par === cartas[abertas[1]].par) {
                for (const posicao of abertas) {
                    cartas[posicao].encontrada = true;
                    const encontrada = document.querySelector("#carta-" + posicao);
                    encontrada.classList.add("encontrada");
                    encontrada.ariaLabel = cartas[posicao].texto + " · par encontrado";
                    encontrada.ariaDisabled = "true";
                }
                abertas = [];
                totalPares++;
                feedbackMemoria.innerHTML = totalPares === pares.length ? "Você encontrou todos os pares!" : "Par encontrado.";
                registrar(totalPares * 10, totalPares === pares.length);
            } else {
                feedbackMemoria.innerHTML = "Essas cartas pertencem a pares diferentes.";
                tempoCartas = setTimeout(fecharCartas, 1800);
            }
            placarMemoria.innerHTML = totalPares + " de " + pares.length + " pares · " + tentativas + (tentativas === 1 ? " tentativa" : " tentativas");
        }
    }
}

function fecharCartas() {
    for (const indice of abertas) {
        const botao = document.querySelector("#carta-" + indice);
        botao.classList.remove("virada");
        botao.ariaLabel = "Carta " + (indice + 1) + ", fechada";
        botao.innerHTML = "◇";
    }
    abertas = [];
}

let indiceOrdem = 0;
let ordemAtual = [];
let ordemResolvida = false;

function iniciarOrdem() {
    indiceOrdem = 0;
    montarSequencia();
}

function montarSequencia() {
    ordemResolvida = false;
    if (indiceOrdem === sequencias.length) {
        areaJogo.innerHTML = '<div class="painel painelJogo"><h2 id="focoOrdem" tabindex="-1">Treino concluído</h2><p>Você montou as quatro sequências.</p><button class="botao primario" onclick="abrirJogo(3)">Jogar novamente</button></div>';
    } else {
        const etapa = sequencias[indiceOrdem];
        ordemAtual = [0, 1, 2, 3];
        do {
            embaralhar(ordemAtual);
        } while (ordemAtual.every((item, i) => item === i));
        areaJogo.innerHTML = '<div class="painel painelJogo"><p class="estado">Sequência ' + (indiceOrdem + 1) + ' de ' + sequencias.length + '</p><h2 id="focoOrdem" tabindex="-1">' + etapa[0] + '</h2><p>' + etapa[1] + '</p><ol id="listaOrdem" class="sequencia"></ol><div class="controles"><button id="verificarOrdem" class="botao primario" onclick="conferirOrdem()">Conferir ordem</button><button id="avancarOrdem" class="botao primario" onclick="proximaSequencia()" hidden>' + (indiceOrdem === sequencias.length - 1 ? "Ver resultado" : "Próxima sequência") + '</button></div><p id="feedbackOrdem" class="feedback" aria-live="polite"></p></div>';
        mostrarOrdem();
    }
}

function mostrarOrdem() {
    let itens = "";
    for (let i = 0; i < ordemAtual.length; i++) {
        const texto = sequencias[indiceOrdem][2][ordemAtual[i]];
        const limitaSubir = i === 0 || ordemResolvida ? "disabled" : "";
        const limitaDescer = i === ordemAtual.length - 1 || ordemResolvida ? "disabled" : "";
        itens += '<li><span><b>' + (i + 1) + '</b>' + texto + '</span><div class="mover"><button id="sobe-' + i + '" onclick="moverEtapa(' + i + ', -1)" aria-label="Subir: ' + texto + '" ' + limitaSubir + '>↑</button><button id="desce-' + i + '" onclick="moverEtapa(' + i + ', 1)" aria-label="Descer: ' + texto + '" ' + limitaDescer + '>↓</button></div></li>';
    }
    listaOrdem.innerHTML = itens;
}

function moverEtapa(posicao, movimento) {
    const destino = posicao + movimento;
    if (!ordemResolvida && destino >= 0 && destino < ordemAtual.length) {
        const anterior = ordemAtual[posicao];
        ordemAtual[posicao] = ordemAtual[destino];
        ordemAtual[destino] = anterior;
        feedbackOrdem.innerHTML = "";
        mostrarOrdem();
        const botao = document.querySelector((movimento < 0 ? "#sobe-" : "#desce-") + destino);
        if (botao.disabled) document.querySelector((movimento < 0 ? "#desce-" : "#sobe-") + destino).focus();
        else botao.focus();
    }
}

function conferirOrdem() {
    if (ordemAtual.every((item, i) => item === i)) {
        ordemResolvida = true;
        mostrarOrdem();
        verificarOrdem.hidden = true;
        avancarOrdem.hidden = false;
        feedbackOrdem.classList.remove("errada");
        feedbackOrdem.classList.add("certa");
        feedbackOrdem.innerHTML = sequencias[indiceOrdem][3];
        registrar((indiceOrdem + 1) * 10, indiceOrdem === sequencias.length - 1);
        avancarOrdem.focus();
    } else {
        const corretas = ordemAtual.filter((item, i) => item === i).length;
        feedbackOrdem.classList.add("errada");
        feedbackOrdem.innerHTML = corretas + " de 4 etapas no lugar certo. Ajuste a sequência e tente novamente.";
    }
}

function proximaSequencia() {
    if (ordemResolvida) {
        indiceOrdem++;
        montarSequencia();
        focoOrdem.focus();
    }
}

atualizarPainel();
