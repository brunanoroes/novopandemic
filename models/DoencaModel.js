export default class Doenca {
  constructor(nome, cor, estado, cubosDoenca, cidades, conexoes) {
    this.nome = nome;
    this.cor = cor;
    this.estado = estado;
    this.cubosDoenca = cubosDoenca;
    this.cidades = cidades || [];       // Garante que seja um array, mesmo se for undefined
    this.conexoes = conexoes || [];
  }

  propagateSurto(cidade, espacosMarcadorInfeccao, espacosMarcadorSurto) {
    const cidadesConectadas = this.getConexoesCidade(cidade);
    cidadesConectadas.forEach(conexao => {
      const cidadeConectada = this.getCidadePorNome(conexao);
      if (cidadeConectada && cidadeConectada.cor === this.cor) {
        this.infectar(cidadeConectada);
      }
    });

    // Atualiza os marcadores de infecção e surto
    this.atualizarMarcadorInfeccao(espacosMarcadorInfeccao);
    this.atualizarMarcadorSurto(espacosMarcadorSurto);

    return { surto: true, cidade };
  }

  atualizarMarcadorInfeccao(espacosMarcadorInfeccao) {
    const marcadorAtivo = espacosMarcadorInfeccao.find(espaco => espaco.atual === true);
    if (marcadorAtivo) {
      window.alert(`Marcador de infecção ativo: ${marcadorAtivo.nome}`);
      if (marcadorAtivo.nivel < 4) {
        // Aumenta o nível do marcador
        marcadorAtivo.atual = false;
        const proximoMarcador = espacosMarcadorInfeccao.find(espaco => espaco.nivel === marcadorAtivo.nivel + 1);
        if (proximoMarcador) {
          proximoMarcador.atual = true;
        }
      }
    }
  }

  atualizarMarcadorSurto(espacosMarcadorSurto) {
    const marcadorAtivo = espacosMarcadorSurto.find(espaco => espaco.atual === true);
    if (marcadorAtivo) {
      window.alert(`Marcador de surto ativo: ${marcadorAtivo.nome}`);
      // Aumenta o marcador de surto para o próximo
      marcadorAtivo.atual = false;
      const proximoMarcador = espacosMarcadorSurto.find(espaco => parseInt(espaco.nome) === parseInt(marcadorAtivo.nome) + 1);
      if (proximoMarcador) {
        proximoMarcador.atual = true;
      }
    }
  }

  getConexoesCidade(cidade) {
    return this.conexoes.filter(c => c.from === cidade.id || c.to === cidade.id);
  }

  getCidadePorNome(nome) {
    return this.cidades.find(cidade => cidade.nome === nome);
  }
}
