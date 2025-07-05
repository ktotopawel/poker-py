from game_logic.game_controller import PokerGame
from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

games = {}
game_id = 0


@app.route("/api/game", methods=["POST"])
def initGame():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    data = request.get_json()
    username = data.get("username")
    custom_chips = data.get("custom_chips") or 10000
    cpu_num = data.get("cpu_num") or 3
    big_blind = data.get("big_blind") or 50

    if not username:
        return jsonify({"error": "you must provide a username"}), 400

    new_game = PokerGame(username, custom_chips, cpu_num, big_blind)

    global game_id, games
    game_id += 1

    games = {**games, game_id: new_game}

    game_state = new_game.get_game_state()

    return (
        jsonify(
            {
                "success": True,
                "game_id": game_id,
                "player_name": username,
                "game_state": game_state,
            }
        ),
        200,
    )


@app.route("/api/game/<game_id>", methods=["GET"])
def get_game_state(game_id):
    try:
        game_id = int(game_id)
    except ValueError:
        return jsonify({"error": "Invalid game_id"}), 400
    game = games.get(game_id)
    if not game:
        return jsonify({"error": "Game not found"}), 404

    game_state = game.get_game_state()

    return jsonify({"game_state": game_state})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
