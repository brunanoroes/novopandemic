Vue.component('carta-personagem', {
  props: ['nome', 'funcao', 'imagem', 'habilidades'],
  template: `
    <div class="carta-personagem">
      <img :src="imagem" alt="Imagem do Jogador" width="100" />
      <h3>{{ nome }} - {{ funcao }}</h3>
      <p>{{ habilidades }}</p>
    </div>
  `,
});
