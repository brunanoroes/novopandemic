Vue.component('marcador-infeccao', {
  props: ['nivel', 'atual'],
  template: `
    <div :class="['marcador-infeccao', { atual }]">
      <p>{{ nivel }}</p>
    </div>
  `,
});
