import cartasEpidemiaJson from '../data/CartasEpidemia.js';
import cartasEventoJson from '../data/CartasEvento.js';
import cartasPersonagemJson from '../data/CartasPersonagem.js';
import Jogador from './JogadorModel.js';

export default class TabuleiroModel {
  constructor({ nomesJogadores, cidades, doencas, jogadores, cartasInfeccao, marcadorInfeccao, marcadorSurto }) {
    this.nomesJogadores = nomesJogadores;
    this.cidades = cidades;
    this.doencas = doencas;
    this.jogadores = jogadores;
    this.cartasInfeccao = cartasInfeccao;
    this.marcadorInfeccao = marcadorInfeccao;
    this.marcadorSurto = marcadorSurto;
    this.cartasJogo = [];
    this.jogadorAtivo = null;
  }

  Embaralhar(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  CarregarCartasJogo() {
    this.cartasJogo = [];

    for (const cidade of this.cidades) {
      this.cartasJogo.push({ tipo: 'cidade', conteudo: cidade.nome });
    }

    for (const carta of cartasEventoJson) {
      this.cartasJogo.push({ tipo: 'evento', conteudo: carta.conteudo });
    }

    this.cartasJogo = this.Embaralhar(this.cartasJogo);

    this.cartasEpidemia = cartasEpidemiaJson.map(carta => ({
      tipo: 'epidemia',
      conteudo: carta.conteudo,
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
      this.cartasInfeccao.monteAtivo.push({ cidade: cidade.nome });
    }
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
    for (let cidade of this.cidades) {
      cidade.centroPesquisa = cidade.nome === 'Atlanta';
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

  IniciarJogadores() {
    this.PosicionarPeoes();
    this.AtribuirCartasEPersonagens();
    this.jogadorAtivo = this.jogadores[0];
  }

  MontarTabuleiro() {
    this.IniciarJogadores();
    this.CarregarCartasJogo();
    this.CarregarCartasInfeccao();
    this.InserirCartasEpidemiaNoBaralho(4);
    this.PosicionarCubosDoenca();
    this.PosicionarMarcadoresInfeccao();
    this.PosicionarMarcadoresSurto();
    this.PosicionarCentrosPesquisa();
  }
}
