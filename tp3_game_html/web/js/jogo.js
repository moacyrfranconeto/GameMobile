(function($){
	'use strict';

    $(window).on('load', (function(){
        $('#areaJogo').hide();
        $('#vencedorContainer').hide();
        $('#txtResposta').mask('(SMS)MS', {
            'translation': {
                S: {pattern: /[ABCabc]/},
                M: {pattern: /[+\-*/]/}
            }
        });
        if(window.innerWidth >= 400){
            var op = $('.operacoes');
            op.each(function(){
                var last = this.className;
                this.className = 'btn-group-vertical ' + last;
            });

            console.log(op);
            //.addClass('btn-group-vertical')
        }

    }));

	var canvas, context, tabuleiro, txtMensagem, jogadorAtual, valores, timer,
        mensagens, mensagemJogador, valorNecessario, infoJogador, nsQtdeJogador;

	var operacoes = {
		'+': function(valorA, valorB){
			return valorA+valorB;
		},

		'-': function(valorA, valorB){
			return valorA-valorB;
		},
		'*': function(valorA, valorB){
			return valorA*valorB;
		},
		'/': function(valorA, valorB){
			return valorA/valorB;
		}
	};

	carregaComponentes();

    /**
     *
     */
	function carregaComponentes(){
		canvas = $('#canvas')[0];
		context = canvas.getContext('2d');

        $('#btIniciar').on('click', iniciar);
        $('#btReiniciar').on('click', iniciar);
        $('#btValidar').on('click', validar);
        $('#btPassar').on('click', passar);
		nsQtdeJogador = $('#qtdeJogadores')[0];
		txtMensagem = $('#mensagem');
        mensagemJogador = $('#mensagemJogador');
        valorNecessario = $('#valorNecessario');
        mensagens = $('#mensagens')[0];
        infoJogador = $('#infoJogador');
	}

    /**
     *
     */
	function iniciar() {

	    if(tabuleiro && tabuleiro.animacao.ligado){
            tabuleiro.parar();
            return;
        }
		if(nsQtdeJogador.value >= 1 && nsQtdeJogador.value <=5) {
			tabuleiro = new Tabuleiro(nsQtdeJogador.value, context);
			tabuleiro.jogadorSelecionado(atualizaJogador);
			tabuleiro.iniciar();
			geraValores();
			$('#areaJogo').show();
			$('#iniciarContainer').hide();
			$('#vencedorContainer').hide();
		}
	}

    /**
     *
     */
	function geraValores(){
		var a, b, c;
		a = parseInt(geraValorAleatorio(1, 6));
		b = parseInt(geraValorAleatorio(1, 6));
		c = parseInt(geraValorAleatorio(1, 6));
		valores = {A: a, B: b, C:c};
        $('#txtValorA').text(a);
        $('#txtValorB').text(b);
        $('#txtValorC').text(c);
        info(jogadorAtual.nome + ' é sua vez!', 4000);
 	}

    /**
     *
     * @param min
     * @param max
     * @returns {*}
     */
	function geraValorAleatorio(min, max) {
		return Math.random() * (max - min) + min;
	}

    /**
     *
     * @param selecionado
     */
	function atualizaJogador(selecionado){
		jogadorAtual = selecionado;
        if(jogadorAtual != null) {
            mensagemJogador.html(jogadorAtual.nome + ' valor necessário é: ');
            valorNecessario.html(jogadorAtual.nivel + 1);
        } else {
            infoJogador.hide();
        }
	}

    /**
     *
     */
	function mover(){
        if(jogadorAtual.nivel+1 == 5){
            fimDeJogo();
            return;
        }
		tabuleiro.mover();
	}

    /**
     *
     */
	function fimDeJogo() {
        tabuleiro.parar();
        $('#areaJogo').hide();
        $('#vencedorContainer').show();
        $('#txtJogadorVencedor').html(jogadorAtual.nome + ' venceu!');
    }

    /**
     *
     */
	function selecionaProximo(){
	    tabuleiro.selecionaProximo();
    }

    /**
     * Verifica e executa as operações mateméticas
     * Caso o input de formula seja preenchido, a formula
     * digitada será usada para validar. Caso contrario, valida
     * os campos com Drag And Drop
     */
    function validar(){
        if($.trim($('#txtResposta').val()) != ''){
            var formula = $('#txtResposta').val().toUpperCase();
            if(validaFormula(formula)){
                var v1 = valores[formula[1]];
                var v2 = valores[formula[3]];
                var v3 = valores[formula[6]];
                var op1 = formula[2];
                var op2 = formula[5];
                executaOperacoes(op1, op2, v1, v2, v3);
                $('#txtResposta').val('');
            } else {
                erro('Formula inválida', true);
            }
            return;
        }

		var operacaoA, operacaoB;
		try {
            operacaoA = document.querySelector('input[name="operacaoA"]:checked').value;
            operacaoB = document.querySelector('input[name="operacaoB"]:checked').value;
        } catch (e){
			erro('Selecione as operações', true);
            return;
        }
	    var colunaA = $('#a')[0];
		var colunaB = $('#b')[0];
		var colunaC = $('#c')[0];
		var vA = parseInt(valores[colunaA.children[0].innerText]);
		var vB = parseInt(valores[colunaB.children[0].innerText]);
		var vC = parseInt(valores[colunaC.children[0].innerText]);
        executaOperacoes(operacaoA, operacaoB, vA, vB, vC);
	}

    /**
     *
     * @param mensagem
     * @param fecha
     */
	function info(mensagem, fecha){
		mensagens.classList.remove('hidden');
		mensagens.classList.remove('alert-danger');
		mensagens.classList.add('alert-success');
		mostraMensagem(mensagem, fecha);
	}

    /**
     *
     * @param mensagem
     * @param fecha
     */
	function erro(mensagem, fecha){
		mensagens.classList.remove('hidden');
		mensagens.classList.remove('alert-success');
		mensagens.classList.add('alert-danger');
		mostraMensagem(mensagem, fecha);
	}

    /**
     *
     * @param mensagem
     * @param fecha
     */
	function mostraMensagem(mensagem, fecha){
		txtMensagem.html(mensagem);
		if(fecha){
		    if(timer) clearTimeout(timer);
			timer = setTimeout(function () {
				txtMensagem.html('');
				mensagens.classList.add('hidden');
			}, 3000);
		}
	}

    /**
     *
     */
	function validaTentativa(){
	    return ++jogadorAtual.tentativa < 3;
    }

    /**
     *
     */
    function passar(){
        selecionaProximo();
        geraValores();
    }

    /**
     * Valida se a formulá digitada é válida.
     * A formula deverá possuir um de cada dos 3 valores A, B e C
     * e duas operações matematicas
     * @param formula
     * @returns {boolean}
     */
    function validaFormula(formula){
        //Valida o tamanho da formula
        if(formula.length != 7){
            return false;
        }
        //Verifica se possui os valores necessários
        if((formula.match(/A/g)||[]).length != 1 ||
            (formula.match(/B/g)||[]).length != 1 ||
            (formula.match(/C/g)||[]).length!= 1){
            return false;
        }
        //Verifica se possui as operações
        var operadores = formula[2]+formula[5];
        return (operadores.match(/[+\-*/]/g)||[]).length==2;

        //if((operadores.match(/[+\-*/]/g)||[]).length!=2){
        //    return false
        //}
        //return true;
    }

    /**
     * Executa as operações matemáticas de acordo com
     * os valores informados
     * @param op1
     * @param op2
     * @param v1
     * @param v2
     * @param v3
     */
    function executaOperacoes(op1, op2, v1, v2, v3){
        var resultadoA = operacoes[op1](v1, v2);
        var resultadoFinal = parseInt(operacoes[op2](resultadoA, v3));
        if(Math.abs(resultadoFinal)==(tabuleiro.getJogadorAtual().nivel+1)){
            mover();
            geraValores();
            info('Parabéns! Resultado correto.<br/>' +
                jogadorAtual.nome + ' é sua vez!', true);
        } else {
            var msg = 'Resultado inválido! ' + resultadoFinal;
            if(validaTentativa()){
                erro(msg + '<br />Tente novamente! Tentativas restantes: ' + (3-jogadorAtual.tentativa), true);
            } else {
                passar();
                erro(msg + '<br />Possou a vez!<br />' + jogadorAtual.nome + ' é sua vez!', true);
            }
        }
    }
})(jQuery);


