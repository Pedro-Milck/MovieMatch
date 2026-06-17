from app import db

class Vote(db.Model):
    __tablename__ = "votes"

    #Chave primária da tabela
    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    cover = db.Column(db.String(500), nullable=True)
    synopsis = db.Column(db.Text, nullable=True)
    liked = db.Column(db.Boolean, nullable=True)
    genre_ids = db.Column(db.String(200), nullable=True)

    #Funcao que converte o objeto Python num dicionario
    def to_dict(self):
        return {
            "id": self.id,
            "movie_id": self.movie_id,
            "title": self.title,
            "cover": self.cover,
            "synopsis": self.synopsis,
            "liked": self.liked,
            "genre_ids": self.genre_ids
        }

