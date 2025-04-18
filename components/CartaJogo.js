Vue.component('carta-jogo', {
  props: ['tipo', 'conteudo'],
  template: `
    <div class="carta-jogavel">
      <h4>{{ tipo }}</h4>
      <p v-if="tipo === 'cidade'">Cidade:oi {{ conteudo }}</p>
      <p v-if="tipo === 'especial'">Habilidade: {{ conteudo }}</p>
      <p v-if="tipo === 'epidemia'">Habilidade: {{ conteudo }}</p>
    </div>
  `,
});
