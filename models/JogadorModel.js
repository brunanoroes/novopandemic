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
    const cartasCompradas = [];

    for (let i = 0; i < numCartas; i++) {
      const carta = monteCartasJogo.pop();
      if (carta) {
        if (carta.tipo === 'epidemia') {
          // Ainda adiciona a carta ao jogador, se for o caso
          this.cartas.push(carta);
        } else {
          this.cartas.push(carta);
        }
        cartasCompradas.push(carta);
      }
    }

    const nomes = cartasCompradas.map(c => c.nome || c.tipo).join(', ');
    return {
      mensagem: `${this.nome} comprou as cartas: ${nomes}`,
      cartasCompradas,
    };
  }

  Acao(cidade, acaoSelecionada, cidades, cartasJogo, conexoes, centrosPesquisa, doencas) {
    switch (acaoSelecionada) {
      case 'Balsa':
        if (this.EstaConectada(this.peao.lugar, cidade.nome, conexoes)) {
          this.peao.lugar = cidade.nome;
          return { mensagem: `Você usou a balsa para ir para ${cidade.nome}.` };
        } else {
          return { mensagem: 'Você não pode andar de balsa para essa cidade. As cidades precisam estar conectadas.' };
        }
        break;

      case 'Voo Direto':
        if (this.cartas.some(c => c.conteudo === cidade.nome)) {
          this.peao.lugar = cidade.nome;
          this.DescartarCarta(cidade.nome);
          return { mensagem: `Você usou o voo direto para ir para ${cidade.nome}.` };
        } else {
          return { mensagem: 'Você precisa ter a carta da cidade de destino para usar o voo direto.' };
        }
        break;

      case 'Voo Fretado':
        // Verifica se o jogador tem a carta da cidade onde ele está
        if (this.cartas.some(carta => carta.conteudo === this.peao.lugar)) {
          // Se tiver a carta, ele pode viajar
          this.peao.lugar = cidade.nome;
          // Remove a carta da cidade atual (já que foi usada no voo fretado)
          this.DescartarCarta(this.peao.lugar);
          return { mensagem: `Você usou o voo fretado para ir para ${cidade.nome}.` };
        } else {
          return { mensagem: 'Você precisa ter a carta da cidade atual para usar o voo fretado.' };
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
        // Verifica se o jogador está na cidade correta para tratar a doença
        if (this.peao.lugar === cidade.nome) {
          let mensagemTrato = 'Você não tem cubos de doença para remover nesta cidade.';
          console.log(doencas);
          // Itera sobre todas as doenças
          for (let doenca of doencas) {
            // Verifica se a cor da doença corresponde à cor da cidade
            if (doenca.cor === cidade.cor) {
              // Verifica se há cubos de doença nessa cidade
              const cubosCidade = doenca.cubosDoenca.filter(cubo => cubo.posicao === cidade.nome);

              if (cubosCidade.length > 0) {
                // Remove um cubo de doença da cidade e coloca na caixa
                cubosCidade[0].posicao = 'caixa';
                mensagemTrato = `Você tratou a doença ${doenca.nome} em ${cidade.nome}.`;
                break;
              }
            }
          }
          return { mensagem: mensagemTrato };
        } else {
          return { mensagem: 'Você precisa estar na cidade para tratar a doença.' };
        }
        break;

      case 'Encontrar Cura':
        this.TentarEncontrarCura();
        break;

      case 'Construir Centro de Pesquisa':
        if (this.peao.cartas.includes(this.peao.lugar)) {
          // Verifica se o jogador tem a carta da cidade atual
          if (!TemCentroPesquisa(centrosPesquisa, this.peao.lugar)) {
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
