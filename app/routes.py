from flask import Blueprint, jsonify, request, render_template
from app import db
from app.models import Vote
from app.tmdb_service import search_rand_film, search_recommendation

main = Blueprint('main', __name__)

@main.route("/")
def index():
    return render_template("index.html")

# Endpoint que retorna um filme aleatório do TMDB
@main.route("/api/film/random", methods=['GET'])
def random_film():
    film = search_rand_film()

    if not film:
        return jsonify({'error': 'Filme não encontrado'}), 500

    return jsonify(film), 200

# Endpoint que salva o voto do usuário no banco
@main.route("/api/votes", methods=['POST'])
def save_vote():
    data = request.get_json()

    # Cria o objeto Vote com os dados recebidos do front
    vote = Vote(
        movie_id=data["film_id"],
        title=data["title"],
        synopsis=data.get("synopsis"),
        cover=data.get("cover"),
        liked=data["liked"],
        genre_ids=str(data.get("genre_ids", []))
    )

    # Salva no banco e confirma a transação
    db.session.add(vote)
    db.session.commit()

    return jsonify(vote.to_dict()), 201

# Endpoint que retorna todos os filmes curtidos
@main.route("/api/liked-films", methods=['GET'])
def liked_films():
    liked = Vote.query.filter_by(liked=True).all()
    return jsonify([v.to_dict() for v in liked]), 200

@main.route("/api/recommendations", methods=['GET'])
def recommendations():
    liked=Vote.query.filter_by(liked=True).all()

    if not liked:
        return random_film()

    movie_ids= [v.movie_id for v in liked]
    film = search_recommendation(movie_ids)

    if not film:
        return jsonify({'error': 'Nenhuma recomendacao encontrada'}), 500

    return jsonify(film), 200
