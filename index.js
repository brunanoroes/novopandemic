const appVue = new Vue({
  el: '#appVue',
  data: {
    // Lista de cidades (com coordenadas top e left)
    cities: [
      { id: 1, name: 'São Paulo', class: 'city1', top: '70%', left: '40%' },
      { id: 2, name: 'Buenos Aires', class: 'city2', top: '75%', left: '45%' },
      { id: 3, name: 'Cidade 3', class: 'city3', top: '50%', left: '60%' },
      // Adicione mais cidades aqui
    ],
    // Conexões entre cidades (usando os IDs das cidades)
    connections: [
      { from: 1, to: 2 }, // Conexão entre São Paulo e Buenos Aires
      { from: 1, to: 3 }, // Conexão entre São Paulo e Cidade 3
      // Adicione mais conexões aqui
    ],
    jogador: {
      nome: 'Ana',
      funcao: 'Pesquisadora',
      imagem: 'assets/jogadora1.png',
      habilidades: ['Compartilha cartas com facilidade', 'Identifica doenças rapidamente'],
    },
  },
  methods: {
    // Calcula o estilo de posição para a cidade
    cityStyle(city) {
      return {
        top: city.top,
        left: city.left,
      };
    },
    // Calcula o estilo de cada linha (conexão)
    lineStyle(connection) {
      const fromCity = this.cities.find(city => city.id === connection.from);
      const toCity = this.cities.find(city => city.id === connection.to);

      // Calcula as coordenadas das linhas
      const fromX = parseFloat(fromCity.left);
      const fromY = parseFloat(fromCity.top);
      const toX = parseFloat(toCity.left);
      const toY = parseFloat(toCity.top);

      // Calcula a posição, o tamanho e o ângulo da linha
      const distance = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
      const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);

      return {
        width: `${distance}%`,
        top: `${fromY}%`,
        left: `${fromX}%`,
        transform: `rotate(${angle}deg)`,
      };
    },
  },
});
