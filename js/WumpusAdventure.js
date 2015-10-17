
var mapaTablero;

$(document).ready(function(){
    $.jCanvas.defaults.fromCenter = false;

       $("#run").on("click",function(){
            var f = $("#finput").val();
            var c = $("#coinput").val();
            var t= $("#teinput").val();
            var p1 =$("#a1input").val();
            var p2 =  $("#a2input").val();
            var m = $("#wuinput").val();
            var ab = $("#abinput").val();

            var array = [];
            if(ab.length>0){
                array = ab.split(",");
               
            }
            mapaTablero = new MapaTablero(f, c,p1, p2,t,m,array);
            Run();
       });
});


var stick = new stickFigurePlayer1();
    var stick2= new stickFigurePlayer2();
    var WumpuStick = new stickFigureWumpus();
    var treasureStick = new figureTreasure();
    var humoStick = new figureEdor();
    
function Run(){
     stick = new stickFigurePlayer1();
     stick2= new stickFigurePlayer2();
     WumpuStick = new stickFigureWumpus();
     treasureStick = new figureTreasure();
    humoStick = new figureEdor();
    mapaTablero.crearMapa();
    render();
 
    jugador_1_Start();
    jugador_2_Start();
}

//window.onload = function ()
//{
  // Store the canvas and define its size. This is the bottom layer containing the game world.

    
    var OBJETOS={
		AVENTURERO:0,
		OPONENTE:1,
		TESORO:2,
		WUMPUS:3,
		ENTRADA_1:4,
		ENTRADA_2:5,
		VACIO:6,
		OSCURO:7,
		VIENTO:8,
		OLOR:9,
		BRILLO:10,
		VIENTO_OLOR:11,
		VIENTO_BRILLO:12,
		OLOR_BRILLO:13		
    };


    var estadoJuego = {
		EN_CURSO:0,
		FINALIZADO:1
    };
    

    
    //Variables para almacenar las dimensiones del tablero
    var tableroAncho;
    var tableroAlto;
    
  
    //Variables para almacenar posicion actual de los aventureros
    var posAvent1_X;
    var posAvent1_Y;
    var posAvent2_X;
    var posAvent2_Y;
    var posWumpus_X;
    var posWumpus_Y;
    var posGold_X;
    var posGold_Y;
    var posicionMalo;
    
    
    //Se define el terreno
    
    var aventurero = new Recorrido("#F2F2F2",OBJETOS.AVENTURERO);
    var oponente = new Recorrido("#F2F2F2",OBJETOS.OPONENTE);
    var tesoro = new Recorrido("#F2F2F2",OBJETOS.TESORO);
    var wumpus = new Recorrido("#F2F2F2",OBJETOS.WUMPUS);
    var entrada_1 = new Recorrido("#58D3F7",OBJETOS.ENTRADA_1);
    var entrada_2 = new Recorrido("#2E64FE",OBJETOS.ENTRADA_2);
    var vacio = new Recorrido("#F2F2F2",OBJETOS.VACIO);
    var oscuro = new Recorrido("#000000",OBJETOS.OSCURO);
	var viento = new Recorrido("#ffffff",OBJETOS.VIENTO);
	var olor = new Recorrido("#F2CC33",OBJETOS.OLOR);
	var brillo = new Recorrido("#F2F2F2", OBJETOS.BRILLO);
    
    //color: especifica el color que va a tener de fondo
    //miPosicion: indica que tipo de objeto utilizara del Enum de Objeto
    function Recorrido(color, miPosicion){
        this.color = color;
        this.miPosicion = miPosicion;
    };
    
    function EstadoAventurero(vida, flecha, premio){
        this.tieneVida = vida;
        this.tieneFlecha = flecha;
        this.tieneTesoro = premio;
    };
    
    var alto;
    var ancho;
    

    
    
    
    
    //Se define las caracteristicas del mapa
    function MapaTablero(filas,columnas, avent1, avent2,premio,malo,abismos){
        this.mapa = new Array(filas*columnas);
        this.mapaAncho = columnas * 64;
        this.mapaAlto = filas * 64;
        posicionMalo = malo;
        
        alto = filas;
        ancho = columnas;
        
        //Variables para almacenar el camino seguro de cada aventurero
        this.caminoAvent1=[];
        this.caminoAvent2=[];
		

        
        this.crearMapa = function(){
            
            //se coloca el mapa en blanco
            for(var i=0; i< this.mapa.length; i++){
                this.mapa[i] = vacio;
            }
            
            for(var i=0;i<abismos.length;i++){
                this.mapa[abismos[i]]= oscuro;
                
            }
									
			
            this.mapa[avent1] = aventurero;
            this.mapa[avent2] = oponente;
            this.mapa[premio] = tesoro;
			
			
            this.mapa[malo] = wumpus;
			
						
      			colocarPistas(this.mapa, malo, olor, filas, columnas,false);
      			colocarPistas(this.mapa, premio, brillo, filas, columnas,false);


            //Coloca la posicion de entrada en los caminos de cada aventurero
            
            var enterIndex = this.mapa.indexOf(aventurero);
            currentIndex = enterIndex;
            
            currentIndex2 = this.mapa.indexOf(oponente);
            
            
            this.caminoAvent1.push(avent1);
            this.caminoAvent2.push(avent2);
            
            
            posAvent1_Y = Math.floor(avent1/filas) * 64;
            if(avent1 % columnas > 0){
                posAvent1_X = (avent1 % columnas)*64;
            }
            else{
                posAvent1_X = 0;
            }
            

            posAvent2_Y = Math.floor(avent2/filas)*64;
            if(avent2 % columnas > 0){
                posAvent2_X = (avent2 %columnas)*64;
            }
            else{
                posAvent2_X = 0;
            }
            
            
            posWumpus_Y = Math.floor(malo/filas)*64;
            if(malo % columnas > 0){
                posWumpus_X = (malo %columnas)*64;
            }
            else{
                posWumpus_X = 0;
            }
            
            
            posGold_Y = Math.floor(premio/filas)*64;
            if(premio % columnas > 0){
                posGold_X = (premio %columnas)*64;
            }
            else{
                posGold_X = 0;
            }
            
            
            //Dibuja las posiciones no visitadas de otro color
            this.dibujaObjeto = function()
            {
                for(var y = 0; y < filas; y++)
                {
                    for(var x = 0; x < columnas; x++)
                    {
                        
                        var recorridoActual = this.mapa[y* filas+x];
                        
                        var xDrawPoint = x * 64;
                        var yDrawPoint = y * 64;                        
                       
                        
                       $('canvas').drawRect({
                          fillStyle: recorridoActual.color,
                          x: xDrawPoint, y: yDrawPoint,
                          width: 64,
                          height: 64
                        });
                        //context1.fillStyle = recorridoActual.color;
                        //context1.fillRect(xDrawPoint, yDrawPoint, 64, 64);
                        
                    }
                }
            };
            
        };
        
    };
    
	

	//Coloca pistas de objeto cercano (wumpus, tesoro, abismo)
	function colocarPistas(mapa, posicionObjeto, pista, filas, columnas,clear){
		var filaPista = parseInt(posicionObjeto/filas);
		var columnaPista =  parseInt(posicionObjeto - parseInt(filas*(filaPista)));
		
		if(filaPista>0){
			var row = (filaPista-1) * filas;
			var position = row + columnaPista;
            if(clear)
                mapa[position] = vacio;
            else
			     mapa[position] = pista;
		}
				
		if(columnaPista > 0){
			var position = (filaPista * filas) + columnaPista -1;
            if(clear)
                mapa[position] = vacio;
            else
			     mapa[position] = pista;
		}
		
		if(columnaPista < columnas-1){
			var position = (filaPista * filas) + columnaPista +1;
            if(clear)
                mapa[position] = vacio;
            else
			     mapa[position] = pista;
		}
		
		if(filaPista<filas-1 ){
			var row = (filaPista+1) * filas;
			var position = row + columnaPista;
            if(clear)
                mapa[position]=vacio;
            else				
			     mapa[position] = pista;
		}
	}
    
    
    function afectaBrilloTesoro(limpia,posicion,filas,columnas){
        //alert("limpia:"+limpia+",posicion:"+posicion+",filas:"+filas+",columnas:"+columnas);
        colocarPistas(mapaTablero.mapa, posicion, brillo, filas, columnas,limpia);
    }
    

  // Constructor for the little stickFigure sprite that moves around the map.
  // The figues movements are in control of an event listener created herein.
  function stickFigurePlayer1()
  {      
    this.stickFigure = new Image();
    this.stickFigure.src = "img/AVENTURERO1.png";
	this.estado = new EstadoAventurero(true,true,false);
    // The figure is rendered in the center of each block, begining with the entrance.
    this.renderEntity = function()
    {
        this.x = posAvent1_X;
        this.y = posAvent1_Y;
        if(stick.estado.tieneVida)
        $('canvas').drawImage({
          source: this.stickFigure.src,
          x: this.x, y: this.y
        });
		  //context1.drawImage(this.stickFigure, this.x, this.y);
          
          updateStatusText(1,stick.estado.tieneVida,stick.estado.tieneTesoro,stick.estado.tieneFlecha);
    };
  }

    
    function stickFigurePlayer2()
    {
        this.stickFigure = new Image();
		  this.stickFigure.src = "img/AVENTURERO2.png";
        this.estado = new EstadoAventurero(true,true,false);     
        // The figure is rendered in the center of each block, begining with the entrance.
        this.renderEntity = function()
        {
			this.x = posAvent2_X;
			this.y = posAvent2_Y;
            if(stick2.estado.tieneVida)
            $('canvas').drawImage({
              source: this.stickFigure.src,
              x: this.x, y: this.y
            });
                //context1.drawImage(this.stickFigure, this.x , this.y);
                
            updateStatusText(2,stick2.estado.tieneVida,stick2.estado.tieneTesoro,stick2.estado.tieneFlecha);
        };
    }
    
    
    function stickFigureWumpus()
    {
        this.stickFigure = new Image();
		  this.stickFigure.src = "img/WUMPUS.png";
        this.estado = new EstadoAventurero(true,false,false);     
        // The figure is rendered in the center of each block, begining with the entrance.
        this.renderEntity = function()
        {
			this.x = posWumpus_X;
			this.y = posWumpus_Y;
            if(WumpuStick.estado.tieneVida){
                $('canvas').drawImage({
                  source: this.stickFigure.src,
                  x: this.x, y: this.y
                });
                //context1.drawImage(this.stickFigure, this.x , this.y);

                colocarPistas(mapaTablero.mapa, posicionMalo, olor, alto, ancho,false);
            }
                
        };
    }
    
    function figureTreasure()
    {
        this.stickFigure = new Image();
		  this.stickFigure.src = "img/GOLD.png";
        this.estado = new EstadoAventurero(false,false,true);     
        // The figure is rendered in the center of each block, begining with the entrance.
        this.renderEntity = function()
        {
			this.x = posGold_X;
			this.y = posGold_Y;
            if(treasureStick.estado.tieneTesoro)
            $('canvas').drawImage({
              source: this.stickFigure.src,
              x: this.x, y: this.y
            });
                //context1.drawImage(this.stickFigure, this.x , this.y);
        };
    }
    
    function figureEdor(){
        this.stickFigure = new Image();
		this.stickFigure.src = "img/Humo.gif";
        
        this.renderEntity = function()
        {
            for(var i=0; i<ancho*alto; i++){
                if(mapaTablero.mapa[i] == olor){
                    var y = Math.floor(i/alto)*64;
                    var x = 0;
                    if(i % ancho > 0){
                        x = (i %ancho)*64;
                    }
                    else{
                        x = 0;
                    }        			
                    //context1.drawImage(this.stickFigure, x , y);   
                }
                 
            }            
        };
    }
    
 function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

    function jugador_1_Start(){
        setTimeout(function(){
            if(currentIndex<(ancho*alto) && stick.estado.tieneVida){
                   
                   this.oldIndex = currentIndex;
                   this.validMove = false;
                   var intentsCount = 0;
                   var valueOnNext;
                   
                   
                   while(!validMove){
                       currentIndex = makeMove(this.oldIndex,mapaTablero.caminoAvent1[mapaTablero.caminoAvent1.length -1]);
                        if(mapaTablero.caminoAvent1.indexOf(currentIndex) < 0){
                            this.validMove = true;
                        }
                        if(intentsCount >= 5){
                            console.log("Limit Reached!");
                            this.validMove = true;
                        }
                        intentsCount++;
                        sleep(5);                        
                   }
				   
                   
                   if(stick.estado.tieneTesoro){
                        currentIndex = mapaTablero.caminoAvent1.pop();                       
                   }else{
                       mapaTablero.caminoAvent1.push(currentIndex);
                   }
                   
				   mapaTablero.mapa[oldIndex] = vacio;
                   
				   if(mapaTablero.mapa[currentIndex] == wumpus){
					   stick.estado.tieneVida = false;
				   }
                   else if(mapaTablero.mapa[currentIndex] == tesoro){
                       stick.estado.tieneTesoro = true;      
                       treasureStick.estado.tieneTesoro = false;                 
                   }
                   else{
                       mapaTablero.mapa[currentIndex] = aventurero;
                   }

                   posAvent1_Y = Math.floor(currentIndex/alto) * 64;
                   
                   if(currentIndex % ancho > 0){
						posAvent1_X = (currentIndex % ancho)*64;
                   }
                   else{
						posAvent1_X = 0;
				   }
                   
                   if(stick.estado.tieneTesoro){
                       afectaBrilloTesoro(true,this.oldIndex,alto,ancho);       
                       afectaBrilloTesoro(false,currentIndex,alto,ancho);
                   }
				   
				   render();
                   stick.renderEntity();
                   treasureStick.renderEntity();
                   WumpuStick.renderEntity();
				   humoStick.renderEntity();
                   window.requestAnimationFrame(jugador_1_Start);                   
            }
        },200);
    }
    
    
    function jugador_2_Start(){
        setTimeout(function(){
            if(currentIndex2<(ancho*alto) && stick2.estado.tieneVida){
                   
                   this.oldIndex = currentIndex2;
                   this.validMove = false;
                   var intentsCount = 0;
                   while(!validMove){
                       currentIndex2 = makeMove(this.oldIndex,mapaTablero.caminoAvent2[mapaTablero.caminoAvent2.length -1]);
                        if(mapaTablero.caminoAvent2.indexOf(currentIndex2) < 0){
                            this.validMove = true;
                        }
                        if(intentsCount >= 5){
                            console.log("Limit Reached!");
                            this.validMove = true;
                        }
                        intentsCount++;
                        sleep(5);         
                        
                   }
				   
                   
                   if(stick2.estado.tieneTesoro){
                        currentIndex2 = mapaTablero.caminoAvent2.pop();                       
                   }else{
                       mapaTablero.caminoAvent2.push(currentIndex2);
                   }
                   
				   mapaTablero.mapa[oldIndex] = vacio;
                   
				   if(mapaTablero.mapa[currentIndex2] == wumpus){
					   stick2.estado.tieneVida = false;
				   }
                   else if(mapaTablero.mapa[currentIndex2] == tesoro){
                       stick2.estado.tieneTesoro = true;
                       treasureStick.estado.tieneTesoro = false;                  
                   }
                   else{
                       mapaTablero.mapa[currentIndex2] = oponente;
                   }

                   posAvent2_Y = Math.floor(currentIndex2/alto) * 64;
                   
                   if(currentIndex2 % ancho > 0){
						posAvent2_X = (currentIndex2 % ancho)*64;
                   }
                   else{
						posAvent2_X = 0;
				   }
                   
                   if(stick2.estado.tieneTesoro){
                       afectaBrilloTesoro(true,this.oldIndex,alto,ancho);       
                       afectaBrilloTesoro(false,currentIndex2,alto,ancho);
                   }
				   
				           render();
                   stick2.renderEntity();
                   treasureStick.renderEntity();
                   WumpuStick.renderEntity();
				   humoStick.renderEntity();
				   
                   window.requestAnimationFrame(jugador_2_Start);                   
            }
        },200);
    }
    
    
    
    
    //obtiene la posicion a la que se debe colocar el aventurero
    function makeMove(current,previousRandom){
        var filaPista = parseInt(current/alto);
    		var columnaPista =  parseInt(current - parseInt(alto*(filaPista)));
    		var position = -1;
        
        var validValue = false;
        
        while(!validValue){
            
            var d = new Date();
            var n = d.getTime();
            var random =  n% d.getDate();
            random = random * 12318193713;
            random = random % 16*9887675543;
            random = (random+770099) %16;

            
            if(filaPista>0 && random <= 3){
    			var row = (filaPista-1) * alto;
    			position = row + columnaPista;            
    		}
    				
    		if(columnaPista > 0 && (random>=12 && random<=15)){
    		      position = (filaPista * alto) + columnaPista -1;
    		}
    		
    		if(columnaPista < ancho-1 && (random>=4 && random<=7)){
    			position = (filaPista * alto) + columnaPista +1;
                
    		}
    		
    		if(filaPista<alto-1 && (random>=8 && random<=11) ){
    			var row = (filaPista+1) * alto;
    			position = row + columnaPista;            
    		}
            
            if(previousRandom != position && position>-1){
                validValue = true;
            }
            
        }		
        
        return position;
    }
    

    //toma la decision si atacar o morir
    function makeDecition(){
        var d = new Date();
        var n = d.getTime();
        var random =  n% d.getDate();        
        random = (random+9876524) % 16;
        
        if(random<=7)
            return 0;
        else
            return 1;
    }
    
    function updateStatusText(numero,vida,premio,flecha){
        var txtVida = (vida)?"Si":"No" ;
        var txtPremio =(premio)?"Si":"No" ;
        var txtFlecha =(flecha)?"Si":"No" ;
        $("#vida"+numero).text(txtVida);
        $("#premio"+numero).text(txtPremio);
        $("#flecha"+numero).text(txtFlecha);
    }

    // Consolidates the render functions. Continously renders the tileMap, the stickFigure(player).
    function render()
    {
        $('canvas').clearCanvas();
    		//context1.clearRect(0,0,ancho,alto);
    		mapaTablero.dibujaObjeto();
    		stick.renderEntity();
    		stick2.renderEntity();
            treasureStick.renderEntity();
            WumpuStick.renderEntity();
            humoStick.renderEntity();
    }
  
//};
