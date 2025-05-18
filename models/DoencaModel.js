export default class Doenca {
  constructor(nome, cor, estado, cubosDoenca, cidades, conexoes) {
    this.nome = nome;
    this.cor = cor;
    this.estado = estado;
    this.cubosDoenca = cubosDoenca;
  }

  propagateSurto(cidade, espacosMarcadorInfeccao, espacosMarcadorSurto, cidadesComSurto = new Set()) {
    if (cidadesComSurto.has(cidade.nome)) return; // evita surto repetido
    cidadesComSurto.add(cidade.nome);

    const conexoesCidade = this.getConexoesCidade(cidade);

    conexoesCidade.forEach(conexao => {
      const nomeCidadeConectada = (conexao.from === cidade.nome) ? conexao.to : conexao.from;
      const cidadeConectada = this.getCidadePorNome(nomeCidadeConectada);
      if (!cidadeConectada) return;

      // conta cubos da doença nesta cidade conectada
      const cubosNaCidade = this.cubos.filter(cubo => cubo.posicao === cidadeConectada.nome);

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

    this.atualizarMarcadorSurto(espacosMarcadorSurto);
    return { surto: true, cidade };
    }

  
  pegarCuboDisponivel() {
    return this.cubos.find(cubo => cubo.posicao === 'caixa');
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
