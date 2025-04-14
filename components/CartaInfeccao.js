Vue.component('carta-infeccao', {
  props: ['cidade'],
  template: `
    <div class="carta-doenca">
      <h4>{{ cidade }}</h4>
    </div>
  `,
});
