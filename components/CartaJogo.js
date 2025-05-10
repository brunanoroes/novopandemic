Vue.component('carta-jogo', {
  props: ['tipo', 'conteudo', 'descricao'],
  template: `
    <div class="carta-jogavel">
      <h4>{{ conteudo }}</h4>
      <p v-if="tipo === 'evento'">{{ conteudo }} {{descricao}}</p>
      <p v-if="tipo === 'epidemia'">{{ conteudo }} {{descricao}}</p>
    </div>
  `,
});
