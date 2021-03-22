const config = require('./settings.json');
const { promisify } = require("util");
let redis = require('redis');
var fs = require('fs');
const assert = require('assert');
class ExplodeKittendb {
    constructor() {
        this.env = "dev";
        this.config = config;
        this.config = this.config[this.env];
        this.config = this.config.database
        this.db_client = null;
        this.get_db_client();
    }
    async get_db_client() {
        if (!this.db_client) {
            this.db_client = redis.createClient({
                port: this.config.port,
                password: this.config.password,
                host: this.config.host
            });
            this.db_client.on("error", function(error) {
                console.log(error);
            })
            this.promisifyFunctions(this.db_client);
        }
        return this.db_client;
    }
    async promisifyFunctions(client) {
        this.setAsync = promisify(client.hmset).bind(client);
        this.getAsync = promisify(client.hgetall).bind(client);
        this.getoneAsync = promisify(client.hget).bind(client);
        this.delAsync = promisify(client.hdel).bind(client);
    }
    async get_usres_deck(user_name) {
        let users_deck = [];
        let selected_deck = null;
        let unselected_deck = await this.getoneAsync(this.config.unselected_deck_db, user_name);
        if (unselected_deck instanceof Error) {
            fs.appendFile('./redis_error.logs', `\n\n ${user_name}  get_usres_deck unselected_deck ========> ${JSON.stringify(unselected_deck)}`, () => {});
            return [
                [],
                []
            ];
        }
        if (!unselected_deck) return [
            [],
            []
        ];
        else {
            users_deck.push(JSON.parse(unselected_deck));
            selected_deck = await this.getoneAsync(this.config.selected_deck_db, user_name);
            if (selected_deck instanceof Error) {
                fs.appendFile('./redis_error.logs', `\n\n ${user_name}  get_usres_deck selected_deck ========> ${JSON.stringify(selected_deck)}`, () => {});
                return [
                    [],
                    []
                ];
            }
            if (!selected_deck) users_deck.push([])
            else users_deck.push(JSON.parse(selected_deck))
        }
        return users_deck;
    }
    async shuffle_deck(user_name) {
        let deck = Array.from({ length: this.config.deck_size }, () => this.config.cards[Math.floor(Math.random() * this.config.cards.length)]);
        let unselected_deck = await this.setAsync(this.config.unselected_deck_db, user_name, JSON.stringify(deck))
        if (unselected_deck instanceof Error) {
            fs.appendFile('./redis_error.logs', `\n\n ${user_name} shuffle_deck unselected_deck ========> ${JSON.stringify(unselected_deck)}`, () => {});
            return false;
        }
        let selected_deck = await this.setAsync(this.config.selected_deck_db, user_name, JSON.stringify([]))
        if (selected_deck instanceof Error) {
            fs.appendFile('./redis_error.logs', `\n\n ${user_name} shuffle_deck  selected_deck========> ${JSON.stringify(selected_deck)}`, () => {});
            return false;
        }
        return true;
    }
    async end_game(user_name, game_won) {
        let delete_selected_deck = null;
        let update_user_game = null
        let delete_unselected_deck = await this.delAsync(this.config.unselected_deck_db, user_name);
        if (delete_unselected_deck instanceof Error) {
            fs.appendFile('./redis_error.logs', `\n\n ${user_name} end_game unselected_deck ========> ${JSON.stringify(delete_unselected_deck)}`, () => {});
            return false;
        }
        delete_selected_deck = await this.delAsync(this.config.selected_deck_db, user_name);
        if (delete_selected_deck instanceof Error) {
            fs.appendFile('./redis_error.logs', `\n\n ${user_name} end_game selected_deck ========> ${JSON.stringify(delete_selected_deck)}`, () => {});
            return false;
        }
        update_user_game = await this.update_game(user_name, game_won);
        return update_user_game;
    }
    async update_game(user_name, game_won) {
        let user_data = [0, 0]
        let user_games = await this.getoneAsync(this.config.leader_board_db, user_name);
        if (user_games instanceof Error) {
            fs.appendFile('./redis_error.logs', `\n\n ${user_name}  update_game user_games ========> ${JSON.stringify(user_games)}`, () => {});
            return false
        }
        if (!user_games) {
            user_games = user_data
        } else user_games = JSON.parse(user_games)
        if (game_won) user_games[1] += 1;
        user_games[0] += 1
        let update_leader_board = await this.setAsync(this.config.leader_board_db, user_name, JSON.stringify(user_games))
        if (update_leader_board instanceof Error) {
            fs.appendFile('./redis_error.logs', `\n\n ${user_name} update_game update_leader_board ========> ${JSON.stringify(update_leader_board)}`, () => {});
            return false;
        }
        return true;
    }
    async select_card(user_name, unselected_cards, selected_cards) {
        let unselected_deck = await this.setAsync(this.config.unselected_deck_db, user_name, JSON.stringify(unselected_cards))
        if (unselected_deck instanceof Error) {
            fs.appendFile('./redis_error.logs', `\n\n ${user_name} select_card unselected_deck ========> ${JSON.stringify(unselected_deck)}`, () => {});
            return false;
        }
        let selected_deck = await this.setAsync(this.config.selected_deck_db, user_name, JSON.stringify(selected_cards))
        if (selected_deck instanceof Error) {
            fs.appendFile('./redis_error.logs', `\n\n ${user_name} select_card  selected_deck========> ${JSON.stringify(selected_deck)}`, () => {});
            return false;
        }
        return true;
    }
    async leader_board() {
        let points_details = await this.getAsync(this.config.leader_board_db);
        if (points_details instanceof Error) {
            fs.appendFile('./redis_error.logs', `\n\n points_details  leader_board========> ${JSON.stringify(points_details)}`, () => {});
            return false;
        }
        if (!points_details) {}
        return points_details;
    }
}
module.exports = ExplodeKittendb;