Vue.component('pino-infeccao', {
  props: ['cidade', 'nivel'],
  template: `
    <div class="pino-infeccao" :style="{ height: nivel + '%' }">
      <p>{{ cidade }}</p>
    </div>
  `,
});
