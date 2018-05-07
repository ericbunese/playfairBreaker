module.exports = {
  alfabeto: ["A","B","C","D","E","F","G","H","I","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
  combinacoes: [],
  textos: [],
  estatisticas:{"filtro1":0, "filtro2":0, "filtro3":0, "filtro4":0, "filtro5":0, "filtroC":0, "filtrados":0, "total":0},
  primeiroFiltro: function(str){
    return (str.indexOf("A")!=-1 || str.indexOf("E")!=-1 || str.indexOf("I")!=-1 || str.indexOf("O")!=-1 || str.indexOf("U")!=-1)
  },
  segundoFiltro: function(str){
    var dig = ["DE", "RA", "ES", "OS", "AS", "DO", "AR", "CO", "EN", "OU", "ER", "DA", "RE", "CA", "TA", "AO", "EI", "OE", "TA",
    "QUE", "ENT", "NA", "NE", "COM", "NTE", "EST", "AVA", "ARA", "ADO", "PAR", "NDO", "NAO", "ERA", "AND", "UMA", "STA"];
    var sum = 0;
    for (var i=0;i<dig.length;++i)
    {
     sum += (str.indexOf(dig[i])!=-1);
    }
    return sum;
  },
  terceiroFiltro: function(str){
    var sum = 0;
    for (var i=0;i<str.length-3;++i){
      sum += this.primeiroFiltro(str.slice(i, 3));
    }
    return (sum>0);
  },
  quartoFiltro: function(str){
    var dig = ["KC", "KD", "KF", "KG", "KH", "KJ", "KL", "KQ", "KR", "KX", "KY", "KZ"];
    var sum = 0;
    for (var i=0;i<dig.length;++i)
    {
     sum += (str.indexOf(dig[i])!=-1);
    }
    return (sum==0);
  },
  quintoFiltro: function(str){
    for (var i=0;i<str.length-1;++i){
      if (str[i]=="Q"){
          if (str[i+1]=="U")
            return 1;
          else return 0;
      }
    }
    return 1;
  },
  combinar: function(){
    //Chaves de 3 letras
    var ch3 = [], ch4 = [], ch5 = [];
    for (var i=0;i<this.alfabeto.length;++i){
      for (var j=0;j<this.alfabeto.length;++j){
        for (var k=0;k<this.alfabeto.length;++k){
          if (i!=j && i!=k && j!=k){
            ch3.push(this.alfabeto[i]+this.alfabeto[j]+this.alfabeto[k]);
          }
        }
      }
    }
    this.combinacoes.push(ch3);

    //Chaves de 4 letras
    for (var i=0;i<this.alfabeto.length;++i){
      for (var j=0;j<this.alfabeto.length;++j){
        for (var k=0;k<this.alfabeto.length;++k){
          for (var l=1;l<this.alfabeto.length;++l){
            if (i!=j && i!=k && i!=l && j!=k && j!=l && k!=l){
              ch4.push(this.alfabeto[i]+this.alfabeto[j]+this.alfabeto[k]+this.alfabeto[l]);
            }
          }
        }
      }
    }
    this.combinacoes.push(ch4);

    //Chaves de 5 letras
    for (var i=0;i<this.alfabeto.length;++i){
      for (var j=0;j<this.alfabeto.length;++j){
        for (var k=0;k<this.alfabeto.length;++k){
          for (var l=0;l<this.alfabeto.length;++l){
            for (var q=1;q<this.alfabeto.length;++q){
              if (i!=j && i!=k && i!=l && i!=q && j!=k && j!=l && j!=q && k!=l && l!=q){
                if ((this.alfabeto[l]+this.alfabeto[q])!="AB")
                  ch5.push(this.alfabeto[i]+this.alfabeto[j]+this.alfabeto[k]+this.alfabeto[l]+this.alfabeto[q]);
              }
            }
          }
        }
      }
    }

    this.combinacoes.push(ch5);
  },
  combinarDic: function(dic, pf){
    var fs = require("fs");
    var parent = this;

    var chd = [];
    for (var i=0;i<dic.words.length;++i){
        var word = pf.prepareString(dic.words[i]);
        if (word.length>=4 && word.length<=6){
            chd.push(word);
        }
    }
    this.combinacoes.push(chd);
  },
  doit: function(texto, dic, pf){
    var str, filtro2;
    console.log("Iniciando quebra de textos...");
    for (var i=0;i<this.combinacoes.length;++i){
      var txt = [];
      for (var j=0;j<this.combinacoes[i].length;++j){
        pf.playfairkey(this.combinacoes[i][j]);
        str = pf.DoPlayfair(texto, "D");

        //Primeiro Filtro
        if (this.primeiroFiltro(str.slice(0, 3)))
        {
          filtro2 = this.segundoFiltro(str);
          if (filtro2>=6){
            var f3, f4, f5;
            f3 = this.terceiroFiltro(str);
            f4 = this.quartoFiltro(str);
            f5 = this.quintoFiltro(str);
            if (f3 && f4 && f5){
                txt.push(this.combinacoes[i][j]+" - "+str);
                console.log(this.combinacoes[i][j] + " ->" + str + "["+filtro2+"]");
            }
            else this.estatisticas.filtroC++;
            if (!f3)this.estatisticas.filtro3++;
            if (!f4)this.estatisticas.filtro4++;
            if (!f5)this.estatisticas.filtro5++;
          }
          else this.estatisticas.filtro2++;
        }
        else this.estatisticas.filtro1++;
        this.estatisticas.total++;
      }
      this.textos.push(txt);
    }
    console.log("\n\nTodas as chaves foram processadas.");
    console.log(this.textos);
    this.estatisticas.filtrados = this.estatisticas.filtro1+this.estatisticas.filtro2+this.estatisticas.filtroC;
    console.log("\nEstatísticas:\n");
    console.log(this.estatisticas);
  }
};
