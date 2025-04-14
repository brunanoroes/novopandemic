Vue.component('cartajogador', {
  props: ['nome', 'funcao', 'imagem', 'habilidades'],
  template: `
    <div class="carta-jogador">
      <img :src="imagem" alt="Imagem do Jogador" width="100" />
      <h3>{{ nome }} - {{ funcao }}</h3>
      <p>{{ habilidades.join(', ') }}</p>
    </div>
  `,
});
