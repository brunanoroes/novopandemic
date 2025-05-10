Vue.component('carta-referencia', {
  props: [],
  template: `
  <div class="carta-referencia">
    <h4>Carta Referência</h4>
    <div class="descricao">
      <b>Automóvel / Balsa</b>
     </br> Deslocar-se para uma cidade ligada à cidade onde você se encontra
      linha branca.
      </br></br><b>Voo Direto</b>
      </br>Descarte uma carta de cidade para se deslocar para a cidade cujo nome
      aparece na carta.
      </br></br><b>Voo Fretado</b>
      </br>Descarte a carta da Cidade onde você se encontra para se deslocar para
      qualquer cidade.
      </br></br><b>Ponte Aérea</b>
      </br>Vá de uma cidade que tem um centro de pesquisa para qualquer outra
      cidade que tem um centro de pesquisa.
      </br></br><b>Construir um Centro de Pesquisa</b>
      </br>Descarte uma carta com o nome da cidade onde você se encontra para
      construir um centro de pesquisa nela. Pegue o centro de pesquisa da
      pilha próxima ao tabuleiro. Se todos os 6 centros de pesquisa já foram
      construídos, pegue um centro de pesquisa de qualquer lugar do tabuleiro.
      </br></br><b>Tratar uma Doença</b>
      </br>Remova 1 cubo de doença da cidade onde você se encontra e coloque-o
      no suprimento de cubos junto à borda do tabuleiro. Se a cura para a
      doença desta cor já foi descoberta (veja o parágrafo Descobrir uma Cura
      mais adiante), remova todos os cubos daquela cor da cidade onde você
      se encontra.
      Se o último cubo de uma doença curada for retirado do tabuleiro, esta
      doença foi erradicada.
      </br></br><b>Compartilhar Conhecimento</b>
      </br>Você pode realizar esta ação de duas maneiras:
      Dê a carta da cidade onde você se encontra a outro jogador, ou pegue a carta
      da cidade onde você se encontra de outro jogador. O outro jogador precisa
      estar na mesma cidade que você. Os dois têm de concordar em fazer isso.
      Se o jogador que recebe a carta passa a ter mais de 7 cartas, ele precisa
      descartar imediatamente uma carta ou jogar uma carta de evento 
      </br></br><b>Descobrir uma Cura</b>
      </br>Em qualquer centro de pesquisa, descarte 5 cartas de Cidade da mesma
      cor de sua mão para descobrir a cura da doença daquela cor. Coloque o
      marcador de cura daquela doença no Indicador de Cura.
      Se não houver cubos daquela cor no tabuleiro, a doença foi erradicada. Vire
      o marcador de cura de modo que ele fique
    </div>
  </div>

  `,
});
