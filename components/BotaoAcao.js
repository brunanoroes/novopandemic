Vue.component('botao-acao', {
  props: ['acao'],
  template: `
    <div class="botao-acao">
      <button>{{acao}}</button>
    </div>
  `,
});
// adicionar os methods das acoes
