
function Tabuleiro(numJogadores, context) {
    this.jogadores = [];
    this.imagens = [];
    this.context = context;
    this.indiceAtual = 0;
    this.atual = null;
    this.numJogadores = numJogadores;
    this.animacao = new Animacao(this.context);
}

Tabuleiro.prototype = {
    iniciar : iniciar,
    parar : parar,
    selecionaProximo : selecionaProximo,

    mover : function(){
        this.atual.sobeNivel();
        this.selecionaProximo();
    },

    jogadorSelecionado : function(handler){
        this.notificaUsuarioSelecionado = handler;
    },   

    getJogadorAtual : function(){
        return this.atual;
    },
    carregaImages: carregaImages

};

/**
 * Seleciona o proximo jogador
 */
function selecionaProximo() {
    if(this.atual) {
        //Zera as configurações do jogador atual
        this.atual.tentativa=0;
        this.atual.selecionado = false;
    }
    if (this.indiceAtual == (this.jogadores.length)) {
        this.indiceAtual = 0;
    }
    this.indiceAtual++;
    this.atual = this.jogadores.filter(function(jogador){
        return jogador.id == this;
    }, this.indiceAtual)[0];

    this.atual.selecionado = true;
    if(this.notificaUsuarioSelecionado)
        this.notificaUsuarioSelecionado(this.atual);
}


/**
 * Cria o tabuleiro e inicia a animação
 */
function iniciar(){
    this.carregaImages();
    var xInicial = this.context.canvas.width-52;
    var linhas = 5; //Representa a quantidade de niveis do tabuleiro
    var colunas = this.numJogadores;
    var posicaoX = xInicial;
    var posicaoY = 10;
    for(var i = linhas; i > 0; i--){
        for(var x = colunas; x > 0; x--){
            this.animacao.novoSprite(new Nivel(this.context, ''+i, posicaoX, posicaoY, 50));
            posicaoX -= 50;
        }
        posicaoX = xInicial;
        posicaoY +=50;
    }

    var x = this.context.canvas.width-43;
    for(var i = this.numJogadores; i > 0; i--){
        var jogador = new Jogador(this.context, x, i, this.imagens);
        this.jogadores.push(jogador);
        this.animacao.novoSprite(jogador);
        x -= 50;
    }
    this.selecionaProximo();
    this.animacao.ligar();
}
/**
 * Interrompe a animação
 */
function parar(){
    this.animacao.desligar();
    this.animacao.limparSprites();
    this.jogadores = [];
    this.indiceAtual = 0;
    this.atual = null;
}

/**
 * Faz o carregamento das imagens
 */
function carregaImages(){
    var _this = this;
    ['imagens/toad_32_red.png',
        'imagens/toad_32_green.png'
    ].forEach(function(item){
        var img = new Image();
        img.src = item;
        _this.imagens.push(img);
    });
}




