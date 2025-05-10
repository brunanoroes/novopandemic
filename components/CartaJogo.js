Vue.component('carta-jogo', {
  props: ['tipo', 'conteudo', 'descricao'],
  template: `
    <div class="carta-jogavel">
      <h4>{{ tipo }}</h4>
      <p v-if="tipo === 'cidade'">Cidade: {{ conteudo }}</p>
      <p v-if="tipo === 'evento'">Habilidade: {{ conteudo }} {{descricao}}</p>
      <p v-if="tipo === 'epidemia'">Habilidade: {{ conteudo }} {{descricao}}</p>
    </div>
  `,
});
