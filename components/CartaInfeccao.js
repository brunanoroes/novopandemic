Vue.component('carta-infeccao', {
  props: ['cidade', 'cor'],
  template: `
    <div class="carta-doenca" :style="{ backgroundColor: cor }">
      <h4>{{ cidade }}</h4>
    </div>
  `,
});
