import cartasEpidemiaJson from './data/CartasEpidemia.js';
import cartasEventoJson from './data/CartasEvento.js';
import cartasPersonagemJson from './data/CartasPersonagem.js';
import cidadesJson from './data/Cidades.js';
import conexoesCidadeJson from './data/ConexoesCidade.js';
import doencasJson from './data/Doencas.js';
import espacosMarcadorInfeccaoJson from './data/EspacosMarcadorInfeccao.js';
import espacosMarcadorSurtoJson from './data/EspacosMarcadorSurto.js';

new Vue({
  el: '#appVue',
  data: {
    nomesJogadores: [],
    acoesRestantes: 4,
    // Jogador
    jogadores: [],
    jogadorAtivo: {},
    cartasJogo: [],
    // Cidades
    cidades: cidadesJson,
    conexoesCidades: conexoesCidadeJson,
    // Doença
    doencas: doencasJson,
    //Infeccao
    marcadorInfeccao: {},
    espacosMarcadorInfeccao: espacosMarcadorInfeccaoJson,
    //Surto
    marcadorSurto: {},
    espacosMarcadorSurto: espacosMarcadorSurtoJson,
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
    this.nomesJogadores = params.getAll('nomesjogadores[]');
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

    //--Arrumando Mesa
    CarregarCartasJogo() {
      this.cartasJogo = [];

      // 1. Adiciona cartas de cidade
      for (const cidade of this.cidades) {
        this.cartasJogo.push({
          tipo: 'cidade',
          conteudo: cidade.nome,
        });
      }

      // 2. Adiciona cartas de evento
      for (const carta of cartasEventoJson) {
        this.cartasJogo.push({
          tipo: 'evento',
          conteudo: carta.conteudo,
        });
      }

      // 3. Embaralha cartas de cidade + evento
      this.cartasJogo = this.Embaralhar(this.cartasJogo);

      // 4. Armazena cartas de epidemia separadamente (serão inseridas depois)
      this.cartasEpidemia = cartasEpidemiaJson.map(carta => ({
        tipo: 'epidemia',
        conteudo: carta.conteudo,
      }));
    },
    Embaralhar(array) {
      return [...array].sort(() => Math.random() - 0.5);
    },
    InserirCartasEpidemiaNoBaralho(numEpidemias = 4) {
      const montes = [];
      const tamanhoMonte = Math.ceil(this.cartasJogo.length / numEpidemias);

      // Divide em montinhos
      for (let i = 0; i < numEpidemias; i++) {
        const monte = this.cartasJogo.splice(0, tamanhoMonte);

        // Adiciona 1 carta de epidemia e embaralha o monte
        const epidemia = this.cartasEpidemia[i];
        if (epidemia) monte.push(epidemia);

        montes.push(this.Embaralhar(monte));
      }

      // Junta os montes para formar o novo baralho
      this.cartasJogo = montes.flat();
    },
    CarregarCartasInfeccao() {
      for (const cidade of this.cidades) {
        this.cartasInfeccao.monteAtivo.push({
          cidade: cidade.nome,
        });
      }
    },
    PosicionarPeoes() {
      const coresPeao = ['pink', 'blue', 'green', 'red', 'yellow', 'orange'];
      this.nomesJogadores.forEach((nome, index) => {
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
          doenca.cubosDoenca.push({
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
    AtribuirCartasEPersonagens() {
      const personagensEmbaralhados = [...cartasPersonagemJson].sort(() => Math.random() - 0.5);

      // Regra de negócio: determinar número de cartas iniciais
      let cartasPorJogador = 2;
      const totalJogadores = this.jogadores.length;
      if (totalJogadores === 2) cartasPorJogador = 4;
      else if (totalJogadores === 3) cartasPorJogador = 3;
      else if (totalJogadores === 4) cartasPorJogador = 2;

      this.jogadores.forEach((jogador, index) => {
        const personagem = personagensEmbaralhados[index % personagensEmbaralhados.length];
        jogador.cartaPersonagem = personagem;
        jogador.funcao = personagem.funcao;

        jogador.cartas = [];
        for (let i = 0; i < cartasPorJogador; i++) {
          const carta = this.cartasJogo.shift(); // tira do topo do baralho
          if (carta) jogador.cartas.push(carta);
        }
      });
    },
    IniciarJogadores() {
      this.PosicionarPeoes();
      this.AtribuirCartasEPersonagens();
      this.jogadorAtivo = this.jogadores[0];
    },
    MontarTabuleiro() {
      this.IniciarJogadores();
      this.CarregarCartasJogo();
      this.CarregarCartasInfeccao();
      this.InserirCartasEpidemiaNoBaralho(4); //dificuldade normal
      this.PosicionarCubosDoenca();
      this.PosicionarMarcadoresInfeccao();
      this.PosicionarMarcadoresSurto();
      this.PosicionarCentrosPesquisa();
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
