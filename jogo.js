const fs = require('fs');
const path = require('path');

new Vue({
  el: '#appVue',
  data: {
    acoesRestantes: 4,
    // Jogador
    jogadores: [],
    jogadorAtivo: {},
    cartasJogo: [],
    // Cidades
    cidades: [],
    conexoesCidades: [],
    // Doença
    doencas: [],
    //Infeccao
    marcadorInfeccao: {},
    espacosMarcadorInfeccao: [],
    //Surto
    marcadorSurto: {},
    espacosMarcadorSurto: [],
    //Cartas Infeccao
    cartasInfeccao: {
      monteAtivo: [],
      amostra: { cidade: '' },
      monteDescarte: [],
    },
    //Centro Pesquisa
    centrosPesquisa: [],
    controls: {
      mostrarCartaReferencia: false,
      mostrarCartasJogador: false,
    },
  },
  created() {
    const params = new URLSearchParams(window.location.search);
    const nomesJogadores = params.getAll('nomesjogadores[]');
    this.PosicionarPeoes(nomesJogadores);
    //cores: ['red', 'blue', 'yellow', 'black'],
  },
  async mounted() {
    await this.MontandoTabuleiro();
  },
  watch: {
    acoesRestantes(novoValor) {
      if (novoValor === 0) {
        this.TrocarJogadorAtivo();
      }
    },
  },
  methods: {
    //-Métodos de Preparação do Jogo
    //--Carregando Tabuleiro
    cityStyle(city) {
      return {
        top: city.top,
        left: city.left,
      };
    },
    lineStyle(connection) {
      const from = this.cidades.find(c => c.id === connection.from);
      const to = this.cidades.find(c => c.id === connection.to);

      const fromX = parseFloat(from.left);
      const fromY = parseFloat(from.top);
      const toX = parseFloat(to.left);
      const toY = parseFloat(to.top);

      const length = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
      const angle = (Math.atan2(toY - fromY, toX - fromX) * 180) / Math.PI;

      return {
        width: `${length}%`,
        top: `${fromY}%`,
        left: `${fromX}%`,
        transform: `rotate(${angle}deg)`,
      };
    },
    CarregarEspacosMarcadorInfeccao() {},
    CarregarEspacosMarcadorSurto() {},

    //--Arrumando Mesa
    CarregarCartasJogo() {
      for (const cidade of this.cities) {
        this.cartasJogo.push({
          tipo: 'cidade',
          conteudo: cidade.nome,
        });
      }
    },
    CarregarCartasInfeccao() {
      for (const cidade of this.cities) {
        this.cartasInfeccao.push({
          cidade: cidade.nome,
        });
      }
    },
    PosicionarPeoes(nomesJogadores) {
      const coresPeao = ['pink', 'blue', 'green', 'red', 'yellow', 'orange'];
      nomesJogadores.forEach((nome, index) => {
        this.jogadores.push({
          id: index,
          nome: nome,
          cartaPersonagem: [],
          cartas: [],
          peao: {
            lugar: 'São Paulo',
            cor: coresPeao[index % coresPeao.length],
          },
        });
      });
    },
    PosicionarCubosDoenca() {
      for (const doenca of this.doencas) {
        for (let i = 0; i < 24; i++) {
          this.pinosDoenca.push({
            cor: doenca.cor,
            posicao: 'caixa',
          });
        }
      }
    },
    PosicionarMarcadoresCura() {},
    PosicionarMarcadoresInfeccao() {},
    PosicionarMarcadoresSurto() {},
    PosicionarCentrosPesquisa() {},
    DistribuirCartas() {
      const filePath = path.join(__dirname, 'data', 'CartasPersonagem.json');

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Erro ao ler o arquivo:', err);
          return;
        }

        const cartasPersonagem = JSON.parse(data);
        const funcoesEmbaralhadas = [...funcoes].sort(() => Math.random() - 0.5);

        this.jogadores.forEach((jogador, index) => {
          jogador.cartaPersonagem = cartasPersonagem[index % cartasPersonagem.length];
          jogador.funcao = funcoesEmbaralhadas[index % funcoesEmbaralhadas.length];

          jogador.cartas = [];
          const cartasPorJogador = 1;
          for (let i = 0; i < cartasPorJogador; i++) {
            const carta = this.cartasJogo.shift();
            if (carta) jogador.cartas.push(carta);
          }
        });

        this.jogadorAtivo = this.jogadores[0];
      });
    },
    async MontarTabuleiro() {},

    //--ComeçandoJogo
    PrimeiraJogadaComputador() {},

    //-Jogo Começado
    //--computador
    TrocarJogadorAtivo() {
      this.jogadores[this.jogadorAtivo.id] = this.jogadorAtivo;

      const proximoId = (this.jogadorAtivo.id + 1) % this.jogadores.length;
      this.jogadorAtivo = this.jogadores[proximoId];
    },
    //--jogador
  },
});
