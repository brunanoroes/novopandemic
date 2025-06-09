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
    acaoEventoAtual: '',
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
    proximasSeisCartas: [],
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
    'cartasInfeccao.monteAtivo'(novoMonte) {
      this.proximasSeisCartas = novoMonte.slice(0, 6);
    },
    acoesRestantes(novoValor) {
      if (novoValor === 0) {
        this.trocarTurno();
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
    doencas() {
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
    jogadorAtivoAcao(referencia, tipo, cartaTipo) {
      if (tipo === 1) {
        const acao = this.acaoEventoAtual || this.acaoAtual;
        const resultado = this.jogadorAtivo.Acao(referencia, acao, this.cidades, this.cartasJogo, this.conexoesCidades, this.centrosPesquisa, this.doencas, this.jogadores);
        if (resultado && resultado.mensagem) {
          this.modal.mostra = true;
          this.modal.mensagem = resultado.mensagem;
          this.acaoEventoAtual = '';
        }
        if (resultado.tipo === 'sucesso') this.acoesRestantes -= 1;
      } else {
        if (cartaTipo === 'evento') {
          if (referencia === 'Recurso Extra') {
            this.jogadorAtivo.cartas = this.jogadorAtivo.cartas.filter(carta => carta.conteudo !== 'Recurso Extra');
            this.acoesRestantes += 2;
          }
          const resultado = this.jogadorAtivo.UtilizarCartaEvento(referencia);
          if (resultado && resultado.mensagem) {
            this.modal.mostra = true;
            this.modal.mensagem = resultado.mensagem;
            if (referencia !== 'Recurso Extra') this.acaoEventoAtual = referencia;
          }
        }
      }
    },
    trocarTurno() {
      // O jogador compra 2 cartas do jogo
      const resultadoCompra = this.jogadorAtivo.comprarCartas(2, this.tabuleiro.cartasJogo);
      const cartasCompradas = resultadoCompra.cartasCompradas;

      // Verifica se houve epidemias e aplica a epidemia para cada uma delas
      const qtdEpidemias = cartasCompradas.filter(c => c.tipo === 'epidemia').length;

      if (qtdEpidemias) {
        for (let i = 0; i < qtdEpidemias; i++) {
          this.epidemizar(); // Aplica a epidemia
        }
      }

      // Aplica a infecção
      this.infectarTurno();

      // Decrementa o número de ações restantes
      this.acoesRestantes = 4;
      // Troca para o próximo jogador
      this.TrocarJogadorAtivo();
    },
    infectarTurno() {
      const cartasInfectadas = [];

      for (let i = 0; i < 2; i++) {
        const carta = this.cartasInfeccao.monteAtivo.shift();
        if (!carta) break;

        const resultado = this.infectarCidade(carta.cidade, carta.cor);
        if (resultado?.erro) return resultado;

        this.cartasInfeccao.monteDescarte.push(carta);
        cartasInfectadas.push(resultado);
      }

      const resumo = cartasInfectadas.map(c => `${c.cidade} - ${c.status}`).join('\n');
      this.modal.mostra = true;
      this.modal.mensagem = `Cartas de Infecção Retiradas:\n${resumo}`;
    },
    infectarCidade(cidadeNome, cor) {
      const doenca = this.doencas.find(d => d.cor === cor);
      if (!doenca) return { cidade: cidadeNome, cor, status: 'erro' };

      if (doenca.estado === 'erradicado') {
        window.alert(`Doença ${cor} está erradicada. Não infecta mais a cidade ${cidadeNome}.`);
        return { cidade: cidadeNome, cor, status: 'erradicada' };
      }

      const cubosNaCidade = doenca.cubosDoenca.filter(c => c.posicao === cidadeNome);
      if (cubosNaCidade.length >= 3) {
        // Surto!
        const surtoResponse = doenca.propagateSurto(this.cidades, cidadeNome, this.conexoesCidades, this.espacosMarcadorInfeccao, this.espacosMarcadorSurto);
        if (surtoResponse.surto) this.atualizarMarcadorSurto();
        return { cidade: cidadeNome, cor, status: `Surto em ${cidadeNome}, Infectou com 1 cubo de doença alguma cidade vizinha` };
      }

      const cuboDisponivel = doenca.cubosDoenca.find(c => c.posicao === 'caixa');
      if (!cuboDisponivel) {
        window.alert(`Não há mais cubos disponíveis para a doença ${cor}!`);
        return { erro: 'sem_cubos', cor };
      }

      // Infecta normalmente
      cuboDisponivel.posicao = cidadeNome;
      return { cidade: cidadeNome, cor, status: 'infectado' };
    },
    epidemizar() {
      // 1. AUMENTO
      const indiceAtual = this.espacosMarcadorInfeccao.findIndex(e => e.atual);
      if (indiceAtual !== -1 && indiceAtual + 1 < this.espacosMarcadorInfeccao.length) {
        this.espacosMarcadorInfeccao[indiceAtual].atual = false;
        this.espacosMarcadorInfeccao[indiceAtual + 1].atual = true;
      } else {
        this.modal.mostra = true;
        this.modal.mensagem = 'Velocidade máxima de infecção atingida!';
      }

      // 2. INFECÇÃO com carta do fundo
      const carta = this.cartasInfeccao.monteAtivo.pop();
      if (!carta) {
        this.modal.mostra = true;
        this.modal.mensagem = 'Não há mais cartas de infecção!';
        return;
      }
      const resultado = this.infectarCidade(carta.cidade, carta.cor);
      if (resultado?.erro) return;
      window.alert = `EPIDEMIA em ${carta.cidade} (${carta.cor})!\nStatus: ${resultado.status}`;

      this.cartasInfeccao.monteDescarte.push(carta);

      // 3. INTENSIDADE
      const embaralhadas = this.Embaralhar(this.cartasInfeccao.monteDescarte);
      this.cartasInfeccao.monteAtivo = embaralhadas.concat(this.cartasInfeccao.monteAtivo);
      this.cartasInfeccao.monteDescarte = [];
    },
    atualizarMarcadorSurto() {
      const marcadorAtivo = this.espacosMarcadorSurto.find(espaco => espaco.atual === true);
      if (marcadorAtivo) {
        marcadorAtivo.atual = false;
        const proximoMarcador = this.espacosMarcadorSurto.find(espaco => parseInt(espaco.nome) === parseInt(marcadorAtivo.nome) + 1);
        if (proximoMarcador) {
          proximoMarcador.atual = true;
        }
      }
    },
    Embaralhar(array) {
      return [...array].sort(() => Math.random() - 0.5);
    },
    moverCarta(index, direcao) {
      const novoIndex = index + direcao;
      if (novoIndex < 0 || novoIndex >= this.proximasSeisCartas.length) return;

      // Troca as cartas de lugar
      const cartas = [...this.proximasSeisCartas];
      const temp = cartas[novoIndex];
      cartas[novoIndex] = cartas[index];
      cartas[index] = temp;

      this.proximasSeisCartas = cartas;
    },
    confirmarReordenacao() {
      this.cartasInfeccao.monteAtivo = [...this.proximasSeisCartas, ...this.cartasInfeccao.monteAtivo.slice(6)];
      this.jogadorAtivo.cartas = this.jogadorAtivo.cartas.filter(carta => carta.conteudo !== this.acaoEventoAtual);
      this.acaoEventoAtual = '';
      this.modal.mostra = false;
      alert('Reordenação confirmada!');
    },
  },
});
