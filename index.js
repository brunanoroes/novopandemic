new Vue({
  el: '#appVue',
  data: {
    cores: ['red', 'blue', 'yellow', 'black'],
    jogadores: [
      {
        id: 0,
        nome: 'Ana',
        funcao: 'Pesquisadora',
        imagem: 'assets/jogadora1.png',
        habilidades: ['Compartilha cartas', 'Identifica doenças'],
      },
      {
        id: 1,
        nome: 'Ana',
        funcao: 'Pesquisadora',
        imagem: 'assets/jogadora1.png',
        habilidades: ['Compartilha cartas', 'Identifica doenças'],
      },
      {
        id: 2,
        nome: 'Ana',
        funcao: 'Pesquisadora',
        imagem: 'assets/jogadora1.png',
        habilidades: ['Compartilha cartas', 'Identifica doenças'],
      },
      {
        id: 3,
        nome: 'Ana',
        funcao: 'Pesquisadora',
        imagem: 'assets/jogadora1.png',
        habilidades: ['Compartilha cartas', 'Identifica doenças'],
      },
    ],
    jogadorAtivo: {
      id: 0,
      nome: '',
      funcao: '',
      imagem: '',
      habilidades: [],
    },
    cities: [
      { id: 1, nome: 'São Paulo', top: '70%', left: '40%' },
      { id: 2, nome: 'Buenos Aires', top: '75%', left: '45%' },
      { id: 3, nome: 'Cidade 3', top: '50%', left: '60%' },
    ],
    doencas: [
      { nome: 'Doença A', cor: 'red' },
      { nome: 'Doença B', cor: 'blue' },
      { nome: 'Doença C', cor: 'yellow' },
      { nome: 'Doença D', cor: 'black' },
    ],
    cartasJogo: [],
    cartasInfeccao: [],
    frascos: [
      { estado: 'não curado', cor: 'red' },
      { estado: 'não curado', cor: 'blue' },
      { estado: 'não curado', cor: 'yellow' },
      { estado: 'não curado', cor: 'black' },
    ],
    //  ex pinoDoenca: { lugar: 'caixa', cor: '1'}
    pinosDoenca: [],
    pinosInfeccao: [
      { cidade: 'São Paulo', nivel: 50 },
      { cidade: 'Buenos Aires', nivel: 30 },
    ],
    pinosJogador: [
      { lugar: 'São Paulo', cor: 'pink', jogando: true },
      { lugar: 'São Paulo', cor: 'blue', jogando: true },
      { lugar: 'São Paulo', cor: 'purple', jogando: false },
      { lugar: 'São Paulo', cor: 'white', jogando: false },
    ],
    connections: [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
    ],
    controls: {
      mostrarCartaReferencia: false,
      mostrarCartasJogador: false,
    },
    acoesRestantes: 4,
  },
  async mounted() {
    await this.PosicionarPinosDoenca();
    await this.CarregarCartasJogo();
    await this.CarregarCartasInfeccao();
    await this.TrocarJogadorAtivo();
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
      const from = this.cities.find(c => c.id === connection.from);
      const to = this.cities.find(c => c.id === connection.to);

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
      this.jogadorAtivo = this.jogadores[this.jogadorAtivo.id + 1];
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
  },
});
