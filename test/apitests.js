process.env.NODE_ENV = 'test';

let server = require('../explodekitten.js');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);
/*
 * Test the /PUT route
 */
describe('/PUT new_game', () => {
    it('it should not start new game without user_name field', (done) => {
        let new_game_data = {}
        chai.request(server)
            .put('/new_game')
            .send(new_game_data)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').eql('user_name name cannot be empty or NULL');
                res.body.should.have.property('status');
                res.body.should.have.property('status').eql('Failed');
                done();
            });
    });
    it('it should not start new_game with user_name field empty', (done) => {
        let new_game_data = {
            user_name: ""
        }
        chai.request(server)
            .put('/new_game')
            .send(new_game_data)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').eql('user_name name cannot be empty or NULL');
                res.body.should.have.property('status');
                res.body.should.have.property('status').eql('Failed');
                done();
            });
    });
    it('it should return a successfull response when a user_name is passed', (done) => {
        let new_game_data = {
            user_name: "Emitrr"
        }
        chai.request(server)
            .put('/new_game')
            .send(new_game_data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').to.be.an('object');
                res.body.should.have.property('status');
                res.body.should.have.property('status').eql('Success');
                res.body.message.should.have.property('unselected_cards');
                res.body.message.should.have.property('selected_cards');
                res.body.message.should.have.property('user_name');
                res.body.message.should.have.property('user_name').eql(new_game_data.user_name);
                done();
            });
    });
});

/*
 * Test the /POST route
 */
describe('/POST draw_card', () => {
    it('it should not allow user to draw a card without user_name field', (done) => {
        let draw_card_data = {}
        chai.request(server)
            .post('/draw_card')
            .send(draw_card_data)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').eql('user_name name cannot be empty or NULL');
                res.body.should.have.property('status');
                res.body.should.have.property('status').eql('Failed');
                done();
            });
    });
    it('it should not allow user to draw a card with user_name field empty', (done) => {
        let draw_card_data = {
            user_name: ""
        }
        chai.request(server)
            .post('/draw_card')
            .send(draw_card_data)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').eql('user_name name cannot be empty or NULL');
                res.body.should.have.property('status');
                res.body.should.have.property('status').eql('Failed');
                done();
            });
    });
    it('it should not allow user to draw a card without selected_card field', (done) => {
        let draw_card_data = {
            user_name: "Emitrr"
        }
        chai.request(server)
            .post('/draw_card')
            .send(draw_card_data)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').eql('selected invalid card');
                res.body.should.have.property('status');
                res.body.should.have.property('status').eql('Failed');
                done();
            });
    });
    it('it should not allow user to draw a card with selected_card field as string', (done) => {
        let draw_card_data = {
            user_name: "Emitrr",
            selected_card: "first"
        }
        chai.request(server)
            .post('/draw_card')
            .send(draw_card_data)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').eql('selected invalid card');
                res.body.should.have.property('status');
                res.body.should.have.property('status').eql('Failed');
                done();
            });
    });
    it('it should not allow user to draw a card with selected_card field as invalid number', (done) => {
        let draw_card_data = {
            user_name: "Emitrr",
            selected_card: 0
        }
        chai.request(server)
            .post('/draw_card')
            .send(draw_card_data)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').eql('selected invalid card');
                res.body.should.have.property('status');
                res.body.should.have.property('status').eql('Failed');
                done();
            });
    });
    it('it should return a successfull response when a user_name and valid selected_card are passed', (done) => {
        let draw_card_data = {
            user_name: "Emitrr",
            selected_card: 1
        }
        chai.request(server)
            .post('/draw_card')
            .send(draw_card_data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').to.be.an('object');
                res.body.should.have.property('status');
                res.body.should.have.property('status').eql('Success');
                res.body.message.should.have.property('card');
                res.body.message.should.have.property('unselected_cards');
                res.body.message.should.have.property('selected_cards');
                done();
            });
    });
});

/*
 * Test the /GET route
 */
describe('/GET leader_board', () => {
    it('it should return a successfull response with realtime leader board', (done) => {
        chai.request(server)
            .get('/leader_board')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').to.be.an('object');
                res.body.should.have.property('status');
                res.body.should.have.property('status').eql('Success');
                done();
            });
    });
});

/*
 * Test the /POST route
 */
describe('/POST restart_game', () => {
    it('it should not restart the game without user_name field', (done) => {
        let restart_game_data = {}
        chai.request(server)
            .post('/restart_game')
            .send(restart_game_data)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').eql('user_name name cannot be empty or NULL');
                res.body.should.have.property('status');
                res.body.should.have.property('status').eql('Failed');
                done();
            });
    });
    it('it should not restart the game with user_name field empty', (done) => {
        let restart_game_data = {
            user_name: ""
        }
        chai.request(server)
            .post('/restart_game')
            .send(restart_game_data)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').eql('user_name name cannot be empty or NULL');
                res.body.should.have.property('status');
                res.body.should.have.property('status').eql('Failed');
                done();
            });
    });
    it('it should return a successfull response when a user_name is passed and restart the game', (done) => {
        let restart_game_data = {
            user_name: "Emitrr"
        }
        chai.request(server)
            .post('/restart_game')
            .send(restart_game_data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').to.be.an('object');
                res.body.should.have.property('status');
                res.body.should.have.property('status').eql('Success');
                res.body.message.should.have.property('unselected_cards');
                res.body.message.should.have.property('unselected_cards').eql(5);
                res.body.message.should.have.property('selected_cards');
                res.body.message.should.have.property('selected_cards').eql([]);
                done();
            });
    });
});

/*
 * Test the /POST route
 */
describe('/POST end_game', () => {
    it('it should not end_game the game without user_name field', (done) => {
        let end_game_data = {}
        chai.request(server)
            .post('/end_game')
            .send(end_game_data)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').eql('user_name name cannot be empty or NULL');
                res.body.should.have.property('status');
                res.body.should.have.property('status').eql('Failed');
                done();
            });
    });
    it('it should not restart the game with user_name field empty', (done) => {
        let end_game_data = {
            user_name: ""
        }
        chai.request(server)
            .post('/end_game')
            .send(end_game_data)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').eql('user_name name cannot be empty or NULL');
                res.body.should.have.property('status');
                res.body.should.have.property('status').eql('Failed');
                done();
            });
    });
    it('it should return a successfull response when a user_name is passed and end the game', (done) => {
        let end_game_data = {
            user_name: "Emitrr"
        }
        chai.request(server)
            .post('/end_game')
            .send(end_game_data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').to.be.an('object');
                res.body.should.have.property('status');
                res.body.should.have.property('status').eql('Success');
                res.body.message.should.have.property('unselected_cards');
                res.body.message.should.have.property('unselected_cards').eql(0);
                res.body.message.should.have.property('selected_cards');
                res.body.message.should.have.property('selected_cards').eql([]);
                done();
            });
    });
});