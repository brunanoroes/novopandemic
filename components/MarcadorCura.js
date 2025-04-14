Vue.component('frasco', {
  props: ['cidade'],
  template: `
    <div class="frasco">
      <p>Frasco de Cura: {{ cidade }}</p>
    </div>
  `,
});
