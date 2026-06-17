// ===========================================
// FASE 2: conectado ao back-end Flask de verdade
// Endpoints reais (confirmados no código da Pessoa A):
//   GET  /api/film/random    -> { film_id, title, synopsis, cover }
//   POST /api/votes          -> espera { film_id, title, synopsis, cover, liked }
//   GET  /api/liked-films    -> lista de { id, movie_id, title, cover, synopsis, liked }
// ===========================================

const URL_BASE = "http://localhost:5000";

let filmeAtual = null; // guarda o filme que está na tela agora, pra usar no voto
let totalVotos = 0;

// Pega os elementos do HTML
const elPoster = document.getElementById("poster");
const elTitulo = document.getElementById("titulo");
const elSinopse = document.getElementById("sinopse");
const elContador = document.getElementById("contador");
const btnSim = document.getElementById("btn-sim");
const btnNao = document.getElementById("btn-nao");
const btnFavoritos = document.getElementById("btn-favoritos");
const telaCard = document.getElementById("tela-card");
const telaFavoritos = document.getElementById("tela-favoritos");
const listaFavoritos = document.getElementById("lista-favoritos");

// Preenche o card na tela com os dados de um filme
// (usa os nomes de campo do back-end: title, synopsis, cover)
function mostrarFilme(filme) {
  elPoster.src = filme.cover || "";
  elTitulo.textContent = filme.title;
  elSinopse.textContent = filme.synopsis || "Sem sinopse disponível.";
}

// Busca um filme aleatório no back-end e mostra na tela
function carregarProximoFilme() {
  fetch(`${URL_BASE}/api/film/random`)
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar filme");
      return res.json();
    })
    .then(filme => {
      filmeAtual = filme;
      mostrarFilme(filme);
    })
    .catch(erro => {
      console.error("Não foi possível carregar o filme:", erro);
      elTitulo.textContent = "Erro ao carregar filme";
      elSinopse.textContent = "Verifique se o back-end está rodando em localhost:5000.";
    });
}

// Envia o voto (gostou ou não) e carrega o próximo filme
function votar(gostou) {
  if (!filmeAtual) return;

  fetch(`${URL_BASE}/api/votes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      film_id: filmeAtual.film_id,
      title: filmeAtual.title,
      synopsis: filmeAtual.synopsis,
      cover: filmeAtual.cover,
      liked: gostou
    })
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao salvar voto");
      return res.json();
    })
    .catch(erro => console.error("Não foi possível salvar o voto:", erro));

  totalVotos++;
  elContador.textContent = `votos ${totalVotos} / 10`;

  if (totalVotos >= 10) {
    btnFavoritos.classList.remove("oculto");
  }

  carregarProximoFilme();
}

// Busca a lista de filmes curtidos e mostra na tela final
function mostrarResumo() {
  fetch(`${URL_BASE}/api/liked-films`)
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar curtidos");
      return res.json();
    })
    .then(curtidos => renderizarResumo(curtidos))
    .catch(erro => console.error("Não foi possível carregar o resumo:", erro));
}

function renderizarResumo(curtidos) {
  listaFavoritos.innerHTML = "";

  if (curtidos.length === 0) {
    listaFavoritos.innerHTML = "<li>Você não curtiu nenhum filme ainda 😢</li>";
  }

  curtidos.forEach(filme => {
    const item = document.createElement("li");
    item.textContent = filme.title;
    listaFavoritos.appendChild(item);
  });

  telaCard.classList.add("oculto");
  telaFavoritos.classList.remove("oculto");
}

// Eventos dos botões
btnSim.addEventListener("click", () => votar(true));
btnNao.addEventListener("click", () => votar(false));
btnFavoritos.addEventListener("click", mostrarResumo);

// ===========================================
// Poltronas decorativas (puramente visual, dá o clima de "sala cheia")
// Cada fileira fica um pouco mais larga e mais opaca conforme se aproxima da frente
// ===========================================
function gerarPoltronas() {
  const auditorio = document.getElementById("auditorio");
  const fileiras = [
    { qtd: 22, tamanho: 22, opacidade: 1 },
    { qtd: 20, tamanho: 19, opacidade: 0.9 },
    { qtd: 18, tamanho: 16, opacidade: 0.8 },
    { qtd: 16, tamanho: 13, opacidade: 0.7 },
    { qtd: 14, tamanho: 11, opacidade: 0.6 },
    { qtd: 12, tamanho: 9, opacidade: 0.5 }
  ];

  fileiras.forEach(fileira => {
    const linha = document.createElement("div");
    linha.className = "fileira";
    linha.style.opacity = fileira.opacidade;

    for (let i = 0; i < fileira.qtd; i++) {
      const poltrona = document.createElement("div");
      poltrona.className = "poltrona";
      poltrona.style.width = `${fileira.tamanho}px`;
      poltrona.style.height = `${fileira.tamanho * 1.15}px`;
      linha.appendChild(poltrona);
    }

    auditorio.appendChild(linha);
  });
}

// Ao carregar a página, já mostra o primeiro filme e desenha as poltronas
carregarProximoFilme();
gerarPoltronas();
