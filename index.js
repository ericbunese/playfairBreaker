let pf = require("./js/playfair_cipher.js");
let bk = require("./js/breaker.js");
var texto = "", dic = undefined;

if (process.argv.length!=2){
  texto = process.argv[2];
  if (process.argv.length>=4)
      dic = require(process.argv[3]);

  console.log("Calculando chaves: "+texto);
  if (dic==undefined){
    bk.combinar();
    console.log("Chaves (3)" + bk.combinacoes[0].length + " geradas.");
    console.log("Chaves (4)" + bk.combinacoes[1].length + " geradas.");
    console.log("Chaves (5)" + bk.combinacoes[2].length + " geradas.");
    bk.doit(texto, dic, pf);
  }
  else {
    bk.combinarDic(dic, pf);
    console.log("Chaves (DIC)" + bk.combinacoes[0].length + " geradas.");
    bk.doit(texto, dic, pf);
  }
}
else {
  console.log("npm start texto [arquivodicionario]");
}
