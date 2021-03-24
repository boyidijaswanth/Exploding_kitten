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
    this.props.history.push({
      pathname: '/dashboard',
      state: { userName: name }
    });
  };

  submitName = e => {
    e.preventDefault();
    this.state.userName.length > 0
      ? this.submitUserName(this.state.userName)
      : this.submitUserName('Noobie');
  };

  render() {
    return (
      <div className='container'>
        <div className='cookiesContent'>
          <button className='close'></button>
          <img src={Logo} alt='kitten-img' className='logo' />
          <p className='header'>Exploding Kitten</p>
          <form>
            <input
              type='text'
              className='name'
              name='userName'
              placeholder='User name'
              onChange={this.changeHandler}
              value={this.state.userName}
            />
            <button className='accept' type='submit' onClick={this.submitName}>
              start game!
            </button>
          </form>
        </div>
      </div>
    );
  }
}
