function Nivel(context, nome, x, y, tamanho) {
	this.context = context;
	this.nome = nome;
	this.x = x;
	this.y = y;
	this.tamanho = tamanho;
}
Nivel.prototype = {
	atualizar: function() {},

	desenhar: function() {
		var ctx = this.context;
		// Guardar configurações atuais do contexto
		ctx.save();
		// Desenhar
		ctx.beginPath();
		ctx.strokeStyle = '#00ff00';
		ctx.strokeRect(this.x, this.y, this.tamanho, this.tamanho);
		ctx.fill();

		ctx.font = '14px Calibri';
		ctx.textAlign = 'center';
		ctx.fillText(this.nome, this.x+(this.tamanho/2), this.y+(this.tamanho/2));

		// Voltar às configurações anteriores
		ctx.restore();
	}
}