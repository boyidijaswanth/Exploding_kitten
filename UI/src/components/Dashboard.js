import React, { Component } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import Logo from '../assets/Images/exploding-kitten.png';
import axios from 'axios';
import GameOver from './GameOver';
let userName = '';
const cardColors = {
  'Cat card': 'success',
  'Defuse card': 'primary',
  'Shuffle card': 'warning',
  'Exploding kitten card': 'danger'
};
export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      availableCards: 0,
      usedCards: 0,
      lastSelectedCard: '',
      selectedCards: [],
      gameOver: false,
      result: '',
      userName: '',
      alertText: '',
      score: ''
    };
  }

  componentDidMount = () => {
    try {
      if (this.props.location.state) {
        this.newGame(userName);
      }
    } catch (error) {
      alert(error);
      this.props.history.push('/');
    }
  };

  newGame = name => {
    axios
      .put('http://localhost:7001/new_game', { user_name: name })
      .then(res => {
        const {
          user_name,
          selected_cards,
          unselected_cards
        } = res.data.message;
        console.log('username', userName);
        this.setState({
          userName: user_name,
          selectedCards: selected_cards,
          availableCards: unselected_cards
        });
      })
      .catch(err => alert(err));
  };

  componentWillMount = () => {
    userName = this.props.location.state.userName;
  };

  navigateToLeaderBoard = () => {
    this.props.history.push({
      pathname: '/leaderboard',
      state: { userName: userName }
    });
  };

  navigateToLogin = () => {
    this.props.history.push({
      pathname: '/',
      state: { userName: '' }
    });
  };

  restartGame = () => {
    axios
      .post('http://localhost:7001/restart_game', {
        user_name: userName
      })
      .then(obj => {
        const { selected_cards, unselected_cards } = obj.data.message;
        this.setState({
          alertText: '',
          lastSelectedCard: '',
          selectedCards: selected_cards,
          availableCards: unselected_cards,
          gameOver: false,
          result: ''
        });
      });
  };

  drawCard = cardNumber => {
    axios
      .post('http://localhost:7001/draw_card', {
        user_name: this.state.userName,
        selected_card: cardNumber
      })
      .then(obj => {
        const {
          card,
          selected_cards,
          unselected_cards,
          score
        } = obj.data.message;

        // If bomb card then check for num of difuse cards
        // If difuse cards > no of bomb cards then prompt user to difuse else end the game
        // If selected one is Shuffle card the start the game again

        this.setState({
          alertText: `Selected card - ${card}`,
          lastSelectedCard: card,
          selectedCards: selected_cards,
          availableCards: unselected_cards
        });

        if (card === 'Shuffle card') {
          alert('Oh You picked shuffle card, the game will restart');
          this.setState({ alertText: '' });
        }
        console.log(selected_cards.length, unselected_cards);
        if (selected_cards.length === 5 && unselected_cards === 0) {
          this.setState({
            gameOver: true,
            result: 'Congrats !! You Won 👌👌',
            score: score ? score.points : 0
          });
        }

        if (card === 'Exploding kitten card') {
          if (
            this.countOccurrences(selected_cards, 'Defuse card') >=
            this.countOccurrences(selected_cards, 'Exploding kitten card')
          ) {
            this.setState({
              alertText: `You have Defuse card, So Bomb is Difused`
            });
          } else {
            if (unselected_cards === 0) {
              this.setState({
                gameOver: true,
                result: 'Oh no!! You lost the game 😑😶',
                score: score.points
              });
            }
          }
        }
      })
      .catch(obj => {
        console.log(obj);
      });
  };

  countOccurrences = (arr, val) =>
    arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

  render() {
    const availableCards = Array.from(
      { length: this.state.availableCards },
      () => 1
    ).map((obj, index) => (
      <Col key={index + 1} onClick={e => this.drawCard(index + 1)}>
        <Card className='bg-dark text-white card'>
          <Card.Img src={Logo} alt='Card image' className='card-img' />
        </Card>
      </Col>
    ));

    const usedCards = this.state.selectedCards.map((obj, index) => {
      return (
        <Col key={index + 1}>
          <Card className='used-card'>
            <Card.Img
              src={`${obj.split(' ')[0]}.png`}
              alt='Card image'
              className='used-card-img'
            />
          </Card>
        </Col>
      );
    });
    return (
      <Container
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <Alert
          variant={cardColors[this.state.lastSelectedCard]}
          style={{ width: '100%', textAlign: 'center' }}
        >
          <h4 className='alertText'>
            {this.state.alertText
              ? this.state.alertText
              : `Bonjour ${this.state.userName} !! Welcome back.`}
          </h4>
        </Alert>
        <div>
          <button className='btn1' onClick={this.restartGame}>
            Restart game!
          </button>
          {/* <button className='btn1' onClick={this.navigateToLeaderBoard}>
            Leader board
          </button> */}
          <button className='btn1' onClick={this.navigateToLogin}>
            Exit
          </button>
        </div>
        <Row className='div'>
          <Row style={{ marginBottom: '12px' }}>
            <h4> &nbsp;&nbsp;Available cards</h4>
          </Row>
          <Row className='row'>{availableCards}</Row>
        </Row>
        <Row className='div'>
          <Row className='row'>
            <h4>&nbsp;&nbsp;Selected cards</h4>
          </Row>
          <Row className='row'>{usedCards}</Row>
        </Row>

        {this.state.gameOver ? (
          <GameOver
            result={this.state.result}
            restartGame={this.restartGame}
            score={this.state.score}
            navigateToLeaderBoard={this.navigateToLeaderBoard}
          />
        ) : (
          ''
        )}
      </Container>
    );
  }
}
