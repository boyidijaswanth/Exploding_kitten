const config = require('./settings.json')
const explodekittendb = require('./explodekittendb.js');
const explodekitten_db = new explodekittendb();
var express = require('express')
var cors = require('cors')
var app = express()
app.use(cors());
app.options('*', cors());
app.use(express.json())
const SHUFFLE = "shuffle";
const END_GAME = "end_game";
const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
class ExplodeKitten {
    constructor() {
        this.env = "dev";
        this.config = config[this.env];
        this.config = this.config.app;
        this.createServer();
    }
    createServer() {
        this.port = this.config.port
        app.put('/new_game', this.newSession);
        app.post('/draw_card', this.selectCard.bind(this));
        app.get('/leader_board', this.getLeaderboard);
        app.post('/end_game', this.endGame);
        app.post('/restart_game', this.restartGame);
        app.listen(this.port);
        console.log(`CORS-enabled web server listening on port ${this.port}`)
    }
    async newSession(request, response) {
        let data = request.body;
        let existing_session = null;
        let unselected_cards = null;
        let shuffle_deck = null;
        if (!data.user_name || (data.user_name && data.user_name.length == 0)) {
            response.status(400).send({ status: "Failed", message: "user_name name cannot be empty or NULL" });
            return;
        }
        existing_session = await explodekitten_db.get_usres_deck(data.user_name);
        if (!(existing_session[0].length)) {
            shuffle_deck = await explodekitten_db.shuffle_deck(data.user_name);
            if (!shuffle_deck) {
                response.status(400).send({ status: "Failed", message: "Error in starting the game" });
                return;
            }
            unselected_cards = 5
        }
        unselected_cards = unselected_cards || existing_session[0].length
        response.send({
            status: "Success",
            message: {
                unselected_cards: unselected_cards,
                selected_cards: existing_session[1]
            }
        });
        return;
    }
    async selectCard(request, response) {
        let data = request.body;
        let users_deck = null;
        let selected_card = null;
        let end_user_game = null;
        let unselected_cards = null;
        let selected_cards = null;
        let update_cards = null;
        let shuffle_deck = null;
        if (!data.user_name || (data.user_name && data.user_name.length == 0)) {
            response.status(400).send({ status: "Failed", message: "user_name name cannot be empty or NULL" });
            return;
        }
        users_deck = await explodekitten_db.get_usres_deck(data.user_name);
        if (!(+(data.selected_card)) || (data.selected_card > users_deck[0].length)) {
            response.status(400).send({ status: "Failed", message: "selected invalid card" });
            return;
        }
        data.selected_card = +(data.selected_card)
        data.selected_card = data.selected_card - 1;
        selected_card = users_deck[0][data.selected_card];
        users_deck[1].push(selected_card);
        selected_cards = users_deck[1]
        users_deck[0].splice(data.selected_card, 1);
        unselected_cards = users_deck[0].length;
        if (this.config.action[selected_card]) {
            if (this.config.action[selected_card] == SHUFFLE) {
                shuffle_deck = await explodekitten_db.shuffle_deck(data.user_name);
                if (!shuffle_deck) {
                    response.status(400).send({ status: "Failed", message: "Error in drawing card" });
                    return;
                }
                unselected_cards = this.config.deck_size;
                selected_cards = [];
            } else if (this.config.action[selected_card] == END_GAME) {
                if (countOccurrences(selected_cards, this.config.bomb_card) > countOccurrences(selected_cards, this.config.safe_card)) {
                    end_user_game = await explodekitten_db.end_game(data.user_name, false);
                    if (!end_user_game) {
                        response.status(400).send({ status: "Failed", message: "Error in drawing card" });
                        return;
                    }
                    unselected_cards = 0;
                    selected_cards = []
                } else {
                    update_cards = await explodekitten_db.select_card(data.user_name, users_deck[0], users_deck[1]);
                    if (!update_cards) {
                        response.status(400).send({ status: "Failed", message: "Error in drawing card" });
                        return;
                    }
                }
            }
        } else if (selected_cards.length == this.config.deck_size) {
            end_user_game = await explodekitten_db.end_game(data.user_name, true);
            if (!end_user_game) {
                response.status(400).send({ status: "Failed", message: "Error in starting the game" });
                return;
            }
            unselected_cards = 0;
        } else {
            update_cards = await explodekitten_db.select_card(data.user_name, users_deck[0], users_deck[1]);
            if (!update_cards) {
                response.status(400).send({ status: "Failed", message: "Error in drawing card" });
                return;
            }
        }
        response.send({
            status: "Success",
            message: {
                card: selected_card,
                unselected_cards: unselected_cards,
                selected_cards: selected_cards
            }
        });
        return;
    }
    async getLeaderboard(request, response) {
        let user_details = {};
        let points_details = null
        let leader_board_details = await explodekitten_db.leader_board();
        if (!leader_board_details) {
            response.status(400).send({ status: "Failed", message: "Error in fetching leader board" });
            return;
        }
        for (var user in leader_board_details) {
            points_details = JSON.parse(leader_board_details[user]);
            user_details.games = points_details[0];
            user_details.points = points_details[1];
            user_details.percentage = ((points_details[1] / points_details[0]) * 100).toFixed(2);
            leader_board_details[user] = user_details;
            user_details = {}
        }
        response.send({
            status: "Success",
            message: leader_board_details
        });
        return;
    }
    async endGame(request, response) {
        let data = request.body;
        let end_user_game = null;
        if (!data.user_name || (data.user_name && data.user_name.length == 0)) {
            response.status(400).send({ status: "Failed", message: "user_name name cannot be empty or NULL" });
            return;
        }
        end_user_game = await explodekitten_db.end_game(data.user_name, false);
        if (!end_user_game) {
            response.status(400).send({ status: "Failed", message: "Error in closing the game" });
            return;
        }
        response.send({
            status: "Success",
            message: {
                unselected_cards: 0,
                selected_cards: []
            }
        });
        return;
    }
    async restartGame(request, response) {
        let data = request.body;
        let end_user_game = null;
        let shuffle_deck = null;
        if (!data.user_name || (data.user_name && data.user_name.length == 0)) {
            response.status(400).send({ status: "Failed", message: "user_name name cannot be empty or NULL" });
            return;
        }
        end_user_game = await explodekitten_db.end_game(data.user_name, false);
        if (!end_user_game) {
            response.status(400).send({ status: "Failed", message: "Error in restarting the game" });
            return;
        }
        shuffle_deck = await explodekitten_db.shuffle_deck(data.user_name);
        if (!shuffle_deck) {
            response.status(400).send({ status: "Failed", message: "Error in starting the game" });
            return;
        }
        response.send({
            status: "Success",
            message: {
                unselected_cards: 5,
                selected_cards: []
            }
        });
        return;
    }
}
let server = new ExplodeKitten();
module.exports = app;