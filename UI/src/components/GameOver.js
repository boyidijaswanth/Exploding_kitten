import React, { Component } from 'react';
import { Modal, Button, ModalBody } from 'react-bootstrap';

export default class GameOver extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: true
    };
  }

  handleClose = () => {
    this.setState({
      show: false
    });
  };

  restart = () => {
    this.handleClose();
    this.props.restartGame();
  };

  leaderBoard = () => {
    this.props.navigateToLeaderBoard();
  };

  render() {
    return (
      <Modal
        show={this.state.show}
        onHide={this.handleClose}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{this.props.result}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>{`Your Score  - ${this.props.score}`}</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={this.restart}>
            Restart
          </Button>
          <Button variant='primary' onClick={this.leaderBoard}>
            Leader board
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
