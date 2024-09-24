// Dados dos produtos
const produtos = {
    "pão francês": { quantidade: 50, fabricacao: "24/09/2024", preco: "R$ 1,00" },
    "croissant": { quantidade: 20, fabricacao: "23/09/2024", preco: "R$ 4,50" },
    "bolo de chocolate": { quantidade: 5, fabricacao: "22/09/2024", preco: "R$ 25,00" },
};

// Função para adicionar mensagens ao chatbox
function adicionarMensagem(texto, classe) {
    const chatbox = document.getElementById("chatbox");
    const mensagem = document.createElement("div");
    mensagem.className = `message ${classe}`;
    mensagem.textContent = texto;
    chatbox.appendChild(mensagem);
    chatbox.scrollTop = chatbox.scrollHeight; // Scroll automático
}

// Função para remover acentos de uma string
function removerAcentos(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Função para saudação com base no horário
function saudacaoHorario() {
    const data = new Date();
    const horas = data.getHours();
    let saudacao;

    if (horas >= 0 && horas < 12) {
        saudacao = "Olá, Bom dia! Faça uma pergunta sobre nossos produtos.";
    } else if (horas >= 12 && horas < 18) {
        saudacao = "Olá, Boa tarde! Faça uma pergunta sobre nossos produtos.";
    } else {
        saudacao = "Olá, Boa noite! Faça uma pergunta sobre nossos produtos.";
    }

    adicionarMensagem(saudacao, "bot");
    adicionarMensagem("Exemplo: 'Qual é o preço do croissant?'", "bot");
}

// Função para processar a mensagem do usuário
function processarMensagem(mensagem) {
    mensagem = removerAcentos(mensagem.toLowerCase().trim()); // Remover acentos e normalizar o texto

    let resposta = "Desculpe, não entendi sua pergunta. Tente perguntar, por exemplo: 'Quantos pães franceses vocês têm?'";

    // Verifica se o usuário perguntou sobre um produto
    for (let produto in produtos) {
        const variacoesProduto = [
            produto, 
            produto.replace(" ", ""), // Remover espaço (p.ex. "pãofrancês")
            removerAcentos(produto) // Sem acentos (p.ex. "pao frances")
        ];

        if (variacoesProduto.some(variacao => mensagem.includes(variacao))) {
            const variacoesQuantidade = ["quantidade", "quantos", "qtd", "qtde", "tem quantos"];
            const variacoesFabricacao = ["fabricacao", "fabricado", "data de fabricacao", "quando foi feito"];
            const variacoesPreco = ["preco", "custa", "valor"];

            if (variacoesQuantidade.some(variacao => mensagem.includes(variacao))) {
                resposta = `Temos ${produtos[produto].quantidade} unidades de ${produto} disponíveis.`;
            } else if (variacoesFabricacao.some(variacao => mensagem.includes(variacao))) {
                resposta = `O ${produto} foi fabricado em ${produtos[produto].fabricacao}.`;
            } else if (variacoesPreco.some(variacao => mensagem.includes(variacao))) {
                resposta = `O preço do ${produto} é ${produtos[produto].preco}.`;
            }
            return resposta;
        }
    }

    // Verifica as saudações
    const saudacoes = ["olá", "oi", "ola", "oii", "tudo bem", "td bem", "bom dia", "boa tarde", "boa noite"];
    if (saudacoes.some(saudacao => mensagem.includes(saudacao))) {
        resposta = "Olá! Estou aqui para ajudar. Você pode perguntar algo como: 'Qual é o preço do croissant?'";
        return resposta;
    }

    return resposta;
}

// Saudação quando a página é carregada
window.onload = function() {
    saudacaoHorario();
};

// Evento de clique no botão Enviar
document.getElementById("sendButton").addEventListener("click", function() {
    const userInput = document.getElementById("userInput");
    const mensagemUsuario = userInput.value.trim();

    if (mensagemUsuario) {
        adicionarMensagem(mensagemUsuario, "user");
        const resposta = processarMensagem(mensagemUsuario);
        adicionarMensagem(resposta, "bot");
        userInput.value = ''; // Limpa o campo de input
    }
});

// Evento de tecla Enter para enviar a mensagem
document.getElementById("userInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        document.getElementById("sendButton").click();
    }
});
