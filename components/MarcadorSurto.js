Vue.component('marcador-surto', {
  props: ['nivel', 'atual'],
  template: `
    <div :class="['marcador-surto', { atual }]">
      <p class="pMarcSurto">{{ nivel }}</p>
    </div>
  `,
});
