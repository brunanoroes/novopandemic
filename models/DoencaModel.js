export default class Doenca {
  constructor(nome, cor, estado, cubosDoenca) {
    this.nome = nome;
    this.cor = cor;
    this.estado = estado;
    this.cubosDoenca = cubosDoenca;
  }

  infectar(cidade) {
    // Verifica se a cidade corresponde à cor da doença
    if (cidade.cor !== this.cor) {
      console.warn(`Tentando infectar ${cidade.nome} com doença ${this.nome} incorreta`);
      return { erro: 'cor_incorreta', cidade };
    }

    const cubosNaCidade = this.cubosDoenca.filter(c => c.posicao === cidade.nome).length;

    if (cubosNaCidade >= 3) {
      // Surto!
      console.warn(`Surto em ${cidade.nome}`);
      return { surto: true, cidade };
    }

    // Coloca um cubo se houver disponível
    const cubo = this.cubosDoenca.find(c => c.posicao === 'caixa');

    if (cubo) {
      cubo.posicao = cidade.nome;
      return { sucesso: true, cidade };
    } else {
      console.warn(`Sem cubos disponíveis para a doença ${this.nome}`);
      return { erro: 'sem_cubos', cidade };
    }
  }
}
