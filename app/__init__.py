from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config
import os
#Instancia do banco de dados
db = SQLAlchemy()

#Funcao do app Flask
def create_app():
    #Atribuicao dos parametros no app (__name__ diz onde onde esta rodando, template = arquivos HTML e static = CSS JS
    app = Flask(__name__,
                template_folder=os.path.join(os.path.dirname(__file__), '..', 'templates'),
                static_folder=os.path.join(os.path.dirname(__file__), '..', 'static'))
    #Importacao das configuracoes da classe Config
    app.config.from_object(Config)

    #Conecta o banco de dados com a aplicacao Flask
    db.init_app(app)
    #Habilita o CORS na aplicacao (permite requisicoes do front pro back pelo navegador)
    CORS(app)

    #Importacao das endpoints e registro no app
    from app.routes import main
    app.register_blueprint(main)

    #Criacao de tabelas no banco baseado nos models definidos
    with app.app_context():
        db.drop_all()
        db.create_all()

    return app