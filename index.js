new Vue({
  el: '#appVue',
  data: {
    jogador: {
      nome: 'Ana',
      funcao: 'Pesquisadora',
      imagem: 'assets/jogadora1.png',
      habilidades: ['Compartilha cartas', 'Identifica doenças'],
    },
    cities: [
      { id: 1, name: 'São Paulo', top: '70%', left: '40%' },
      { id: 2, name: 'Buenos Aires', top: '75%', left: '45%' },
      { id: 3, name: 'Cidade 3', top: '50%', left: '60%' },
    ],
    connections: [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
    ],
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
  },
});
