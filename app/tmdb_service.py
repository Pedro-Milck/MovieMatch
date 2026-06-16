import requests
import random
from config import Config

def search_rand_film():
    url = f"{Config.TMDB_BASE_URL}/discover/movie"
    headers = {
        "Authorization": f"Bearer {Config.TMDB_ACCESS_TOKEN}",
        "accept": "application/json"
    }
    params = {
        "language": "pt-BR",
        "sort_by": "vote_average.desc",
        "vote_count.gte": 1000,
        "vote_average.gte": 7.0,
        "page": random.randint(1, 5),
    }

    response = requests.get(url, headers=headers, params=params)
    print("STATUS:", response.status_code)
    print("RESPOSTA:", response.text)

    data = response.json()
    films = data.get("results", [])

    if not films:
        return None

    film = random.choice(films)

    return {
        "film_id": film["id"],
        "title": film["title"],
        "synopsis": film.get("overview", "Sem sinopse disponível."),
        "cover": Config.TMDB_IMAGE_URL + film["poster_path"] if film.get("poster_path") else None
    }