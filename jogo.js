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
      const resultado = this.jogadorAtivo.Acao(cidade, this.acaoAtual, this.cidades, this.cartasJogo, this.conexoesCidades, this.centrosPesquisa, this.doencas, this.jogadores);
      if (resultado && resultado.mensagem) {
        this.modal.mostra = true;
        this.modal.mensagem = resultado.mensagem;
      } else {
        this.acoesRestantes -= 1;
      }
    },
    trocarTurno() {
      // O jogador compra 2 cartas do jogo
      const resultadoCompra = this.jogadorAtivo.comprarCartas(2, this.tabuleiro.cartasJogo);
      const cartasCompradas = resultadoCompra.cartasCompradas; // Agora você tem as cartas compradas corretamente

      // Verifica se houve epidemias e aplica a epidemia para cada uma delas
      const qtdEpidemias = cartasCompradas.filter(c => c.tipo === 'epidemia').length;

      if (qtdEpidemias) {
        // Aqui você itera sobre a quantidade de epidemias
        for (let i = 0; i < qtdEpidemias; i++) {
          this.epidemizar(); // Aplica a epidemia
        }
      }

      // Aplica a infecção
      this.infectar();

      // Decrementa o número de ações restantes
      this.acoesRestantes = 4;

      // Troca para o próximo jogador
      this.TrocarJogadorAtivo();
    },

    infectar() {
      const cartasInfectadas = [];

      for (let i = 0; i < 2; i++) {
        const carta = this.cartasInfeccao.monteAtivo.shift(); // retira do topo
        if (!carta) break;

        const cidade = carta.cidade;
        const cor = carta.cor;

        const doenca = this.doencas.find(d => d.cor === cor);
        if (!doenca) continue;

        if (doenca.estado === 'erradicado') {
          console.log(`Doença ${cor} está erradicada. Não infecta mais a cidade ${cidade}.`);
          cartasInfectadas.push({ cidade, cor, status: 'erradicada' });
          continue;
        }

        const cubosNaCidade = doenca.cubosDoenca.filter(c => c.posicao === cidade);
        if (cubosNaCidade.length >= 3) {
          doenca.propagateSurto(cidade, this.espacosMarcadorInfeccao, this.espacosMarcadorSurto);
          cartasInfectadas.push({ cidade, cor, status: 'surto' });
        } else {
          const cuboDisponivel = doenca.cubosDoenca.find(c => c.posicao === 'caixa');
          if (cuboDisponivel) {
            cuboDisponivel.posicao = cidade;
            this.cartasInfeccao.monteDescarte.push({ cidade, cor });
            cartasInfectadas.push({ cidade, cor, status: 'infectado' });
          } else {
            window.alert(`Não há mais cubos disponíveis para a doença ${cor}!`);
            return { erro: 'sem_cubos', cor };
          }
        }
      }

      const resumo = cartasInfectadas.map(c => `${c.cidade} - ${c.status}`).join('\n');
      window.alert(`Cartas de Infecção Retiradas:\n${resumo}`);
    },
    epidemizar() {
      // 1. AUMENTO
      const indiceAtual = this.espacosMarcadorInfeccao.findIndex(e => e.atual);
      if (indiceAtual !== -1 && indiceAtual + 1 < this.espacosMarcadorInfeccao.length) {
        this.espacosMarcadorInfeccao[indiceAtual].atual = false;
        this.espacosMarcadorInfeccao[indiceAtual + 1].atual = true;
      } else {
        window.alert('Velocidade máxima de infecção atingida!');
      }

      // 2. INFECÇÃO
      const carta = this.cartasInfeccao.monteAtivo.pop(); // Do fundo do baralho
      if (!carta) {
        window.alert('Não há mais cartas de infecção!');
        return;
      }

      const cidade = carta.cidade;
      const cor = carta.cor;
      const doenca = this.doencas.find(d => d.cor === cor);
      if (!doenca) return;

      if (doenca.estado === 'erradicado') {
        console.log(`Doença ${cor} está erradicada. Não infecta mais.`);
      } else {
        const cubosNaCidade = doenca.cubosDoenca.filter(c => c.posicao === cidade);
        const faltando = 3 - cubosNaCidade.length;

        if (faltando > 0) {
          for (let i = 0; i < faltando; i++) {
            const cubo = doenca.cubosDoenca.find(c => c.posicao === 'caixa');
            if (cubo) {
              cubo.posicao = cidade;
            } else {
              window.alert(`PERDEU! Sem cubos da doença ${doenca.nome}.`);
              return;
            }
          }
          if (faltando < 3) {
            // Surto ocorre porque já havia cubos
            doenca.propagateSurto(cidade, this.espacosMarcadorInfeccao, this.espacosMarcadorSurto);
          }
        } else {
          // Já tem 3 cubos, surto direto
          doenca.propagateSurto(cidade, this.espacosMarcadorInfeccao, this.espacosMarcadorSurto);
        }
      }

      this.cartasInfeccao.monteDescarte.push(carta);

      // 3. INTENSIDADE
      const embaralhadas = this.shuffleArray(this.cartasInfeccao.monteDescarte);
      this.cartasInfeccao.monteAtivo = embaralhadas.concat(this.cartasInfeccao.monteAtivo);
      this.cartasInfeccao.monteDescarte = [];

      // Mensagem
      window.alert(`EPIDEMIA em ${cidade} (${cor})!`);
    },
  },
});
