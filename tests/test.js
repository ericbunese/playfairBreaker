let pf = require("../js/playfair_cipher.js");
let bk = require("../js/breaker.js");

var estatisticas = {"sucesso":0, "total":0};

if (process.argv.length==4){
  let tx = require(process.argv[2]);
  let dic = require(process.argv[3]);

  console.log("Efetuando testes do arquivo"+process.argv[2]+"para o dicionário "+dic);
  console.log(tx.texts);

  for (var i=0;i<tx.texts.length;++i){
    var teste = tx.texts[i];
    var sucesso = 0;
    bk.combinarDic(dic, pf);
    console.log("Chaves (DIC)" + bk.combinacoes[0].length + " geradas.");
    bk.doit(teste.HIDDEN, dic, pf);
    
    var ta = bk.textos[0];
    for (var k=0;k<ta.length;++k){
      var txa = ta[k];
      var key = ((txa.split(" - ")[0]).replace(" ", ""));
      var tex = ((txa.split(" - ")[1]).replace(" ", ""));
      if (key==teste.KEY){
        sucesso = 1;
      }
    }
    teste.SUCESSO = sucesso;
    estatisticas.total++;
    estatisticas.sucesso+=sucesso;
  }

  console.log("\nTestes Concluídos.\n");
  console.log(estatisticas);
}
else console.log("npm test bancoTeste arquivodicionario");
