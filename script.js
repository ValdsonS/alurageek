// Selecionando elementos
const nomeInput = document.getElementById("nome");
const valorInput = document.getElementById("valor");
const imagemInput = document.getElementById("imagem");
const form = document.querySelector("form");
const produtosContainer = document.querySelector(".produtos");

// Função para carregar produtos ao iniciar a página
const carregarProdutos = async () => {
  try {
    const response = await fetch("http://localhost:3000/produtos");
    const produtos = await response.json();
    produtos.forEach((produto) => renderizarProduto(produto));
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
  }
};

// Função para adicionar produto
const adicionarProduto = async (nome, valor, imagem) => {
  const produto = {
    nome,
    valor,
    imagem,
  };

  try {
    // Enviando produto para o JSON Server
    const response = await fetch("http://localhost:3000/produtos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(produto),
    });

    if (response.ok) {
      const novoProduto = await response.json();
      renderizarProduto(novoProduto);
      console.log("Produto adicionado com sucesso:", novoProduto);
    } else {
      console.error("Erro ao adicionar produto:", response.statusText);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
};

// Função para renderizar o produto na tela
const renderizarProduto = (produto) => {
  const card = document.createElement("div");
  card.classList.add("produto-card");
  card.innerHTML = `
    <img src="${produto.imagem}" alt="${produto.nome}" />
    <h3>${produto.nome}</h3>
    <p>$ ${produto.valor}</p>
    <button class="delete-btn" data-id="${produto.id}">🗑️</button>
  `;

  // Adiciona o evento de clique para excluir o produto
  const deleteBtn = card.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => excluirProduto(produto.id));

  produtosContainer.appendChild(card);
};

// Evento de submit do formulário
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const nome = nomeInput.value;
  const valor = valorInput.value;
  const imagem = imagemInput.value;
  adicionarProduto(nome, valor, imagem);
  form.reset();
});

// Carregar produtos ao abrir a página
window.onload = carregarProdutos;

// Função para excluir produto
const excluirProduto = async (produtoId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/produtos/${produtoId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      console.log("Produto excluído com sucesso!");
      // Limpa os produtos e carrega novamente para atualizar a lista
      produtosContainer.innerHTML = "";
      carregarProdutos();
    } else {
      console.error("Erro ao excluir produto:", response.statusText);
    }
  } catch (error) {
    console.error("Erro na requisição de exclusão:", error);
  }
};
