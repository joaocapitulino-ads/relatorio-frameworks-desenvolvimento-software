/*
 * validation.js
 * Validação do formulário de cadastro com jQuery:
 *  - todos os campos precisam estar preenchidos;
 *  - e-mail validado com expressão regular;
 *  - senha, CEP, estado e nome com regras próprias.
 * O consumo da API ViaCEP fica em main.js.
 */
$(function () {
    'use strict';

    // Expressão regular para e-mail: texto@dominio.extensao
    var REGEX_EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
    var REGEX_NOME = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
    var REGEX_CEP = /^\d{5}-\d{3}$/;
    var REGEX_UF = /^[A-Za-z]{2}$/;

    // Campos que NÃO são obrigatórios. Para tornar o complemento opcional: ['complemento']
    var OPCIONAIS = [];

    var CAMPOS = ['nome', 'sobrenome', 'email', 'senha', 'cep', 'rua', 'bairro',
                  'cidade', 'estado', 'numero', 'complemento'];

    var ROTULOS = {
        nome: 'o nome', sobrenome: 'o sobrenome', email: 'o e-mail', senha: 'a senha',
        cep: 'o CEP', rua: 'a rua', bairro: 'o bairro', cidade: 'a cidade',
        estado: 'o estado', numero: 'o número', complemento: 'o complemento'
    };

    var erroCep = ''; // mensagem vinda da consulta ao ViaCEP (CEP inexistente)

    var $form = $('#formCadastro');
    var $resultado = $('#resultado');

    function valor(id) {
        return $.trim($('#' + id).val());
    }

    // Retorna a mensagem de erro do campo ou '' se estiver tudo certo
    function mensagemDeErro(id) {
        var v = valor(id);

        if (v === '') {
            if ($.inArray(id, OPCIONAIS) >= 0) { return ''; }
            if (id === 'complemento') {
                return 'Preencha o complemento (digite "Sem complemento" se não houver).';
            }
            return 'Preencha ' + ROTULOS[id] + '.';
        }

        switch (id) {
            case 'nome':
            case 'sobrenome':
                if (v.length < 2) { return 'Digite pelo menos 2 letras.'; }
                if (!REGEX_NOME.test(v)) { return 'Use apenas letras.'; }
                break;
            case 'email':
                if (!REGEX_EMAIL.test(v)) { return 'E-mail inválido. Exemplo: nome@exemplo.com'; }
                break;
            case 'senha':
                if (v.length < 6) { return 'A senha deve ter pelo menos 6 caracteres.'; }
                break;
            case 'cep':
                if (!REGEX_CEP.test(v)) { return 'O CEP deve ter 8 números. Exemplo: 86025-230'; }
                if (erroCep) { return erroCep; }
                break;
            case 'estado':
                if (!REGEX_UF.test(v)) { return 'Use a sigla com 2 letras. Exemplo: PR'; }
                break;
        }
        return '';
    }

    function limparEstado(id) {
        $('#' + id).removeClass('is-valid is-invalid');
    }

    // Valida um campo, mostra o resultado visual do Bootstrap e retorna true/false
    function validarCampo(id) {
        var $campo = $('#' + id);
        var erro = mensagemDeErro(id);

        if (erro) {
            $campo.removeClass('is-valid').addClass('is-invalid');
            $campo.siblings('.invalid-feedback').text(erro);
            return false;
        }
        if (valor(id) === '') {
            limparEstado(id); // campo opcional vazio: sem destaque
        } else {
            $campo.removeClass('is-invalid').addClass('is-valid');
        }
        return true;
    }

    function mostrarResultado(tipo, texto) {
        $resultado.attr('class', 'alert alert-' + tipo).text(texto);
    }

    function esconderResultado() {
        $resultado.attr('class', 'alert d-none').text('');
    }

    // Ao sair do campo: valida se algo foi digitado
    $form.on('focusout', 'input.form-control', function () {
        if (valor(this.id) !== '') { validarCampo(this.id); }
    });

    // Ao digitar: se o campo estava com erro, revalida na hora para o erro sumir
    $form.on('input', 'input.form-control', function () {
        if (this.id === 'cep') {
            erroCep = '';
            esconderResultado();
        }
        if ($(this).hasClass('is-invalid')) { validarCampo(this.id); }
    });

    // Preenchimento automático (main.js) dispara "change" para validar os campos
    $form.on('change', 'input.form-control', function () {
        validarCampo(this.id);
    });

    // Respostas da consulta do CEP (eventos disparados pelo main.js)
    $('#cep').on('cep-valido', function () {
        erroCep = '';
        validarCampo('cep');
    });
    $('#cep').on('cep-invalido', function () {
        erroCep = 'CEP não encontrado. Confira os números.';
        $.each(['rua', 'bairro', 'cidade', 'estado'], function (i, id) { limparEstado(id); });
        validarCampo('cep');
    });
    $('#cep').on('cep-erro-rede', function () {
        mostrarResultado('warning', 'Não foi possível consultar o CEP agora. Preencha o endereço manualmente.');
    });

    // Estado sempre em maiúsculas e só com letras
    $('#estado').on('input', function () {
        $(this).val($(this).val().replace(/[^a-zA-Z]/g, '').toUpperCase());
    });

    // Botão Mostrar/Ocultar senha
    $('#verSenha').on('click', function () {
        var $senha = $('#senha');
        var visivel = $senha.attr('type') === 'text';
        $senha.attr('type', visivel ? 'password' : 'text');
        $(this).text(visivel ? 'Mostrar' : 'Ocultar');
    });

    // Botão Verificar: valida tudo
    $form.on('submit', function (evento) {
        evento.preventDefault();

        var primeiroInvalido = null;
        $.each(CAMPOS, function (i, id) {
            if (!validarCampo(id) && primeiroInvalido === null) {
                primeiroInvalido = id;
            }
        });

        if (primeiroInvalido !== null) {
            mostrarResultado('danger', 'Corrija os campos destacados em vermelho e tente novamente.');
            $('#' + primeiroInvalido).trigger('focus');
            return;
        }

        mostrarResultado('success', 'Tudo certo! Os dados de ' + valor('nome') + ' ' +
            valor('sobrenome') + ' foram validados com sucesso.');
        $('html, body').animate({ scrollTop: 0 }, 200);
    });
});


