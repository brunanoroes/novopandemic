export default class Jogador {
  constructor(id, nome, cor, cidadeInicial) {
    this.id = id;
    this.nome = nome;
    this.cartas = [];
    this.cartaPersonagem = {
      funcao: '',
      imagem: '',
      habilidades: [],
    };
    this.peao = {
      cor: cor,
      lugar: cidadeInicial,
    };
  }

  atribuirPersonagem(personagem) {
    this.cartaPersonagem = personagem;
    this.funcao = personagem.funcao;
  }

  receberCarta(carta) {
    this.cartas.push(carta);
  }

  moverPara(cidade) {
    this.peao.lugar = cidade;
  }

  reiniciarCartas() {
    this.cartas = [];
  }
}
