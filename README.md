# 🚀 Formulário Inteligente com Consumo de API e Validação Avançada

Projeto desenvolvido como parte das atividades práticas de desenvolvimento web, aplicando integração assíncrona, boas práticas de separação de código e validação de regras de negócio no front-end.

## 🛠️ Tecnologias e Conceitos Aplicados
* **HTML5 & CSS3:** Estruturação semântica e estilização responsiva com **Bootstrap 5**.
* **JavaScript (ES6+) & jQuery:** Requisições assíncronas via `$.getJSON`, manipulação do DOM e padrão de comunicação baseado em **Eventos Customizados** entre arquivos (`main.js` e `validation.js`).
* **Regex (Expressões Regulares):** Validação estrita de formatos de e-mail e campos obrigatórios.
* **API Externa:** Integração com o webservice **ViaCEP** para autocompletar endereços em tempo real com tratamento de concorrência e race conditions.

## 📂 Estrutura do Código
* `index.html` -> Interface do usuário responsiva baseada em componentes do Bootstrap.
* `main.js` -> Responsável pelo comportamento de máscara de CEP e requisições HTTP à API ViaCEP.
* `validation.js` -> Centraliza as regras de validação de campos, feedback visual de erros e expressões regulares.
