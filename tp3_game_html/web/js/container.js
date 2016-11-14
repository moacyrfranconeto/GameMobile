
function Container(context) {
    this.sprites = [];
    this.context = context;
    this.indiceAtual = 0;
    this.atual = null;
}
Container.prototype = {
    novoSprite: function(sprite) {
        this.sprites.push(sprite);
    },

    selecionaProximo: function() {
       this.atual = this.sprites[this.indiceAtual++]; 
    },
    
    move: function(){
        this.atual.y += 50;
    }
        
}



