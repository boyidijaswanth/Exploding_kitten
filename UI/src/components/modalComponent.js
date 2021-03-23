import React, { Component } from 'react';
import Logo from '../assets/Images/exploding-kitten.png';
import axios from 'axios';

export default class ModalComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: ''
    };
  }

  changeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  submitUserName = name => {
    axios
      .put('http://localhost:7001/new_game', { user_name: name })
      .then(res => {
        const {
          user_name,
          selected_cards,
          unselected_cards
        } = res.data.message;
        console.log(this.props.history);
        this.props.history.push({
          pathname: '/dashboard',
          state: { userName: user_name }
        });
        console.log(res);
      })
      .catch(err => console.log(err));
  };

  submitName = () => {
    this.state.userName.length > 0
      ? this.submitUserName(this.state.userName)
      : this.submitUserName('Noobie');
  };

  render() {
    return (
      <div className='container'>
        <div className='cookiesContent'>
          <button className='close'>✖</button>
          <img src={Logo} alt='kitten-img' className='logo' />
          <p className='header'>Exploding Kitten</p>
          <input
            type='text'
            className='name'
            name='userName'
            placeholder='User name'
            onChange={this.changeHandler}
            value={this.state.userName}
          />
          <button className='accept' onClick={this.submitName}>
            start game!
          </button>
        </div>
      </div>
    );
  }
}
