Vue.component('carta-referencia', {
  props: [],
  template: `
    <div class="carta-doenca">
      <h4>Carta Referência</h4>
      <p>Deslocar-se entre cidades:

        Dirigir/Ferry: Mover para uma cidade conectada.

        Voar Direto: Descartar uma carta de cidade para ir até ela.

        Voar Charter: Descartar a carta da cidade em que está para ir a qualquer cidade.

        Voar Shuttle: Mover entre centros de pesquisa.

        Construir Centro de Pesquisa:

        Descartar a carta da cidade em que está.

        Tratar Doença:

        Remover 1 cubo de doença (todos se a cura da doença estiver descoberta).

        Compartilhar Conhecimento:

        Dar ou receber a carta da cidade onde os dois jogadores estão.

        Descobrir Cura:

        Em um centro de pesquisa, descartar 5 cartas da mesma cor (ou menos, dependendo da habilidade do personagem).</p>
    </div>
  `,
});
