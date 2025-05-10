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
    doencas: [],
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
    centrosPesquisa: [],
  },
  created() {
    const params = new URLSearchParams(window.location.search);
    this.nomesJogadores = params.getAll('nomesjogadores[]');
    this.doencas = doencasJson.map(d => new Doenca(d.nome, d.cor, d.estado, d.cubosDoenca));
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
      centrosPesquisa: this.centrosPesquisa,
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
    this.centrosPesquisa = this.tabuleiro.centrosPesquisa;
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
    cartasJogo(novoValor) {
      if (!novoValor) {
        this.modal.mostra = true;
        this.modal.mensagem = 'PERDEU';
        window.open('index.html', '_self');
      }
    },
    // doencasEspalhadas(valor) {
    //   if (valor >= 8) {
    //     this.modal.mostra = true;
    //     this.modal.mensagem = 'PERDEU (doença se espalhou demais!)';
    //     window.open('index.html', '_self');
    //   }
    // },
    // cidadesComCentroPesquisa(valor) {
    //   if (this.doencasCuradas.azul && this.doencasCuradas.vermelha &&
    //       this.doencasCuradas.amarela && this.doencasCuradas.preta) {
    //     this.modal.mostra = true;
    //     this.modal.mensagem = 'VITÓRIA! Todas as doenças foram curadas.';
    //     window.open('index.html', '_self');
    //   }
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
    TrocarJogadorAtivo() {
      this.jogadores[this.jogadorAtivo.id] = this.jogadorAtivo;
      const proximoId = (this.jogadorAtivo.id + 1) % this.jogadores.length;
      this.jogadorAtivo = this.jogadores[proximoId];
    },
    jogadorAtivoAcao(cidade) {
      const resultado = this.jogadorAtivo.Acao(cidade, this.acaoAtual, this.cidades, this.cartasJogo, this.conexoesCidades);
      if (resultado && resultado.mensagem) {
        this.modal.mostra = true;
        this.modal.mensagem = resultado.mensagem;
      } else {
        this.acoesRestantes -= 1;
      }
    },
  },
});
