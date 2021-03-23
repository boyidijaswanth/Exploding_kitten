import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

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

  leaderBoard = () => {};

  render() {
    return (
      <Modal
        show={this.state.show}
        onHide={this.handleClose}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Body closeButton>
          <Modal.Title>{this.props.result}</Modal.Title>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={this.restart}>
            Restart
          </Button>
          <Button variant='primary' onClick={this.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
