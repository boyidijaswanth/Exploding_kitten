import React, { Component } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Logo from '../assets/Images/exploding-kitten.png';
import axios from 'axios';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      availableCards: 5,
      usedCards: 1,
      lastSelectedCard: '',
      selectedCards: [],
      numOfdifuseCards: 0
    };
  }

  drawCard = cardNumber => {
    axios
      .post('http://localhost:7001/draw_card', {
        user_name: this.props.location.state.userName,
        selected_card: cardNumber
      })
      .then(obj => {
        // {
        // "status": "Success",
        // "message": {
        //     "card": "Shuffle card",
        //     "unselected_cards": 5,
        //     "selected_cards": []
        // }
        console.log(obj);
        const { card, selected_cards, unselected_cards } = obj.data.message;

        // If bomb card then check for num of difuse cards
        // If difuse cards > no of bomb cards then prompt user to difuse else end the game
        // If selected one is Shuffle card the start the game again

        if (card === 'Exploding kitten card') {
          if (
            this.countOccurrences(selected_cards, 'Defuse card') >=
            this.countOccurrences(selected_cards, 'Exploding kitten card')
          ) {
            alert(`Bomb card is defused`);
          } else {
            if (unselected_cards === 0) {
              alert(`Game Over`);
            }
          }
        }

        this.setState(
          {
            lastSelectedCard: card,
            selectedCards: selected_cards,
            availableCards: unselected_cards
          },
          () => alert(`Selected card ${this.state.lastSelectedCard}`)
        );
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
          <Card className='bg-dark text-white used-card'>
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
        <Row className='div'>
          <Row>
            <h4> &nbsp;&nbsp;Available cards</h4>
          </Row>
          <Row className='row'>{availableCards}</Row>
        </Row>
        <br />
        <Row className='div'>
          <Row className='row'>
            <h3>&nbsp;&nbsp;Used Cards</h3>
          </Row>
          <Row className='row'>{usedCards}</Row>
        </Row>
      </Container>
    );
  }
}
