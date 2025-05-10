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

  Acao(cidade, acaoSelecionada, cidades, cartasJogo, conexoes, centrosPesquisa) {
    switch (acaoSelecionada) {
      case 'Balsa':
        if (this.EstaConectada(this.peao.lugar, cidade.nome, conexoes)) {
          this.peao.lugar = cidade.nome;
        } else {
          return { mensagem: 'Você não pode andar de balsa para essa cidade. As cidades precisam estar conectadas.' };
        }
        break;

      case 'Voo Direto':
        if (this.cartas.some(c => c.conteudo === cidade.nome)) {
          this.peao.lugar = cidade.nome;
          this.DescartarCarta(cidade.nome);
        } else {
          return { mensagem: 'Você precisa ter a carta da cidade de destino para usar o voo direto.' };
        }
        break;

      case 'Voo Fretado':
        if (this.peao.cartas.includes(this.peao.lugar.nome)) {
          this.peao.lugar = cidade.nome;
          this.DescartarCarta(this.peao.lugar.nome);
        } else {
          return { mensagem: 'Você precisa descartar a carta da cidade atual para usar o voo fretado.' };
        }
        break;

      case 'Ponte Aérea':
        if (this.TemCentroPesquisa(centrosPesquisa, this.peao.lugar)) {
          this.peao.lugar = cidade.nome;
        } else {
          return { mensagem: 'Ambas as cidades devem ter um centro de pesquisa para usar a ponte aérea.' };
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
          // Verifica se o jogador tem a carta da cidade atual
          if (!TemCentroPesquisa(centrosPesquisa, this.peao.lugar.nome)) {
            // Verifica se já existe um centro de pesquisa na cidade atual
            // Verifica se existe um centro de pesquisa com a posição 'caixa' e transforma ele para a cidade atual
            const centroDePesquisaCaixa = centrosPesquisa.find(centro => centro.posicao === 'caixa');

            if (centroDePesquisaCaixa) {
              centroDePesquisaCaixa.posicao = this.peao.lugar.nome; // Atualiza a posição do centro de pesquisa para a cidade atual
              console.log(`Centro de pesquisa foi construído em ${this.peao.lugar.nome}.`);
            } else {
              return { mensagem: 'Não há centros de pesquisa disponíveis para construção.' };
            }

            // Descarta a carta da cidade atual
            this.DescartarCarta(this.peao.lugar.nome);
          } else {
            return { mensagem: `Já existe um centro de pesquisa em ${this.peao.lugar.nome}.` };
          }
        } else {
          return { mensagem: 'Você precisa ter a carta da cidade atual para construir um centro de pesquisa.' };
        }
        break;

      case 'Compartilhar Conhecimento':
        this.CompartilharConhecimentoComOutroJogador();
        break;

      default:
        return { mensagem: 'Ação não reconhecida.' };
    }
  }

  EstaConectada(nomeA, nomeB, conexoes) {
    if (!Array.isArray(conexoes)) return false;
    return conexoes.some(c => (c.from === nomeA && c.to === nomeB) || (c.from === nomeB && c.to === nomeA));
  }

  TemCentroPesquisa(centrosPesquisa, posicaoAtual) {
    return centrosPesquisa.some(centro => centro.posicao === posicaoAtual);
  }

  DescartarCarta(nomeCidade) {
    this.cartas = this.cartas.filter(carta => carta.conteudo !== nomeCidade);
  }

  reiniciarCartas() {
    this.cartas = [];
  }
}
