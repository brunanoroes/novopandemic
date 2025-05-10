Vue.component('carta-referencia', {
  props: [],
  template: `
  <div class="carta-referencia">
    <h4>Carta Referência</h4>
    <div class="descricao">
      <h5>Deslocar-se entre cidades:</h5>
      <ul>
        <li><strong>Balsa:</strong> Mover para uma cidade conectada.</li>
        <li><strong>Voar Direto:</strong> Descartar uma carta de cidade para ir até ela.</li>
        <li><strong>Voar Charter:</strong> Descartar a carta da cidade em que está para ir a qualquer cidade.</li>
        <li><strong>Voar Shuttle:</strong> Mover entre centros de pesquisa.</li>
      </ul>
      
      <h5>Construir Centro de Pesquisa:</h5>
      <ul>
        <li>Descartar a carta da cidade em que está.</li>
      </ul>

      <h5>Tratar Doença:</h5>
      <ul>
        <li>Remover 1 cubo de doença (todos se a cura da doença estiver descoberta).</li>
      </ul>

      <h5>Compartilhar Conhecimento:</h5>
      <ul>
        <li>Dar ou receber a carta da cidade onde os dois jogadores estão.</li>
      </ul>

      <h5>Descobrir Cura:</h5>
      <ul>
        <li>Em um centro de pesquisa, descartar 5 cartas da mesma cor (ou menos, dependendo da habilidade do personagem).</li>
      </ul>
    </div>
  </div>

  `,
});
