const palavras = [
    ["QUADCORE", 0, 3, "H", "Classificação de um processador que tem exatamente quatro núcleos."],
    ["RAM", 0, 9, "V", "Área de trabalho volátil que guarda programas e dados em uso."],
    ["ULA", 0, 13, "V", "Parte da CPU que faz somas, subtrações e operações como AND."],
    ["UC", 0, 13, "H", "Parte da CPU que interpreta instruções e comanda os demais circuitos."],
    ["MEMORIADEMASSA", 2, 0, "H", "Categoria à qual pertencem SSDs e HDs usados para guardar arquivos."],
    ["DMA", 2, 7, "V", "Recurso que move blocos entre periféricos e RAM sem cópia manual pelo processador."],
    ["EEPROM", 3, 15, "V", "Tecnologia não volátil do Uno usada para guardar pequenas configurações alteráveis byte a byte."],
    ["ROM", 4, 0, "V", "Tipo clássico que guarda conteúdo fixo, normalmente gravado na fabricação."],
    ["REGISTRADORES", 4, 0, "H", "Pequenos espaços internos do processador que guardam operandos e resultados imediatos."],
    ["DATABUS", 4, 8, "V", "Nome em inglês do caminho que leva os valores trocados entre componentes."],
    ["MICROCONTROLADOR", 6, 0, "H", "Tipo de chip do Arduino Uno que reúne núcleo, armazenamento interno e periféricos."],
    ["DUALCORE", 6, 13, "V", "Classificação de um processador que tem exatamente dois núcleos."],
    ["ADDRESSBUS", 8, 1, "H", "Nome em inglês do caminho que indica qual posição será acessada."],
    ["FLASH", 10, 5, "H", "Tecnologia não volátil apagada em blocos que guarda o programa no Arduino Uno."],
    ["CACHE", 10, 11, "H", "Área rápida que mantém cópias de informações usadas recentemente ou com frequência."],
    ["CPU", 10, 11, "V", "Bloco do computador que busca e executa as instruções de um programa."]
];

const perguntas = [
    ["Quais são os três blocos básicos de um computador?", ["CPU, memória e entrada/saída", "ULA, UC e registradores", "Flash, RAM e EEPROM", "Endereço, dados e comando"], "A CPU executa instruções, a memória guarda informações e a entrada/saída conecta o sistema ao exterior."],
    ["Qual registro indica o endereço da próxima instrução a buscar?", ["PC", "IR", "CPI", "ULA"], "O contador de programa (PC) aponta a próxima instrução. O IR guarda a instrução já buscada."],
    ["Quem decodifica uma instrução e coordena sua execução?", ["UC", "ULA", "Cache", "Barramento de dados"], "A Unidade de Controle interpreta a instrução e envia sinais aos circuitos envolvidos."],
    ["Por que o ATmega328P é um microcontrolador?", ["Reúne CPU, memória e periféricos em um chip", "Tem quatro núcleos", "Depende de RAM e periféricos externos para funcionar", "É um tipo de memória flash"], "O chip do Arduino Uno reúne processamento, memória e periféricos de entrada e saída."],
    ["Onde o Arduino Uno armazena o programa que você grava pela IDE?", ["Flash", "RAM", "Cache", "Registradores da CPU"], "A Flash retém o programa mesmo quando a placa está desligada."],
    ["O que passa pelo barramento de endereço?", ["A indicação da posição que será acessada", "O valor que será escrito", "O ritmo do clock", "A quantidade de instruções do programa"], "Esse barramento indica onde ocorre o acesso. Os valores trafegam no barramento de dados."],
    ["Quantas posições diferentes podem ser identificadas com 11 bits de endereço?", ["2.048", "1.024", "11", "4.096"], "Cada bit tem duas possibilidades. Logo, 11 bits permitem 2¹¹ endereços distintos."],
    ["Que sinal informa se um acesso é de leitura ou de escrita?", ["Um sinal do barramento de controle", "Um valor do barramento de dados", "Um endereço de memória", "Um bit do contador de programa"], "Os sinais de controle indicam o tipo de operação que os componentes devem realizar."],
    ["Qual tecnologia perde os dados quando o computador é desligado?", ["RAM", "EEPROM", "ROM", "Flash"], "A RAM é volátil e guarda dados temporários que os programas estão usando."],
    ["Qual é o papel da CPU em uma transferência por DMA?", ["Configurar a transferência e tratar a conclusão", "Copiar todos os bytes individualmente", "Guardar o arquivo em cache", "Transformar a RAM em memória permanente"], "A CPU configura a transferência. O controlador de DMA move os dados e pode sinalizar o término à CPU."],
    ["Se o clock é de 16 MHz, quanto dura aproximadamente um ciclo?", ["62,5 ns", "16 ns", "6,25 ns", "160 ns"], "O período é o inverso da frequência. 1 dividido por 16 milhões de hertz dá 62,5 nanossegundos."],
    ["Uma instrução usa 4 ciclos de 2 ns cada. Quanto tempo ela leva?", ["8 ns", "2 ns", "4 ns", "16 ns"], "Multiplique a quantidade de ciclos pelo período de cada ciclo. 4 × 2 ns = 8 ns."]
];

const pares = [
    ["ULA", "Faz contas e operações lógicas."],
    ["UC", "Interpreta instruções e comanda os circuitos."],
    ["RAM", "Guarda dados temporários enquanto há energia."],
    ["Flash", "Guarda o programa gravado no Arduino Uno."],
    ["Cache", "Mantém cópias para acelerar acessos."],
    ["DMA", "Move blocos de dados com pouca intervenção da CPU."],
    ["Barramento de endereço", "Indica qual posição será acessada."],
    ["Barramento de dados", "Transporta o valor lido ou escrito."]
];

const sequencias = [
    ["Ciclo da instrução", "Ordene as fases de uma instrução que grava o resultado.", ["Buscar a instrução na memória", "Decodificar a instrução", "Executar a operação", "Gravar o resultado"], "A CPU busca a instrução, interpreta o comando, executa a operação e grava o resultado quando necessário."],
    ["Hierarquia de memória", "Ordene da mais rápida para a mais lenta, na hierarquia típica.", ["Registradores", "Cache", "RAM", "Memória de massa"], "Os registradores ficam dentro da CPU. Depois vêm cache, RAM e armazenamento."],
    ["Transferência por DMA", "Organize uma transferência de dados, da configuração ao aviso de conclusão.", ["A CPU configura a transferência", "O controlador DMA obtém acesso ao barramento", "O controlador DMA transfere o bloco", "O controlador DMA sinaliza a conclusão"], "A CPU configura a operação, que o controlador de DMA executa. Ao concluir, ele pode avisar a CPU."],
    ["Busca de uma instrução", "Ordene os eventos da busca, do endereço conhecido até a instrução pronta para decodificar.", ["O PC aponta o endereço da instrução", "A CPU envia esse endereço à memória e solicita leitura", "A memória devolve a instrução pelo barramento de dados", "O IR guarda a instrução recebida"], "O PC indica a posição da instrução e o IR guarda os dados devolvidos pela memória."]
];
