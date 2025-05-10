export default class Jogador {
  constructor(id, nome, cor, cidadeInicial) {
    this.id = id;
    this.nome = nome;
    this.cartas = [];
    this.cartaPersonagem = {
      funcao: '',
      imagem: '',
      habilidades: [],
    };
    this.peao = {
      cor: cor,
      lugar: cidadeInicial,
    };
  }

  atribuirPersonagem(personagem) {
    this.cartaPersonagem = personagem;
    this.funcao = personagem.funcao;
  }

  comprarCartas(numCartas, monteCartasJogo) {
    // Compra as cartas do monte e as adiciona ao jogador
    for (let i = 0; i < numCartas; i++) {
      const carta = monteCartasJogo.pop(); // Remove a carta do monte
      if (carta) {
        this.cartas.push(carta); // Adiciona a carta ao jogador
      }
    }
    console.log(`${this.nome} comprou ${numCartas} cartas.`);
  }

  Acao(cidade, acaoSelecionada, cidades, cartasJogo, conexoes) {
    switch (acaoSelecionada) {
      case 'Balsa':
        if (this.EstaConectada(this.peao.lugar.id, cidade.id)) {
          this.peao.lugar = cidade;
        } else {
          this.AbrirModal('Você não pode andar de balsa para essa cidade. As cidades precisam estar conectadas.');
        }
        break;

      case 'Voo Direto':
        if (this.peao.cartas.includes(cidade.nome)) {
          this.peao.lugar = cidade;
          this.DescartarCarta(cidade.nome);
        } else {
          this.AbrirModal('Você precisa ter a carta da cidade de destino para usar o voo direto.');
        }
        break;

      case 'Voo Fretado':
        if (this.peao.cartas.includes(this.peao.lugar.nome)) {
          this.peao.lugar = cidade;
          this.DescartarCarta(this.peao.lugar.nome);
        } else {
          this.AbrirModal('Você precisa descartar a carta da cidade atual para usar o voo fretado.');
        }
        break;

      case 'Ponte Aérea':
        if (this.TemCentroPesquisa(this.peao.lugar) && this.TemCentroPesquisa(cidade)) {
          this.peao.lugar = cidade;
        } else {
          this.AbrirModal('Ambas as cidades devem ter um centro de pesquisa para usar a ponte aérea.');
        }
        break;

      case 'Tratar Doença':
        this.TratarDoenca(cidade);
        break;

      case 'Encontrar Cura':
        this.TentarEncontrarCura();
        break;

      case 'Construir Centro de Pesquisa':
        if (this.peao.cartas.includes(this.peao.lugar.nome)) {
          cidade.centrosPesquisa = true;
          this.DescartarCarta(this.peao.lugar.nome);
        } else {
          this.AbrirModal('Você precisa ter a carta da cidade atual para construir um centro de pesquisa.');
        }
        break;

      case 'Compartilhar Conhecimento':
        this.CompartilharConhecimentoComOutroJogador();
        break;

      default:
        this.AbrirModal('Ação não reconhecida.');
    }
  }

  EstaConectada(idA, idB, conexoes) {
    return conexoes.some(c => (c.from === idA && c.to === idB) || (c.from === idB && c.to === idA));
  }

  TemCentroPesquisa(cidade) {
    return this.centrosPesquisa.some(c => c.id === cidade.id);
  }

  AbrirModal(mensagem) {
    this.modal.mostrar = true;
    this.modal.mensagem = mensagem;
  }

  DescartarCarta(nomeCidade) {
    this.peao.cartas = this.peao.cartas.filter(carta => carta !== nomeCidade);
  }

  reiniciarCartas() {
    this.cartas = [];
  }
}
