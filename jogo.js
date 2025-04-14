new Vue({
  el: '#appVue',
  data: {
    cores: ['red', 'blue', 'yellow', 'black'],
    nomesJogadores: [],
    jogadores: [],
    jogadorAtivo: {},
    cidades: [],
    conexoesCidades: [],
    doencas: [],
    cartasJogo: [],
    cartasInfeccao: [],
    cartaInfeccaoAtiva: { cidade: '' },
    cartasInfeccaoMonte: [],
    pinosDoenca: [],
    marcadorInfeccao: {},
    espacosMarcadorInfeccao: [],
    marcadorSurto: {},
    espacosMarcadorSurto: [],
    controls: {
      mostrarCartaReferencia: false,
      mostrarCartasJogador: false,
    },
    acoesRestantes: 4,
  },
  created() {
    const params = new URLSearchParams(window.location.search);
    this.nomesJogadores = params.getAll('nomesjogadores[]');
  },
  async mounted() {
    await this.PosicionarPinosDoenca();
    await this.CarregarCartasJogo();
    await this.CarregarCartasInfeccao();
    await this.DistribuirCartas();
  },
  watch: {
    acoesRestantes(novoValor) {
      if (novoValor === 0) {
        this.TrocarJogadorAtivo();
      }
    },
  },
  methods: {
    cityStyle(city) {
      return {
        top: city.top,
        left: city.left,
      };
    },
    lineStyle(connection) {
      const from = this.cidades.find(c => c.id === connection.from);
      const to = this.cidades.find(c => c.id === connection.to);

      const fromX = parseFloat(from.left);
      const fromY = parseFloat(from.top);
      const toX = parseFloat(to.left);
      const toY = parseFloat(to.top);

      const length = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
      const angle = (Math.atan2(toY - fromY, toX - fromX) * 180) / Math.PI;

      return {
        width: `${length}%`,
        top: `${fromY}%`,
        left: `${fromX}%`,
        transform: `rotate(${angle}deg)`,
      };
    },
    PosicionarPinosDoenca() {
      for (const doenca of this.doencas) {
        for (let i = 0; i < 24; i++) {
          this.pinosDoenca.push({
            cor: doenca.cor,
            posicao: 'caixa',
          });
        }
      }
    },
    TrocarJogadorAtivo() {
      this.jogadores[this.jogadorAtivo.id] = this.jogadorAtivo;

      const proximoId = (this.jogadorAtivo.id + 1) % this.jogadores.length;
      this.jogadorAtivo = this.jogadores[proximoId];
    },
    CarregarCartasJogo() {
      for (const cidade of this.cities) {
        this.cartasJogo.push({
          tipo: 'cidade',
          conteudo: cidade.nome,
        });
      }
    },
    CarregarCartasInfeccao() {
      for (const cidade of this.cities) {
        this.cartasInfeccao.push({
          cidade: cidade.nome,
        });
      }
    },
    DistribuirCartas() {
      const funcoes = [
        {
          nome: 'Pesquisadora',
          imagem: 'assets/pesquisadora.png',
          habilidades: ['Pode dar qualquer carta de cidade ao outro jogador na mesma cidade sem se preocupar com a cor.', 'Facilita a troca de cartas.'],
        },
        {
          nome: 'Médica',
          imagem: 'assets/medica.png',
          habilidades: ['Remove todos os cubos de uma cor ao tratar a doença.', 'Se a cura estiver descoberta, remove automaticamente os cubos ao entrar na cidade.'],
        },
        {
          nome: 'Especialista em Quarentena',
          imagem: 'assets/quarentena.png',
          habilidades: ['Previne surtos e a colocação de cubos de doenças na cidade em que está e nas cidades conectadas.'],
        },
        {
          nome: 'Cientista',
          imagem: 'assets/cientista.png',
          habilidades: ['Precisa de apenas 4 cartas da mesma cor para descobrir a cura (em vez de 5).'],
        },
        {
          nome: 'Especialista em Operações',
          imagem: 'assets/operacoes.png',
          habilidades: ['Pode construir uma estação de pesquisa sem descartar carta.', 'Pode se mover entre estações de pesquisa livremente.'],
        },
        {
          nome: 'Despachante',
          imagem: 'assets/despachante.png',
          habilidades: ['Pode mover outros peões como se fossem seus.', 'Se outro jogador estiver na mesma cidade que ele, pode movê-lo para qualquer cidade com estação de pesquisa.'],
        },
      ];

      // Lista de cores para os peões (associada diretamente às funções)
      const cores = ['pink', 'blue', 'green', 'red', 'yellow', 'orange'];

      // Embaralhar as funções
      const funcoesEmbaralhadas = [...funcoes].sort(() => Math.random() - 0.5);

      this.jogadores = [];

      // Distribuindo jogadores com funções e cores
      this.nomesJogadores.forEach((nome, index) => {
        const funcao = funcoesEmbaralhadas[index % funcoesEmbaralhadas.length];

        this.jogadores.push({
          id: index,
          nome: nome,
          funcao: funcao.nome,
          imagem: funcao.imagem,
          habilidades: funcao.habilidades,
          cartas: [],
          peao: {
            lugar: 'São Paulo', // Cidade inicial
            cor: cores[index % cores.length], // Cor do peão com fallback para mais jogadores
          },
        });
      });

      // Distribuir cartas
      const cartasPorJogador = 1;
      this.jogadores.forEach(jogador => {
        for (let i = 0; i < cartasPorJogador; i++) {
          const carta = this.cartasJogo.shift(); // remove do início
          if (carta) {
            jogador.cartas.push(carta);
          }
        }
      });

      this.jogadorAtivo = this.jogadores[0];
    },
  },
});
