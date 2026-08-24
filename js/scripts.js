var palco = document.querySelector('.palco');

/// STRINGS

// Escrevo Strings
var texto = "Aqui tem um texto grande!!";
var texto2 = 'Aqui é pequeno!';

//Faço escape a variável
// texto = 'Aqui tem um "texto grande"!';
texto = 'Aqui tem um \"texto grande\"!';

// Acumulo variáveis
palco.innerHTML = '<h1 class\'vermelho\'>'+texto+'</h1>';

//Verificar tamanho string 'length'
palco.innerHTML += "O tamanho da minha variável de texto é:"+texto.length;

//Capturar parte de string (o que esta dentro do parentesses é a posição da letra que queremos, sendo um array começa em 0)
palco.innerHTML += "<br>Vou buscar apenas a letra que esta na 1ª posição: "+texto2.charAt(0);

palco.innerHTML += "<br>Vou buscar apenas a letra que esta na 4ª posição: "+texto2.at(3);

palco.innerHTML += "<br>Vou buscar apenas a letra que esta na 9ª posição: "+texto2[8];

// Juntar Strings 

var t1 = "Hugo";
var t2 = "Vaz";
var t3 = t1.concat(" ", t2);
palco.innerHTML += "<br>Juntei strings com um elemento conector: "+t3;

// Cortar Strings (sendo que é sempre como o array, começa em 0)

var corte = t3.slice(0,4);
palco.innerHTML += "<br>Cortei as primeiras 4 letras da variável\""+t3+"\": "+corte;

corte = t3.slice(4,8);
palco.innerHTML += "<br>Cortei as últimas 3 letras da variável\""+t3+"\": "+corte;

corte = t3.slice(-3);
palco.innerHTML += "<br>Cortei as últimas 3 letras da variável\""+t3+"\": "+corte;

// Transformar Strings

var trans = t3.toUpperCase();
palco.innerHTML += "<br>Coloca a string em maiúsculas: "+trans;

trans = t3.toLowerCase();
palco.innerHTML += "<br>Coloca a string em minúsculas: "+trans;

trans = "     "+t3+"     ";
palco.innerHTML += "<br>Remove espaços no início e fim da string \""+trans;+"\":"+trans.trim();

var num ="666";
num = num.slice(-3);
trans = num.padStart(9, '*');
palco.innerHTML += "<br>Adiciona valor pre-definido a variável para ter sempre o mesmo número de caracteres: "+trans;

trans = num.padEnd(9, '*');
palco.innerHTML += "<br>Adiciona valor pre-definido a variável para ter sempre o mesmo número de caracteres: "+trans;

// Converter numero em string
var numero = 10;
var tt = numero.toString();

// Repete o valor da String
trans = t3.repeat(20);
palco.innerHTML += "<br>Repete o valor da variável o número de vezes que estiver na função "+trans;

// Substituir o valor da String

trans = t3.replace("Hugo", "Joaquim");
palco.innerHTML += "<br>Substitui o valor da variavel que foi colocado no 1º parametro pelo 2º: "+trans;

// Para fazer multi replace 
t3 = t3+" ";
var multiNome = t3.repeat(10);
trans = multiNome.replace(/Hugo/g, "Joaquim");
palco.innerHTML += "<br>Substitui o valor da variavel que foi colocado no 1º parametro pelo 2º em todos os matchs: "+trans;

trans = trans.replaceAll("Joaquim", "Hugo");
palco.innerHTML += "<br>Substitui o valor da variavel que foi colocado no 1º parametro pelo 2º em todos os matchs: "+trans;

// Converter em multi valores (Array)

trans = trans.trim();
var nomes = trans.split(" ");
palco.innerHTML += "<br> Parte a string através do element de corte definido na função split: "+nomes;

////////////// NUMEROS

palco.innerHTML += '<br><br><br> <h1>Numeros</h1>';
var n1 = 10;
var d1 = 3.145678;

// Converter numero em string
var str = n1.toString();

//Para arredondar multiplas casas decimais
palco.innerHTML += '<br>'+d1.toFixed(0);
palco.innerHTML += '<br>'+d1.toFixed(1);
palco.innerHTML += '<br>'+d1.toFixed(2);
palco.innerHTML += '<br>'+d1.toFixed(3);

//Para arredondar multiplas casas decimais e retorna o comprimento de numero que necessitamos
palco.innerHTML += '<br><br>'+d1.toPrecision();
palco.innerHTML += '<br>'+d1.toPrecision(2);
palco.innerHTML += '<br>'+d1.toPrecision(10);
palco.innerHTML += '<br>'+d1.toPrecision(12);

//Converter em numero

//Number
palco.innerHTML += '<br><br>'+Number(true);
palco.innerHTML += '<br>'+Number(false);
palco.innerHTML += '<br>'+Number('10');
palco.innerHTML += '<br>'+Number('   25');
palco.innerHTML += '<br>'+Number('25   ');
palco.innerHTML += '<br>'+Number('25,60');
palco.innerHTML += '<br>'+Number('63.000');
palco.innerHTML += '<br>'+Number('25 88');
palco.innerHTML += '<br>'+Number('Tiago');

//parseInt
palco.innerHTML += '<br><br>'+parseInt('20 texto');
palco.innerHTML += '<br>'+parseInt('texto 20');
palco.innerHTML += '<br>'+parseInt('10');
palco.innerHTML += '<br>'+parseInt('   25');
palco.innerHTML += '<br>'+parseInt('25   ');
palco.innerHTML += '<br>'+parseInt('25,60');
palco.innerHTML += '<br>'+parseInt('63.000');
palco.innerHTML += '<br>'+parseInt('25 88');
palco.innerHTML += '<br>'+parseInt('Tiago');

// parseFloat
palco.innerHTML += '<br><br>'+parseFloat('20 texto');
palco.innerHTML += '<br>'+parseFloat('texto 20');
palco.innerHTML += '<br>'+parseFloat('10');
palco.innerHTML += '<br>'+parseFloat('   25.9864');
palco.innerHTML += '<br>'+parseFloat('25   ');
palco.innerHTML += '<br>'+parseFloat('25,60');
palco.innerHTML += '<br>'+parseFloat('63.001');
palco.innerHTML += '<br>'+parseFloat('25.888888888');
palco.innerHTML += '<br>'+parseFloat('Tiago');

// eval -> tenta operar tudo o que consegue
palco.innerHTML += '<br><br>'+eval('20 + 36');
palco.innerHTML += '<br>'+eval('8 + 9 - 8 + 3');
palco.innerHTML += '<br>'+eval('10 + 10');
palco.innerHTML += '<br>'+eval('10 + 66 - 55 * 9');
palco.innerHTML += '<br>'+eval('88 % 2+ 30');
//palco.innerHTML += '<br>'+eval('a88%2+30cbajsbcajsca');

/////////// FUNÇÕES

// função sem parametros 
function ola(){
	palco.innerHTML += '<br><br><h1>OLA</h1><br><br>'
}

// Chamar ou executar uma função

ola();

// Função com retorno

function soma(){
	var nn = 10;
	var mm = 30;
	return nn + mm;
}

var dinamico = soma();
palco.innerHTML += '<br><br>'+dinamico;

// Função com retorno e com parametros

function soma2(val1, val2){
	return val1 + val2;
}

var di1 = soma2(66,999);
var di2 = soma2(1,3);
var di3 = soma2(77,7);
var di4 = soma2(3,4);
var di5 = soma2(9999999,1);

palco.innerHTML += '<br>'+di1;
palco.innerHTML += '<br>'+di2;
palco.innerHTML += '<br>'+di3;
palco.innerHTML += '<br>'+di4;
palco.innerHTML += '<br>'+di5;

/////////// ALEATÓRIO

function ale(min, max){
	return Math.floor(Math.random() * (max - min) + 1)+min;
}

palco.innerHTML += '<br><h1 style=\'text-align:center; margin-top:100px; margin-bottom:100px; color:green;\'>'+ale(500,502)+'</h1>';
