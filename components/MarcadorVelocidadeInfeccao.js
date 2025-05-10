Vue.component('pino-infeccao', {
  props: ['nivel', 'atual'],
  template: `
    <div>
      <p>{{ nivel }}</p>
      <div v-if="atual">Atual</div>
    </div>
  `,
});
