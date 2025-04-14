Vue.component('carta-jogador', {
  props: ['nome', 'funcao', 'imagem', 'habilidades'],
  template: `
    <div class="carta-jogador">
      <h3>{{ nome }} - {{ funcao }}</h3>
      <p>{{ habilidades.join(', ') }}</p>
    </div>
  `,
});
