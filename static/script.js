const URL_BASE = "http://localhost:5000";

const GENEROS = {
  28: "Ação", 12: "Aventura", 16: "Animação", 35: "Comédia",
  80: "Crime", 99: "Documentário", 18: "Drama", 10751: "Família",
  14: "Fantasia", 36: "História", 27: "Terror", 10402: "Música",
  9648: "Mistério", 10749: "Romance", 878: "Ficção Científica",
  53: "Thriller", 10752: "Guerra", 37: "Faroeste"
};

let filmeAtual = null;
let totalVotos = 0;
const LIMITE = 10;

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
const btnVoltar = document.getElementById("btn-voltar");

function mostrarFilme(filme) {
  elPoster.src = filme.cover || "";
  elTitulo.textContent = filme.title;
  elSinopse.textContent = filme.synopsis || "Sem sinopse disponível.";
}

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

function votar(gostou) {
  if (!filmeAtual || totalVotos >= LIMITE) return;

  fetch(`${URL_BASE}/api/votes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      film_id: filmeAtual.film_id,
      title: filmeAtual.title,
      synopsis: filmeAtual.synopsis,
      cover: filmeAtual.cover,
      liked: gostou,
      genre_ids: filmeAtual.genre_ids || []
    })
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao salvar voto");
      return res.json();
    })
    .then(() => {
      totalVotos++;
      elContador.textContent = `votos ${totalVotos} / ${LIMITE}`;

      if (totalVotos >= LIMITE) {
        btnSim.disabled = true;
        btnNao.disabled = true;
        btnFavoritos.classList.remove("oculto");
      } else {
        carregarProximoFilme();
      }
    })
    .catch(erro => console.error("Não foi possível salvar o voto:", erro));
}
function mostrarResumo() {
  fetch(`${URL_BASE}/api/liked-films`)
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar curtidos");
      return res.json();
    })
    .then(curtidos => renderizarResumo(curtidos))
    .catch(erro => console.error("Não foi possível carregar o resumo:", erro));
}

function calcularGeneroFavorito(curtidos) {
  const contagem = {};

  curtidos.forEach(filme => {
    if (!filme.genre_ids) return;
    // genre_ids vem como string do banco, ex: "[28, 12]"
    const ids = JSON.parse(filme.genre_ids.replace(/'/g, '"'));
    ids.forEach(id => {
      const nome = GENEROS[id] || "Outro";
      contagem[nome] = (contagem[nome] || 0) + 1;
    });
  });

  if (Object.keys(contagem).length === 0) return null;

  return Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3); // top 3 gêneros
}

function renderizarResumo(curtidos) {
  listaFavoritos.innerHTML = "";

  // Gêneros favoritos
  const generosFavoritos = calcularGeneroFavorito(curtidos);
  if (generosFavoritos) {
    const titulo = document.createElement("h3");
    titulo.textContent = "🎬 Gêneros favoritos:";
    listaFavoritos.appendChild(titulo);

    generosFavoritos.forEach(([genero, votos]) => {
      const item = document.createElement("p");
      item.textContent = `${genero}: ${votos} curtida(s)`;
      listaFavoritos.appendChild(item);
    });
  }

  // Filmes curtidos
  const tituloFilmes = document.createElement("h3");
  listaFavoritos.appendChild(tituloFilmes);

  if (curtidos.length === 0) {
    listaFavoritos.innerHTML += "<p>Você não curtiu nenhum filme ainda</p>";
  } else {
    curtidos.forEach(filme => {
      const item = document.createElement("li");
      item.textContent = filme.title;
      listaFavoritos.appendChild(item);
    });
  }

  // Recomendação
  fetch(`${URL_BASE}/api/recommendations`)
    .then(res => res.json())
    .then(rec => {
      const tituloRec = document.createElement("h3");
      tituloRec.textContent = "⭐ Recomendação pra você";
      listaFavoritos.appendChild(tituloRec);

      const item = document.createElement("p");
      item.textContent = `${rec.title} — ${rec.synopsis}`;
      listaFavoritos.appendChild(item);
    })
    .catch(() => {});

  telaCard.classList.add("oculto");
  telaFavoritos.classList.remove("oculto");
}

function voltarParaVotacao() {
  totalVotos = 0;
  elContador.textContent = `votos ${totalVotos} / ${LIMITE}`;

  btnSim.disabled = false;
  btnNao.disabled = false;
  btnFavoritos.classList.add("oculto");

  telaFavoritos.classList.add("oculto");
  telaCard.classList.remove("oculto");

  carregarProximoFilme();
}

btnSim.addEventListener("click", () => votar(true));
btnNao.addEventListener("click", () => votar(false));
btnFavoritos.addEventListener("click", mostrarResumo);
btnVoltar.addEventListener("click", voltarParaVotacao);

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

carregarProximoFilme();
gerarPoltronas();
