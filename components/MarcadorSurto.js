Vue.component('marcador-surto', {
  props: ['nivel', 'atual'],
  template: `
    <div :class="['marcador-surto', { atual }]">
      <p>{{ nivel }}</p>
    </div>
  `,
});
