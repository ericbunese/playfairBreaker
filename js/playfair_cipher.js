module.exports = {
	alphabetPlayfair: "ABCDEFGHIKLMNOPQRSTUVWXYZ",
	playfairMatrix: undefined,
	prepareString: function(varString) {
		var stringAcentos = new String('àâêôûãõáéíóúçüÀÂÊÔÛÃÕÁÉÍÓÚÇÜ$');
		var stringSemAcento = new String('aaeouaoaeioucuAAEOUAOAEIOUCUS');
		varString = varString.replace(' ','');

		var i = new Number();
		var j = new Number();
		var cString = new String();
		var varRes = '';

		for (i = 0; i < varString.length; i++) {
			cString = varString.substring(i, i + 1);
			for (j = 0; j < stringAcentos.length; j++) {
				if (stringAcentos.substring(j, j + 1) == cString){
					cString = stringSemAcento.substring(j, j + 1);
				}
			}
			varRes += cString;
		}
		varRes = varRes.replace(/\W+/g,'').trim();
		varRes = varRes.toUpperCase();
		return varRes;
	},
	playfairkey: function(key){
		this.playfairMatrix = this.playfairMakeCipherABC(key);

		var row = new Array();
		for(i=0;i<5;i++)
			row[i]=""

		for(i=0;i<5;i++){
			for(j=0;j<5;j++)
				row[i]+= "	"+this.playfairMatrix.charAt(5*i+j);
		}

		sqr="";
		for(i=0;i<5;i++)
			sqr+=row[i]+"\n";
		sqr+="\n";
		return sqr;
	},
	playfairMakeCipherABC: function(key){
		key = key.toUpperCase().replace("J", "I");
		var pos, let, cyabc = key+this.alphabetPlayfair;

		for(i=0;i<this.alphabetPlayfair.length;i++){
			let=cyabc.charAt(i);
			pos=cyabc.indexOf(let,i+1);
			while(pos>-1){
				cyabc=cyabc.substring(0,pos)+cyabc.substring(pos+1,cyabc.length);
				pos=cyabc.indexOf(let,i+1);
			}
		}
		return cyabc;
	},
	DoPlayfair: function(et,dir){

		et = this.prepareString(et);
		et = et.replace('J','I');

		if(!this.playfairMatrix){
			console.log("É necessário gerar a matriz antes de cifrar ou decifrar!");
			return false;
		}

		var dup = "J";
		et = et.toUpperCase();
		var pos = et.indexOf(" ");
		var let1, let2, shf, dt, x1, x2, y1, y2, pos1, pos2, temp;

		while(pos>-1){
			et = et.substring(0,pos)+et.substring(pos+1,et.length);
			pos = et.indexOf(" ");
		}
		pos = et.indexOf("?");
		while(pos>-1){
			et = et.substring(0,pos)+et.substring(pos+1,et.length);
			pos = et.indexOf("?");
		}
		for(i=0;i<et.length;i=i+2){
			let1 = et.charAt(i);
			let2 = et.charAt(i+1);
			if(let1==let2){
				et = et.substring(0,i+1)+"X"+et.substring(i+1,et.length)
			}
		}
		if( (et.length%2)==1 ){
			et+='X';
		}

		if(dup!=""){
			pos = et.indexOf(dup);
			while(pos>-1){
				et = et.substring(0,pos)+"I"+et.substring(pos+1,et.length);
				pos=et.indexOf(dup);
			}
		}

		var row = new Array();
		for(i=0;i<5;i++){
			row[i]="";
		}
		for(i=0;i<5;i++){
			for(j=0;j<5;j++)
				row[i]+=this.playfairMatrix.charAt(5*i+j);
		}
		shf=1;
		if(dir=="E"){
			shf=1
		}
		if(dir=="D"){
			shf=4
		}
		dt="";
		for(i=0;i<et.length;i=i+2){

			if(isNaN(et.charAt(i)) && isNaN(et.charAt(i+1))){
				pos1 = this.playfairMatrix.indexOf(et.charAt(i));
				pos2 = this.playfairMatrix.indexOf(et.charAt(i+1));
				x1 = pos1%5;
				y1 = Math.floor(pos1/5);
				x2 = pos2%5;
				y2 = Math.floor(pos2/5);

				if(y1 == y2){
					x1 = (x1+shf)%5;
					x2 = (x2+shf)%5;
				}else if(x1==x2){
					y1=(y1+shf)%5;
					y2=(y2+shf)%5;
				}else{
					temp = x1;
					x1 = x2;
					x2 = temp;
				}
				dt += row[y1].charAt(x1) + row[y2].charAt(x2);
			}else{
				dt += et.charAt(i) + et.charAt(i+1);
			}
		}
		return dt;
	}

};
