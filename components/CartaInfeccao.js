Vue.component('carta-doenca', {
  props: ['nome', 'cubos'],
  template: `
    <div class="carta-doenca">
      <h4>{{ nome }}</h4>
      <p>{{ cubos }} Cubos de Doença</p>
    </div>
  `,
});
