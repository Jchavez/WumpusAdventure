

window.onload = function ()
{
  // Store the canvas and define its size. This is the bottom layer containing the game world.
  var canvas1 = document.getElementById("WumpusAdventureRoomBase");
  canvas1.width = 1280;
  canvas1.height = 1280;
  //Get the canvas context, and assign to a variable.
  var context1 = canvas1.getContext("2d");
  context1.fillStyle="#FFCCFF";


    
    var OBJETOS={
    AVENTURERO:0,
    OPONENTE:1,
    TESORO:2,
    WUMPUS:3,
    ENTRADA_1:4,
    ENTRADA_2:5,
    VACIO:6,
    OSCURO:7
        
    };


    var estadoJuego = {
    EN_CURSO:0,
    FINALIZADO:1
    };
    

    
    var estadoAventurero={
    tieneTesoro:false,
    tieneFlecha:true,
    tieneVida:true
    };
    
  
    //Variables para almacenar posicion actual de los aventureros
    var posAvent1_X;
    var posAvent1_Y;
    var posAvent2_X;
    var posAvent2_Y;
    
    
    //Se define el terreno
    
    var aventurero = new Recorrido("#58D3F7",OBJETOS.AVENTURERO);
    var oponente = new Recorrido("#2E64FE",OBJETOS.OPONENTE);
    var tesoro = new Recorrido("#FFBF00",OBJETOS.TESORO);
    var wumpus = new Recorrido("#FF0000",OBJETOS.WUMPUS);
    var entrada_1 = new Recorrido("#58D3F7",OBJETOS.ENTRADA_1);
    var entrada_2 = new Recorrido("#2E64FE",OBJETOS.ENTRADA_2);
    var vacio = new Recorrido("#F2F2F2",OBJETOS.VACIO);
    var oscuro = new Recorrido("#000000",OBJETOS.OSCURO);
    
    //color: especifica el color que va a tener de fondo
    //miPosicion: indica que tipo de objeto utilizara del Enum de Objeto
    function Recorrido(color, miPosicion){
        this.color = color;
        this.miPosicion = miPosicion;
    };
    
    var alto;
    var ancho;
    

    var mapaTablero = new MapaTablero(10, 10,0, 18,26,15);
    
    
    
    //Se define las caracteristicas del mapa
    function MapaTablero(filas,columnas, avent1, avent2,premio,malo){
        this.mapa = new Array(filas*columnas);
        this.mapaAncho = columnas * 64;
        this.mapaAlto = filas * 64;
        
        alto = filas * 64;
        ancho = columnas *64;
        
        //Variables para almacenar el camino seguro de cada aventurero
        this.caminoAvent1=[];
        this.caminoAvent2=[];
        
        this.crearMapa = function(){
            
            //se coloca el mapa en blanco
            for(var i=0; i< this.mapa.length; i++){
                this.mapa[i] = vacio;
            }
            
            this.mapa[avent1] = aventurero;
            this.mapa[avent2] = oponente;
            this.mapa[premio] = tesoro;
            this.mapa[malo] = wumpus;
            
            //Coloca la posicion de entrada en los caminos de cada aventurero
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
                        
                        
                       
                        context1.fillStyle = recorridoActual.color;
                        context1.fillRect(xDrawPoint, yDrawPoint, 64, 64);
                        

                    }
                }
            };
            
        };
        
    };
    
    

  // Constructor for the little stickFigure sprite that moves around the map.
  // The figues movements are in control of an event listener created herein.
  function stickFigurePlayer1()
  {
    this.stickFigure = new Image();
    this.x = posAvent1_X;
    this.y = posAvent1_Y;
    
      
    this.stickFigure.src = "img/stickFigure.png";

    // The figure is rendered in the center of each block, begining with the entrance.
    this.renderEntity = function()
    {
      context1.drawImage(this.stickFigure, this.x, this.y);
    };

  }

    
    function stickFigurePlayer2()
    {
        this.stickFigure = new Image();
        this.x = posAvent2_X;
        this.y = posAvent2_Y;
        console.log(this.x/64);
        console.log(this.y/64);

        this.stickFigure.src = "img/stickFigure.png";
        
        // The figure is rendered in the center of each block, begining with the entrance.
        this.renderEntity = function()
        {
            context1.drawImage(this.stickFigure, this.x , this.y);
        };
        
    }
    
 
    function jugador_1_Start(){
        while(posAvent1_X/64 <= 10 && posAvent1_Y /64<=10){
            
            render();
        }
        
    }
    

    // Consolidates the render functions. Continously renders the tileMap, the stickFigure(player).
    function render()
    {
      context1.clearRect(0,0,ancho,alto);
      mapaTablero.dibujaObjeto();
      stickFigure.renderEntity();
      stickFigure2.renderEntity();
    }


    // Create the map, the player, and the status text. Then begin gameplay (also triggers rendering).
    mapaTablero.crearMapa();
    var stickFigure = new stickFigurePlayer1();
    var stickFigure2 = new stickFigurePlayer2();
    render();

};
