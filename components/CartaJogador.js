Vue.component('cartajogador', {
  props: ['nome', 'funcao', 'imagem', 'habilidades'],
  methods: {
    usarCarta() {
      alert(`Carta de ${this.nome} foi usada!`);
    },
  },
  template: `
    <div class="carta-jogador">
      <img :src="imagem" alt="Imagem do Jogador" />
      <h2>{{ nome }} - {{ funcao }}</h2>
      <p>{{ habilidades }}</p>
    </div>
  `,
});
