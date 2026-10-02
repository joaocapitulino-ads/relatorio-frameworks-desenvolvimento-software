/*
 * main.js
 * Consumo da API ViaCEP: ao digitar o CEP, preenche rua, bairro, cidade e estado.
 * A validação dos campos fica em validation.js.
 */
$(function () {
    'use strict';

    var $cep = $('#cep');

    function somenteNumeros(valor) {
        return valor.replace(/\D/g, '');
    }

    // Aplica a máscara 00000-000 enquanto o usuário digita
    function formatarCep(valor) {
        var numeros = somenteNumeros(valor).slice(0, 8);
        return numeros.length > 5 ? numeros.slice(0, 5) + '-' + numeros.slice(5) : numeros;
    }

    function limparEndereco() {
        $('#rua, #bairro, #cidade, #estado').val('');
    }

    function preencherEndereco(dados) {
        // trigger('change') avisa o validation.js para atualizar o visual dos campos
        $('#rua').val(dados.logradouro || '').trigger('change');
        $('#bairro').val(dados.bairro || '').trigger('change');
        $('#cidade').val(dados.localidade || '').trigger('change');
        $('#estado').val(dados.uf || '').trigger('change');
        $(dados.logradouro ? '#numero' : '#rua').trigger('focus');
    }

    function buscarCep(cepNumeros) {
        $cep.addClass('opacity-50');

        $.getJSON('https://viacep.com.br/ws/' + cepNumeros + '/json/')
            .done(function (dados) {
                // Ignora resposta antiga caso o CEP tenha mudado durante a consulta
                if (somenteNumeros($cep.val()) !== cepNumeros) { return; }

                if (dados.erro) {
                    limparEndereco();
                    $cep.trigger('cep-invalido');
                    return;
                }
                $cep.trigger('cep-valido');
                preencherEndereco(dados);
            })
            .fail(function () {
                if (somenteNumeros($cep.val()) !== cepNumeros) { return; }
                $cep.trigger('cep-erro-rede');
            })
            .always(function () {
                $cep.removeClass('opacity-50');
            });
    }

    $cep.on('input', function () {
        $cep.val(formatarCep($cep.val()));
        var numeros = somenteNumeros($cep.val());
        if (numeros.length === 8) {
            buscarCep(numeros);
        }
    });
});
