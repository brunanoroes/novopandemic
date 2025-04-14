Vue.component('carta-jogavel', {
  props: ['tipo', 'cidade', 'habilidade'],
  template: `
    <div class="carta-jogavel">
      <h4>{{ tipo }}</h4>
      <p v-if="cidade">Cidade: {{ cidade }}</p>
      <p v-if="habilidade">Habilidade: {{ habilidade }}</p>
    </div>
  `,
});
