export default class Doenca {
  constructor(nome, cor, estado, cubosDoenca) {
    this.nome = nome;
    this.cor = cor;
    this.estado = estado;
    this.cubosDoenca = cubosDoenca;
  }

  propagateSurto(cidades, cidade, conexoes, espacosMarcadorInfeccao, espacosMarcadorSurto, cidadesComSurto = new Set()) {
    if (cidadesComSurto.has(cidade.nome)) return; // evita surto repetido
    cidadesComSurto.add(cidade.nome);

    const conexoesCidade = this.getConexoesCidade(cidade, conexoes);

    conexoesCidade.forEach(conexao => {
      const nomeCidadeConectada = conexao.from === cidade.nome ? conexao.to : conexao.from;
      const cidadeConectada = this.getCidadePorNome(nomeCidadeConectada, cidades);
      if (!cidadeConectada) return;

      // conta cubos da doença nesta cidade conectada
      const cubosNaCidade = this.cubosDoenca.filter(cubo => cubo.posicao === cidadeConectada.nome);

      if (cubosNaCidade.length >= 3) {
        // surto em cadeia
        this.propagateSurto(cidadeConectada, espacosMarcadorInfeccao, espacosMarcadorSurto, cidadesComSurto);
      } else {
        // adiciona 1 cubo: pega cubo livre e posiciona na cidade conectada
        const cuboDisponivel = this.pegarCuboDisponivel();
        if (cuboDisponivel) {
          cuboDisponivel.posicao = cidadeConectada.nome;
        }
      }
    });
    return { surto: true, cidade };
  }

  pegarCuboDisponivel() {
    return this.cubosDoenca.find(cubo => cubo.posicao === 'caixa');
  }

  getConexoesCidade(cidade, conexoes) {
    return conexoes.filter(c => c.from === cidade || c.to === cidade);
  }

  getCidadePorNome(nome, cidades) {
    return cidades.find(cidade => cidade.nome === nome);
  }

  verificarCidadesComSurtoResolvido(cidadesComSurto) {
    const contagemCubosPorCidade = {};

    // Conta quantos cubos existem por cidade para esta doença
    this.cubosDoenca.forEach(cubo => {
      const nomeCidade = cubo.posicao;
      contagemCubosPorCidade[nomeCidade] = (contagemCubosPorCidade[nomeCidade] || 0) + 1;
    });

    // Para cada cidade em surtos, verifica se tem menos de 4 cubos
    cidadesComSurto.forEach(nomeCidade => {
      const qtdCubos = contagemCubosPorCidade[nomeCidade] || 0;

      if (qtdCubos < 4) {
        cidadesComSurto.delete(nomeCidade);
      }
    });
  }
}
