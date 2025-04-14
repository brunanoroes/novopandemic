Vue.component('pino-jogador', {
  props: ['cor'],
  template: `
    <div class="pino-jogador" :style="{ backgroundColor: cor }">
    </div>
  `,
});
