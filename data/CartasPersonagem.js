const cartasPersonagensJson = [
  {
    funcao: 'Pesquisadora',
    imagem: 'assets/pesquisadora.png',
    habilidades: ['Pode dar qualquer carta de cidade ao outro jogador na mesma cidade sem se preocupar com a cor.', 'Facilita a troca de cartas.'],
  },
  {
    funcao: 'Médica',
    imagem: 'assets/medica.png',
    habilidades: ['Remove todos os cubos de uma cor ao tratar a doença.', 'Se a cura estiver descoberta, remove automaticamente os cubos ao entrar na cidade.'],
  },
  {
    funcao: 'Especialista em Quarentena',
    imagem: 'assets/quarentena.png',
    habilidades: ['Previne surtos e a colocação de cubos de doenças na cidade em que está e nas cidades conectadas.'],
  },
  {
    funcao: 'Cientista',
    imagem: 'assets/cientista.png',
    habilidades: ['Precisa de apenas 4 cartas da mesma cor para descobrir a cura (em vez de 5).'],
  },
  {
    funcao: 'Especialista em Operações',
    imagem: 'assets/operacoes.png',
    habilidades: ['Pode construir uma estação de pesquisa sem descartar carta.', 'Pode se mover entre estações de pesquisa livremente.'],
  },
  {
    funcao: 'Despachante',
    imagem: 'assets/despachante.png',
    habilidades: ['Pode mover outros peões como se fossem seus.', 'Se outro jogador estiver na mesma cidade que ele, pode movê-lo para qualquer cidade com estação de pesquisa.'],
  },
];

export default cartasPersonagensJson;
