Vue.component('pino-doenca', {
  props: ['cor'],
  template: `
    <div class="pino-doenca" :style="{ backgroundColor: cor }">
    </div>
  `,
});
