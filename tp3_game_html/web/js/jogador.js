function Jogador(context, posicaoX, id, imagens) {
	this.context = context;
	this.id = id;
	this.nome = 'Jogador' + id;
	this.x = posicaoX;
	this.y = this.context.canvas.height -35;
	this.nivel = 0;
	this.tentativa = 0;
	this.selecionado = false;
	this.imagens = imagens;
	this.imagemAtual = 0;
}
Jogador.prototype = {
	atualizar: function() {},

	sobeNivel: function(){
		this.nivel += 1;
		this.y -= this.nivel==1 ? 43 : 50;
	},
	
	desenhar: function() {
		this.imagemAtual = this.selecionado ? 1 : 0;
		var ctx = this.context;
		// Guardar configurações atuais do contexto
		ctx.save();
		// Desenhar
		ctx.beginPath();
		ctx.drawImage(this.imagens[this.imagemAtual], this.x, this.y);
		ctx.fill();
		// Voltar às configurações anteriores
		ctx.restore();
	}
};