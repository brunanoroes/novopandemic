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
    espacosMarcadorInfeccao: espacosMarcadorInfeccaoJson,
    espacosMarcadorSurto: espacosMarcadorSurtoJson,
    cartasInfeccao: {
      monteAtivo: [],
      monteDescarte: [],
    },
    controls: {
      mostrarCartaReferencia: false,
      mostrarCartasJogador: true,
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
      centrosPesquisa: this.centrosPesquisa,
    });

    this.tabuleiro.MontarTabuleiro();
    this.tabuleiro.PrimeiraInfeccao();

    // sincronizar os dados de volta
    this.jogadores = this.tabuleiro.jogadores;
    this.jogadorAtivo = this.tabuleiro.jogadorAtivo;
    this.cartasJogo = this.tabuleiro.cartasJogo;
    this.cartasInfeccao = this.tabuleiro.cartasInfeccao;
    this.centrosPesquisa = this.tabuleiro.centrosPesquisa;
  },
  watch: {
    acoesRestantes(novoValor) {
      if (novoValor === 0) {
        // O jogador compra 2 cartas do jogo
        const resultado = this.jogadorAtivo.comprarCartas(2, this.tabuleiro.cartasJogo);

        // Verifica se houve epidemias e aplica a epidemia para cada uma delas
        const qtdEpidemias = resultado.cartasCompradas.filter(c => c.tipo === 'Epidemia').length;

        for (let i = 0; i < qtdEpidemias; i++) {
          // Aplica a epidemia
          this.doencas.forEach(doenca => {
            doenca.epidemizar(this.cidades, this.espacosMarcadorInfeccao, this.espacosMarcadorSurto);
          });
        }

        this.mensagemCartasCompradas = resultado.mensagem;
        this.mostrarModalCartas = true;

        // Decrementa o número de ações restantes
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
    espacosMarcadorSurto(valor) {
      const espacoCritico = valor.find(e => e.nome === 'X' && e.atual === true);
      if (espacoCritico) {
        this.modal.mostra = true;
        this.modal.mensagem = 'PERDEU (doença se espalhou demais!)';
        window.open('index.html', '_self');
      }
    },
    doencas(valor) {
      const todasCuradas = this.doencas.every(d => d.estado === 'curado');
      if (todasCuradas) {
        this.modal.mostra = true;
        this.modal.mensagem = 'VITÓRIA! Todas as doenças foram curadas.';
        window.open('index.html', '_self');
      }

      for (const doenca of this.doencas) {
        const cubosNaCaixa = doenca.cubosDoenca.filter(c => c.posicao === 'caixa').length;

        if (cubosNaCaixa === 0) {
          this.modal.mostra = true;
          this.modal.mensagem = `PERDEU! Acabaram os cubos da doença ${doenca.nome}.`;
          window.open('index.html', '_self');
          break;
        }

        if (cubosNaCaixa === 24 && doenca.estado === 'curado') {
          doenca.estado = 'erradicado';
        }
      }
    },
  },
  methods: {
    getCidadeX(nome) {
      const cidade = this.cidades.find(c => c.nome === nome);
      return cidade ? `${cidade.x}%` : '0%';
    },
    getCidadeY(nome) {
      const cidade = this.cidades.find(c => c.nome === nome);
      return cidade ? `${cidade.y}%` : '0%';
    },
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
      window.alert(`Vez do jogador ${this.jogadorAtivo.nome}`);
    },
    jogadorAtivoAcao(cidade) {
      console.log(this.doencas);
      const resultado = this.jogadorAtivo.Acao(cidade, this.acaoAtual, this.cidades, this.cartasJogo, this.conexoesCidades, this.centrosPesquisa, this.doencas);
      if (resultado && resultado.mensagem) {
        this.modal.mostra = true;
        this.modal.mensagem = resultado.mensagem;
      } else {
        this.acoesRestantes -= 1;
      }
    },
  },
});
