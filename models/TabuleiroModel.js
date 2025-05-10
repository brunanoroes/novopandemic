import cartasEpidemiaJson from '../data/CartasEpidemia.js';
import cartasEventoJson from '../data/CartasEvento.js';
import cartasPersonagemJson from '../data/CartasPersonagem.js';
import Jogador from './JogadorModel.js';

export default class TabuleiroModel {
  constructor({ nomesJogadores, cidades, doencas, jogadores, cartasInfeccao, marcadorInfeccao, marcadorSurto, centrosPesquisa }) {
    this.nomesJogadores = nomesJogadores;
    this.cidades = cidades;
    this.doencas = doencas;
    this.jogadores = jogadores;
    this.cartasInfeccao = cartasInfeccao;
    this.marcadorInfeccao = marcadorInfeccao;
    this.marcadorSurto = marcadorSurto;
    this.cartasJogo = [];
    this.jogadorAtivo = null;
    this.centrosPesquisa = centrosPesquisa;
  }

  Embaralhar(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  CarregarCartasJogo() {
    this.cartasJogo = [];

    for (const cidade of this.cidades) {
      this.cartasJogo.push({ tipo: 'cidade', conteudo: cidade.nome, descricao: '' });
    }

    for (const carta of cartasEventoJson) {
      this.cartasJogo.push({ tipo: 'evento', conteudo: carta.conteudo, descricao: carta.descricao });
    }

    this.cartasJogo = this.Embaralhar(this.cartasJogo);

    this.cartasEpidemia = cartasEpidemiaJson.map(carta => ({
      tipo: 'epidemia',
      conteudo: carta.conteudo,
      descricao: carta.descricao,
    }));
  }

  InserirCartasEpidemiaNoBaralho(numEpidemias = 4) {
    const montes = [];
    const tamanhoMonte = Math.ceil(this.cartasJogo.length / numEpidemias);

    for (let i = 0; i < numEpidemias; i++) {
      const monte = this.cartasJogo.splice(0, tamanhoMonte);
      const epidemia = this.cartasEpidemia[i];
      if (epidemia) monte.push(epidemia);
      montes.push(this.Embaralhar(monte));
    }

    this.cartasJogo = montes.flat();
  }

  CarregarCartasInfeccao() {
    this.cartasInfeccao.monteAtivo = [];

    for (const cidade of this.cidades) {
      this.cartasInfeccao.monteAtivo.push({ cidade: cidade.nome, cor: cidade.cor });
    }

    this.cartasInfeccao.monteAtivo = this.Embaralhar(this.cartasInfeccao.monteAtivo);
  }

  PosicionarPeoes() {
    const coresPeao = ['pink', 'blue', 'green', 'red', 'yellow', 'orange'];
    this.jogadores.length = 0;

    this.nomesJogadores.forEach((nome, index) => {
      const cor = coresPeao[index % coresPeao.length];
      const jogador = new Jogador(index, nome, cor, 'Atlanta');
      this.jogadores.push(jogador);
    });
  }

  PosicionarCubosDoenca() {
    for (const doenca of this.doencas) {
      doenca.cubosDoenca = [];
      for (let i = 0; i < 24; i++) {
        doenca.cubosDoenca.push({ posicao: 'caixa' });
      }
    }
  }

  PosicionarMarcadoresInfeccao() {
    this.marcadorInfeccao.lugar = 'caixa';
    this.marcadorInfeccao.nivel = 1;
  }

  PosicionarMarcadoresSurto() {
    this.marcadorSurto.lugar = 'caixa';
    this.marcadorSurto.nivel = 1;
  }

  PosicionarCentrosPesquisa() {
    this.centrosPesquisa.push({ posicao: 'Atlanta' });
    for (let i = 0; i < 5; i++) {
      this.centrosPesquisa.push({ posicao: 'caixa' });
    }
  }

  AtribuirCartasEPersonagens() {
    const personagensEmbaralhados = [...cartasPersonagemJson].sort(() => Math.random() - 0.5);
    const totalJogadores = this.jogadores.length;
    const cartasPorJogador = totalJogadores === 2 ? 4 : totalJogadores === 3 ? 3 : 2;

    this.jogadores.forEach((jogador, index) => {
      const personagem = personagensEmbaralhados[index % personagensEmbaralhados.length];
      jogador.cartaPersonagem = personagem;
      jogador.funcao = personagem.funcao;

      for (let i = 0; i < cartasPorJogador; i++) {
        const carta = this.cartasJogo.shift();
        if (carta) jogador.cartas.push(carta);
      }
    });
  }
  PrimeiraInfeccao() {
    const cartas = this.cartasInfeccao.monteAtivo.splice(0, 9); // remove as 9 primeiras cartas
    cartas.forEach((carta, index) => {
      const alvo = this.cidades.find(c => c.nome === carta.cidade);
      if (!alvo) return;

      // Determina a quantidade de cubos
      const quantidade = index < 3 ? 3 : index < 6 ? 2 : 1;

      // Encontra a doença da cor correspondente
      const doenca = this.doencas.find(d => d.cor === carta.cor);
      if (!doenca) return;

      // Coloca os cubos na cidade
      for (let i = 0; i < quantidade; i++) {
        const cubo = doenca.cubosDoenca.find(c => c.posicao === 'caixa');
        if (cubo) cubo.posicao = carta.cidade;
        else console.warn(`Sem cubos disponíveis para ${doenca.nome}`);
      }

      // Move a carta para o descarte
      this.cartasInfeccao.monteDescarte.push(carta);
    });
  }

  IniciarJogadores() {
    this.PosicionarPeoes();
    this.AtribuirCartasEPersonagens();
    this.jogadorAtivo = this.jogadores[0];
  }

  MontarTabuleiro() {
    this.CarregarCartasJogo();
    this.CarregarCartasInfeccao();
    this.IniciarJogadores(); // <-- mover para depois de carregar as cartas
    this.InserirCartasEpidemiaNoBaralho(4);
    this.PosicionarCubosDoenca();
    this.PosicionarMarcadoresInfeccao();
    this.PosicionarMarcadoresSurto();
    this.PosicionarCentrosPesquisa();
  }
}
