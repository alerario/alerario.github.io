//Alexandre L'Erario - alerario@utfpr.edu.br

//modifique somente estas linhas
var repositorio_nome="/alerario/alerario.github.io/"; //coloque o nome do repositorio
var imagens = ["diagrama.png","d1.png", "d2.png"] //coloque o nome de todas as imagens aqui

//nao modifique o codigo daqui em diante
var repositorio_api="https://api.github.com/repos"+repositorio_nome; 
var repositorio = "https://raw.githubusercontent.com" + repositorio_nome + "master/"; 
var indimage=1;

//ler um documento txt e colocar em um id (div) no html
function readTextFileDiv(file,elementID)
{
    file = repositorio+"data/"+file;
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                
			document.getElementById(elementID).innerHTML = allText;
            }
        }
    }
    rawFile.send(null);
}


//ler o ultimo commit no github
function lerGitHubCommit(tamanho, elementID){
  var requestURL=repositorio_api.concat("commits");
  var request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();

request.onload = function() {
  var MyJson = request.response;
  if(tamanho>0){
  document.getElementById(elementID).innerHTML = "  (" + MyJson[0].sha.substring(0,tamanho)+ ")";
}else{
	document.getElementById(elementID).innerHTML =  MyJson[0].sha;
}
}
}

//ler a última tag do github
function lerGitHubTag(elementID){
  var requestURL=repositorio_api.concat("tags");
  var request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();

request.onload = function() {
  var MyJson = request.response; 
	document.getElementById(elementID).innerHTML = MyJson[0].name;
}
}

//ler a commit da ultima tag
function lerGitHubTagCommit(elementID){
  var requestURL=repositorio_api.concat("tags");
  var request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();

request.onload = function() {
  var MyJson = request.response;
  document.getElementById(elementID).innerHTML = MyJson[0].commit.sha;
}
}



//funcao para executar zoom
function zoom(elementID, imageID,  valor){
  document.getElementById(elementID).innerHTML = valor;
  var myImg = document.getElementById(imageID);
  var currWidth = myImg.naturalWidth;
  var newsize = parseFloat(currWidth)*parseFloat(valor);
  document.getElementById(elementID).innerHTML = valor + "|"+ currWidth + "|" +newsize;
  myImg.style.width = (newsize) + "px";
}


//funcao para carregar imagens
function nextimage(elementID1, elementID2){
  var data = "data/"+imagens[indimage++];
  document.getElementById(elementID1).src = data ;
  document.getElementById(elementID2).innerHTML = indimage + " de " + imagens.length ;
  if(indimage>=imagens.length){
    indimage=0;
  }
}

//funcao para ler planilha excell (.xlsx)

var imported = document.createElement('script');
imported.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.13.5/xlsx.full.min.js';
document.head.appendChild(imported);


 function lerExcell(elementID, indice_planilha){
        /* set up XMLHttpRequest */
        //var url = "https://raw.githubusercontent.com/alerario/teste/master/processo/Test.xlsx";
        var file = repositorio + "data/"+"processo.xlsx";
        var rawFile = new XMLHttpRequest();
        rawFile.responseType = "arraybuffer";
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
                {
                if(rawFile.status === 200 || rawFile.status == 0)
                    {
                    var arraybuffer = rawFile.response;

            /* convert data to binary string */
            var data = new Uint8Array(arraybuffer);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");

            /* Call XLSX */
            var workbook = XLSX.read(bstr, {
                type: "binary"
            });

            /* DO SOMETHING WITH workbook HERE */
            var first_sheet_name = workbook.SheetNames[indice_planilha];
            /* Get worksheet */
            var worksheet = workbook.Sheets[first_sheet_name];
            var json_result = XLSX.utils.sheet_to_json(worksheet, {raw: true});

            createTable_file(json_result,elementID);
            //document.getElementById(elementID).innerHTML = json_result;
           }
                }
        }
        rawFile.send(null);
}
        
//funcao para criar uma tabela html a partir de um vetor
function createTable_file(vetor,elementID) {
    var array = vetor;
    var content =  "<table>";
   
    for (let i = 0; i < array.length; ++i) {
        var campos = Object.keys(array[i]);
        content+="<tr>";
        for (let c = 0; c < campos.length; ++c) {
            content+="<td>";
            var coluna=Object.values(array[i])[c];
            content+=coluna;
            content+="</td>";
        }
        content+="</tr>";
    }
    content+=" </table>";
    document.getElementById(elementID).innerHTML = content;
}

//funcao para criar uma tabela utilizando tabulator (.xlsx)
function Excell2Table(elementID, indice_planilha){
        var file = repositorio + "data/" + "processo.xlsx";
        var rawFile = new XMLHttpRequest();
        rawFile.responseType = "arraybuffer";
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
                {
                if(rawFile.status === 200 || rawFile.status == 0)
                    {
                    var arraybuffer = rawFile.response;

            /* convert data to binary string */
            var data = new Uint8Array(arraybuffer);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");

            /* Call XLSX */
            var workbook = XLSX.read(bstr, {
                type: "binary"
            });

            /* DO SOMETHING WITH workbook HERE */
            var first_sheet_name = workbook.SheetNames[indice_planilha];
            /* Get worksheet */
            var worksheet = workbook.Sheets[first_sheet_name];
            var json_result = XLSX.utils.sheet_to_json(worksheet, {raw: true});

            //remover campos sem valor
    		for (let i = 0; i < json_result.length; ++i) {
    			var t = json_result[i];
    			if(t.Nome==""){
    			 delete json_result[i];
    			}
			};
        
			Object.keys(json_result).forEach(key => json_result[key] === undefined ? delete json_result[key] : {});
      criarTabulador(json_result, elementID);
      }
    }
  }
        rawFile.send(null);
}

function criarTabulador(json_result,elementID){
 
var tabledata=json_result;

//identificar os campos da tabela
var campos=[];
var array = json_result;
var campos_array=Object.keys(array[0]); //obter chaves do primeiro elemento
var marcador="link:"; //o que identifica o link
    for (let i = 0; i < campos_array.length; ++i) {
    	var t = campos_array[i];
      //verificar se o campo e um link
        iInit = t.indexOf(marcador);
        if(iInit==0){ //se for um link
          var campo =t.substr(marcador.length);
          var fp = {
            urlPrefix:"data/",
            dowload: true
          };
          var camp = {
            title: campo,
            field: t,
            formatter:"link",
            formatterParams:fp
          };
        }else{

    	   var camp = {
    		  title: t,
    		  field: t
		      };
       }
        campos.push(camp);
    }
   


elementID = "#"+elementID;

var table = new Tabulator(elementID, {
  data:tabledata, //assign data to table
  layout: "fitDataStretch", //fit columns to width of table (optional)
  resizableRows:true,
  columns: campos,
 	});
}