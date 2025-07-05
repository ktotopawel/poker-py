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

@app.route('api/game/<int:game_id>/start-round', methods=['GET'])
def start_round(game_id):
    game = games.get(game_id)
    if not game:
        return jsonify({"error": "Game not found"}), 404
    
    result = game.start_round()
    return jsonify(
        result
    )
    
@app.route('/api/game/<int:game_id>/action', methods=['POST'])
def player_action(game_id):
    game = games.get(game_id)
    
    if not game:
        return jsonify({"error": "Game not found"}), 404
    
    data = request.get_json()
    action_type = data.get('action')
    amount = data.get('amount', 0)
    
    result = game.player_action(action_type, amount)
    return jsonify(result)
    

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

