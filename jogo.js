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
  },
  async mounted() {
    await this.MontarTabuleiro();
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
    EstilizarObjetoPosicao(objeto) {
      return {
        top: objeto.top,
        left: objeto.left,
      };
    },
    CriarLinhasConexão(conexao) {
      const from = this.cidades.find(c => c.id === conexao.from);
      const to = this.cidades.find(c => c.id === conexao.to);

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
    CarregarEspacosMarcadorInfeccao() {
      const filePath = path.join(__dirname, 'data', 'EspacosMarcadorInfeccao.json');

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Erro ao ler o arquivo:', err);
          return;
        }

        this.espacosMarcadorInfeccao = JSON.parse(data);
      });
    },
    CarregarEspacosMarcadorSurto() {
      const filePath = path.join(__dirname, 'data', 'EspacosMarcadorSurto.json');

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Erro ao ler o arquivo:', err);
          return;
        }

        this.espacosMarcadorSurto = JSON.parse(data);
      });
    },
    CarregarCidades() {
      const filePath = path.join(__dirname, 'data', 'Cidades.json');

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Erro ao ler o arquivo:', err);
          return;
        }

        this.cidades = JSON.parse(data);
      });
    },

    //--Arrumando Mesa
    CarregarCartasJogo() {
      for (const cidade of this.cidades) {
        this.cartasJogo.push({
          tipo: 'cidade',
          conteudo: cidade.nome,
        });
      }
      const filePath = path.join(__dirname, 'data', 'CartasEpidemia.json');

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Erro ao ler o arquivo:', err);
          return;
        }

        const cartasEpidemia = JSON.parse(data);
        for (const carta of cartasEpidemia) {
          this.cartasJogo.push({
            tipo: 'epidemia',
            conteudo: carta.conteudo,
          });
        }
      });
      const filePath2 = path.join(__dirname, 'data', 'CartasEspeciais.json');

      fs.readFile(filePath2, 'utf8', (err, data) => {
        if (err) {
          console.error('Erro ao ler o arquivo:', err);
          return;
        }

        const cartasEspeciais = JSON.parse(data);
        for (const carta of cartasEspeciais) {
          this.cartasJogo.push({
            tipo: 'especial',
            conteudo: carta.conteudo,
          });
        }
      });
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
    CarregarDoencas() {
      const filePath = path.join(__dirname, 'data', 'Doenca.json');

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Erro ao ler o arquivo:', err);
          return;
        }

        this.doencas = JSON.parse(data);
      });
    },
    PosicionarCubosDoenca() {
      for (const doenca of this.doencas) {
        for (let i = 0; i < 24; i++) {
          this.doencas.cubosDoencas.push({
            posicao: 'caixa',
          });
        }
      }
    },
    PosicionarMarcadoresInfeccao() {
      this.marcadorInfeccao = {
        lugar: 'caixa',
        nivel: 1,
      };
    },
    PosicionarMarcadoresSurto() {
      this.marcadorSurto = {
        lugar: 'caixa',
        nivel: 1,
      };
    },
    PosicionarCentrosPesquisa() {
      this.centrosPesquisa.push({
        posicao: 'São Paulo',
      });
      for (let i = 0; i < 5; i++) {
        this.centrosPesquisa.push({
          posicao: 'caixa',
        });
      }
    },
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
    MontarTabuleiro() {
      this.CarregarCidades();
      this.CarregarEspacosMarcadorInfeccao();
      this.CarregarEspacosMarcadorSurto();
      this.CarregarCartasJogo();
      this.CarregarCartasInfeccao();
      this.CarregarDoencas();
      this.PosicionarCubosDoenca();
      this.PosicionarMarcadoresInfeccao();
      this.PosicionarMarcadoresSurto();
      this.PosicionarCentrosPesquisa();
      this.DistribuirCartas();
    },

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
