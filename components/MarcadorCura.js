Vue.component('marcador-cura', {
  props: ['cor', 'estado'],
  template: `
    <div class="frasco" :style="{ backgroundColor: cor }">
      <p>Frasco de Cura: {{ estado }}</p>
    </div>
  `,
});
