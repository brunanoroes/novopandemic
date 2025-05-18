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

      // Adiciona a carta comprada ao jogador
      cartasCompradas.push(carta);

      // Se for uma carta de epidemia, você pode querer tratar de forma especial
      if (carta.tipo === 'epidemia') {
        // Talvez você queira fazer algo específico para epidemias aqui
        window.alert(`${this.nome} comprou uma carta de Epidemia!`);
      } else {
        // Se não for epidemia, apenas adiciona a carta ao jogador
        this.cartas.push(carta);
      }
    }
    return {
      cartasCompradas,
    };
  }

  Acao(cidade, acaoSelecionada, cidades, cartasJogo, conexoes, centrosPesquisa, doencas, jogadores, tipo) {
    switch (acaoSelecionada) {
      case 'Balsa':
        if (this.EstaConectada(this.peao.lugar, cidade.nome, conexoes)) {
          this.peao.lugar = cidade.nome;
          return { mensagem: 'Barca Utilizada com Sucesso', tipo: 'sucesso' };
        }
        return { mensagem: 'Você não pode andar de balsa para essa cidade. As cidades precisam estar conectadas.', tipo: 'erro' };
  
      case 'Voo Direto':
        if (this.cartas.some(c => c.conteudo === cidade.nome)) {
          this.peao.lugar = cidade.nome;
          this.DescartarCarta(cidade.nome);
          return { mensagem: 'Voo Direto Utilizado com Sucesso', tipo: 'sucesso' };
        }
        return { mensagem: 'Você precisa ter a carta da cidade de destino para usar o voo direto.', tipo: 'erro' };
  
      case 'Voo Fretado':
        if (this.cartas.some(carta => carta.conteudo === this.peao.lugar)) {
          this.DescartarCarta(this.peao.lugar);
          this.peao.lugar = cidade.nome;
          return { mensagem: 'Voo Fretado Utilizado com Sucesso', tipo: 'sucesso' };
        }
        return { mensagem: 'Você precisa ter a carta da cidade atual para usar o voo fretado.', tipo: 'erro' };
  
      case 'Ponte Aérea':
        if (this.TemCentroPesquisa(centrosPesquisa, this.peao.lugar) && this.TemCentroPesquisa(centrosPesquisa, cidade.nome)) {
          this.peao.lugar = cidade.nome;
          return { mensagem: 'Ponte Aérea Utilizada com Sucesso', tipo: 'sucesso' };
        }
        return { mensagem: 'Ambas as cidades devem ter um centro de pesquisa para usar a ponte aérea.', tipo: 'erro' };
  
      case 'Tratar Doença':
        if (this.peao.lugar !== cidade.nome) {
          return { mensagem: 'Você precisa estar na cidade para tratar a doença.', tipo: 'erro' };
        }
  
        for (let doenca of doencas) {
          if (doenca.cor === cidade.cor) {
            const cubosCidade = doenca.cubosDoenca.filter(cubo => cubo.posicao === cidade.nome);
            if (cubosCidade.length > 0) {
              cubosCidade[0].posicao = 'caixa';
              return { mensagem: 'Doença Tratada com Sucesso', tipo: 'sucesso' };
            }
          }
        }
  
        return { mensagem: 'Você não tem cubos de doença para remover nesta cidade.', tipo: 'erro' };
  
      case 'Encontrar Cura':
        if (!this.TemCentroPesquisa(centrosPesquisa, this.peao.lugar)) {
          return { mensagem: 'Você precisa estar em uma cidade com centro de pesquisa para encontrar a cura.', tipo: 'erro' };
        }
  
        const cartasPorCor = {};
        this.cartas.forEach(carta => {
          if (carta.tipo === 'cidade') {
            if (!cartasPorCor[carta.descricao]) {
              cartasPorCor[carta.descricao] = [];
            }
            cartasPorCor[carta.descricao].push(carta);
          }
        });
  
        let corComCura = null;
        for (let cor in cartasPorCor) {
          if (cartasPorCor[cor].length >= 5) {
            corComCura = cor;
            break;
          }
        }
  
        if (corComCura) {
          let descartadas = 0;
          this.cartas = this.cartas.filter(carta => {
            if (carta.tipo === 'cidade' && carta.descricao === corComCura && descartadas < 5) {
              descartadas++;
              return false;
            }
            return true;
          });
  
          // Aqui você pode marcar a cura globalmente: jogo.curas[corComCura] = true;
          return { mensagem: `Cura encontrada para a doença de cor ${corComCura}!`, tipo: 'sucesso' };
        }
  
        return { mensagem: 'Você precisa de 5 cartas da mesma cor para encontrar a cura.', tipo: 'erro' };
  
      case 'Construir Centro de Pesquisa':
        if (!this.cartas.some(carta => carta.conteudo === this.peao.lugar)) {
          return { mensagem: 'Você precisa ter a carta da cidade atual para construir um centro de pesquisa.', tipo: 'erro' };
        }
  
        if (this.TemCentroPesquisa(centrosPesquisa, this.peao.lugar)) {
          return { mensagem: `Já existe um centro de pesquisa em ${this.peao.lugar}.`, tipo: 'erro' };
        }
  
        const centroDisponivel = centrosPesquisa.find(centro => centro.posicao === 'caixa');
        if (!centroDisponivel) {
          return { mensagem: 'Não há centros de pesquisa disponíveis para construção.', tipo: 'erro' };
        }
  
        centroDisponivel.posicao = this.peao.lugar;
        this.DescartarCarta(this.peao.lugar);
        return { mensagem: `Centro de pesquisa foi construído em ${this.peao.lugar}.`, tipo: 'sucesso' };
  
      case 'Compartilhar Conhecimento':
        for (let jogador of jogadores) {
          if (jogador.id !== this.id && jogador.peao.lugar === this.peao.lugar) {
            const cartaParaCompartilhar = this.cartas.find(c => c.conteudo === cidade.nome);
            if (cartaParaCompartilhar) {
              this.cartas = this.cartas.filter(c => c !== cartaParaCompartilhar);
              jogador.cartas.push(cartaParaCompartilhar);
              return { mensagem: `Sua carta da cidade ${cidade.nome} foi passada para ${jogador.nome}.`, tipo: 'sucesso' };
            }
            return { mensagem: `Você não possui a carta da cidade ${cidade.nome}.`, tipo: 'erro' };
          }
        }
  
        return { mensagem: 'Não há outro jogador na mesma cidade para compartilhar conhecimento.', tipo: 'erro' };
  
      case 'Evento Ponte Aérea':
        this.peao.lugar = cidade.nome;
        this.DescartarCarta(acaoSelecionada);
        return { mensagem: `Carta de Evento de Ponte Aérea utilizada. Jogador foi movido para ${cidade.nome}.`, tipo: 'sucesso' };
  
      case 'Operação Silenciosa':
        for (let doenca of doencas) {
          if (doenca.cor === cidade.cor) {
            const cubosCidade = doenca.cubosDoenca.filter(cubo => cubo.posicao === cidade.nome);
            if (cubosCidade.length > 0) {
              cubosCidade[0].posicao = 'caixa';
              this.DescartarCarta(acaoSelecionada);
              return { mensagem: 'Cubo Removido', tipo: 'sucesso' };
            }
          }
        }
        break
  
      default:
        return { mensagem: 'Ação não reconhecida.', tipo: 'erro' };
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

  UtilizarCartaEvento(referencia) {
    switch (referencia) {
      case 'Evento Ponte Aérea':
        return { mensagem: 'Use Ponte Aérea para mover seu peão para qualquer cidade.' };
  
      case 'Previsão':
        return { mensagem: 'Use Previsão para ver e reordenar as 6 primeiras cartas de infecção.' };
  
      case 'Operação Silenciosa':
        return { mensagem: 'Use Operação Silenciosa para tirar qualquer cubo de qualquer cidade.' };
  
      case 'Recurso Extra':
        return { mensagem: 'Recurso Extra Utilizado' };
  
      default:
        return { mensagem: 'Carta de evento não reconhecida.' };
    }
  }
  
}
