import TabuleiroModel from './models/TabuleiroModel.js';
import cidadesJson from './data/Cidades.js';
import conexoesCidadeJson from './data/ConexoesCidade.js';
import doencasJson from './data/Doencas.js';
import espacosMarcadorInfeccaoJson from './data/EspacosMarcadorInfeccao.js';
import espacosMarcadorSurtoJson from './data/EspacosMarcadorSurto.js';
import acoesJogadorJson from './data/AcoesJogador.js';
import Jogador from './models/JogadorModel.js';
import Doenca from './models/DoencaModel.js';

new Vue({
  el: '#appVue',
  data: {
    nomesJogadores: [],
    acoesRestantes: 4,
    jogadores: [],
    jogadorAtivo: {},
    cartasJogo: [],
    acaoAtual: '',
    cidades: cidadesJson,
    conexoesCidades: conexoesCidadeJson,
    doencas: doencasJson,
    marcadorInfeccao: {},
    espacosMarcadorInfeccao: espacosMarcadorInfeccaoJson,
    marcadorSurto: {},
    espacosMarcadorSurto: espacosMarcadorSurtoJson,
    cartasInfeccao: {
      monteAtivo: [],
      monteDescarte: [],
    },
    controls: {
      mostrarCartaReferencia: false,
      mostrarCartasJogador: false,
      mostrarCartasInfeccao: false,
    },
    tabuleiro: null,
    acoes: acoesJogadorJson,
    modal: {
      mostra: false,
      mensagem: '',
    },
  },
  created() {
    const params = new URLSearchParams(window.location.search);
    this.nomesJogadores = params.getAll('nomesjogadores[]');
  },
  mounted() {
    this.tabuleiro = new TabuleiroModel({
      nomesJogadores: this.nomesJogadores,
      cidades: this.cidades,
      doencas: this.doencas,
      jogadores: this.jogadores,
      cartasInfeccao: this.cartasInfeccao,
      marcadorInfeccao: this.marcadorInfeccao,
      marcadorSurto: this.marcadorSurto,
    });

    this.tabuleiro.MontarTabuleiro();
    this.tabuleiro.PrimeiraInfeccao();

    // sincronizar os dados de volta
    this.jogadores = this.tabuleiro.jogadores;
    this.jogadorAtivo = this.tabuleiro.jogadorAtivo;
    this.cartasJogo = this.tabuleiro.cartasJogo;
    this.marcadorInfeccao = this.tabuleiro.marcadorInfeccao;
    this.marcadorSurto = this.tabuleiro.marcadorSurto;
    this.cartasInfeccao = this.tabuleiro.cartasInfeccao;
  },
  watch: {
    acoesRestantes(novoValor) {
      if (novoValor === 0) {
        // O jogador compra 2 cartas do jogo
        this.jogadorAtivo.comprarCartas(2, this.tabuleiro.cartasJogo);

        const cartas = this.tabuleiro.cartasInfeccao.monteAtivo.splice(0, this.tabuleiro.marcadorInfeccao.nivel);

        cartas.forEach(carta => {
          const cidade = this.cidades.find(c => c.nome === carta.cidade);
          const doenca = this.doencas.find(d => d.cor === cidade.cor);

          if (doenca) {
            const resultado = doenca.infectar(cidade);
            console.log(resultado);
          }

          this.tabuleiro.cartasInfeccao.monteDescarte.push(carta);
        });

        this.acoesRestantes = 4;
        this.TrocarJogadorAtivo();
      }
    },
  },
  methods: {
    EstilizarObjetoPosicao(objeto) {
      return {
        position: 'absolute',
        top: `${objeto.y}%`,
        left: `${objeto.x}%`,
        backgroundColor: objeto.cor,
        transform: 'translate(-50%, -50%)',
      };
    },
    CriarLinhasConexao(conexao) {
      // Encontrar as cidades de origem e destino
      const fromCidade = this.cidades.find(cidade => cidade.id === conexao.from);
      const toCidade = this.cidades.find(cidade => cidade.id === conexao.to);

      // Verificar se as cidades existem
      if (!fromCidade || !toCidade) return null;

      // Calcular as posições para as linhas
      const fromX = fromCidade.x;
      const fromY = fromCidade.y;
      const toX = toCidade.x;
      const toY = toCidade.y;

      // Calcular a distância e o ângulo da linha
      const dx = toX - fromX;
      const dy = toY - fromY;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      return {
        x1: `${fromX}%`,
        y1: `${fromY}%`,
        x2: `${toX}%`,
        y2: `${toY}%`,
        stroke: 'black',
        strokeWidth: 2,
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 0',
        width: `${length}%`,
      };
    },
    getPosicao(idCidade) {
      const cidade = this.cidades.find(c => c.id === idCidade);
      return cidade ? { x: `${cidade.x}%`, y: `${cidade.y}%` } : { x: '0%', y: '0%' };
    },
    TrocarJogadorAtivo() {
      this.jogadores[this.jogadorAtivo.id] = this.jogadorAtivo;
      const proximoId = (this.jogadorAtivo.id + 1) % this.jogadores.length;
      this.jogadorAtivo = this.jogadores[proximoId];
    },
    calcularAngulo(cidadeDe, cidadePara) {
      const deltaX = cidadePara.x - cidadeDe.x;
      const deltaY = cidadePara.y - cidadeDe.y;
      return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    },
    jogadorAtivoAcao(cidade) {
      const resultado = this.tabuleiro.jogadorAtivo.Acao(cidade, this.acaoAtual, this.cidades, this.cartasJogo, this.conexoesCidades);
      if (resultado && resultado.mensagem) {
        this.modal.mostra = true;
        this.modal.mensagem = resultado.mensagem;
      }
      this.acoesRestantes -= 1;
    },
  },
});
