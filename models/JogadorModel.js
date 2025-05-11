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

  Acao(cidade, acaoSelecionada, cidades, cartasJogo, conexoes, centrosPesquisa, doencas, jogadores) {
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
        // Verifica se o jogador tem a carta da cidade onde ele está
        if (this.cartas.some(carta => carta.conteudo === this.peao.lugar)) {
          // Se tiver a carta, ele pode viajar
          this.peao.lugar = cidade.nome;
          // Remove a carta da cidade atual (já que foi usada no voo fretado)
          this.DescartarCarta(this.peao.lugar);
        } else {
          return { mensagem: 'Você precisa ter a carta da cidade atual para usar o voo fretado.' };
        }
        break;

      case 'Ponte Aérea':
        if (this.TemCentroPesquisa(centrosPesquisa, this.peao.lugar) && this.TemCentroPesquisa(centrosPesquisa, cidade.nome)) {
          this.peao.lugar = cidade.nome;
        } else {
          return { mensagem: 'Ambas as cidades devem ter um centro de pesquisa para usar a ponte aérea.' };
        }
        break;

      case 'Tratar Doença':
        // Verifica se o jogador está na cidade correta para tratar a doença
        if (this.peao.lugar === cidade.nome) {
          let mensagemTrato = 'Você não tem cubos de doença para remover nesta cidade.';
          // Itera sobre todas as doenças
          for (let doenca of doencas) {
            // Verifica se a cor da doença corresponde à cor da cidade
            if (doenca.cor === cidade.cor) {
              // Verifica se há cubos de doença nessa cidade
              const cubosCidade = doenca.cubosDoenca.filter(cubo => cubo.posicao === cidade.nome);

              if (cubosCidade.length > 0) {
                // Remove um cubo de doença da cidade e coloca na caixa
                cubosCidade[0].posicao = 'caixa';
                mensagemTrato = '';
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
        if (!this.TemCentroPesquisa(centrosPesquisa, this.peao.lugar)) {
          return { mensagem: 'Você precisa estar em uma cidade com centro de pesquisa para encontrar a cura.' };
        }

        // Agrupa as cartas por cor
        const cartasPorCor = {};
        this.cartas.forEach(carta => {
          if (carta.tipo === 'cidade') {
            if (!cartasPorCor[carta.descricao]) {
              cartasPorCor[carta.descricao] = [];
            }
            cartasPorCor[carta.descricao].push(carta);
          }
        });

        // Procura por uma cor com 5 cartas
        let corComCura = null;
        for (let cor in cartasPorCor) {
          if (cartasPorCor[cor].length >= 5) {
            corComCura = cor;
            break;
          }
        }

        if (corComCura) {
          // Remove 5 cartas da cor usada para a cura
          let cartasDescartadas = 0;
          this.cartas = this.cartas.filter(carta => {
            if (carta.tipo === 'cidade' && carta.descricao === corComCura && cartasDescartadas < 5) {
              cartasDescartadas++;
              return false; // remove a carta
            }
            return true;
          });

          // Aqui você pode marcar que a cura foi encontrada para essa doença no jogo (precisa ajustar no escopo global)
          return { mensagem: `Cura encontrada para a doença de cor ${corComCura}!` };
        } else {
          return { mensagem: 'Você precisa de 5 cartas da mesma cor para encontrar a cura.' };
        }

      case 'Construir Centro de Pesquisa':
        // Verifica se o jogador tem a carta da cidade atual
        const temCarta = this.cartas.some(carta => carta.conteudo === this.peao.lugar);
        if (temCarta) {
          // Verifica se já existe um centro de pesquisa na cidade atual
          if (!this.TemCentroPesquisa(centrosPesquisa, this.peao.lugar)) {
            // Procura por um centro de pesquisa com a posição 'caixa' para ser movido
            const centroDePesquisaCaixa = centrosPesquisa.find(centro => centro.posicao === 'caixa');

            if (centroDePesquisaCaixa) {
              centroDePesquisaCaixa.posicao = this.peao.lugar; // Atualiza a posição do centro de pesquisa
              console.log(`Centro de pesquisa foi construído em ${this.peao.lugar}.`);
            } else {
              return { mensagem: 'Não há centros de pesquisa disponíveis para construção.' };
            }

            // Descarta a carta da cidade atual
            this.DescartarCarta(this.peao.lugar);
          } else {
            return { mensagem: `Já existe um centro de pesquisa em ${this.peao.lugar}.` };
          }
        } else {
          return { mensagem: 'Você precisa ter a carta da cidade atual para construir um centro de pesquisa.' };
        }
        break;

      case 'Compartilhar Conhecimento':
        for (let jogador of jogadores) {
          if (jogador.id !== this.id && jogador.peao.lugar === this.peao.lugar) {
            // Verifica se o jogador atual tem a carta da cidade em que estão
            const cartaParaCompartilhar = this.cartas.find(c => c.conteudo === cidade.nome);
            if (cartaParaCompartilhar) {
              // Remove a carta do jogador atual
              this.cartas = this.cartas.filter(c => c !== cartaParaCompartilhar);
              // Adiciona a carta ao outro jogador
              jogador.cartas.push(cartaParaCompartilhar);

              window.alert(`Sua carta da cidade ${cidade.nome} foi passada para ${jogador.nome}.`);
              return { mensagem: `Carta compartilhada com ${jogador.nome}` };
            } else {
              return { mensagem: `Você não possui a carta da cidade ${cidade.nome}.` };
            }
          }
        }
        return { mensagem: 'Não há outro jogador na mesma cidade para compartilhar conhecimento.' };
    }
  }

  EstaConectada(nomeA, nomeB, conexoes) {
    if (!Array.isArray(conexoes)) return false;
    return conexoes.some(c => (c.from === nomeA && c.to === nomeB) || (c.from === nomeB && c.to === nomeA));
  }

  TemCentroPesquisa(centrosPesquisa, posicao) {
    return centrosPesquisa.some(centro => centro.posicao === posicao);
  }

  DescartarCarta(nomeCidade) {
    this.cartas = this.cartas.filter(carta => carta.conteudo !== nomeCidade);
  }

  reiniciarCartas() {
    this.cartas = [];
  }
}
