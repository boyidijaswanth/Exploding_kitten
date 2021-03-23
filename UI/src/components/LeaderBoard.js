import React, { Component } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';

export default class LeaderBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      objKeys: [],
      userName: ''
    };
  }

  moveToLogin = () => {
    this.props.history.push('/');
  };

  componentDidMount = () => {
    axios
      .get('http://localhost:7001/leader_board')
      .then(obj =>
        this.setState({
          objKeys: Object.keys(obj.data.message),
          data: obj.data.message,
          userName: this.props.location.state.userName
            ? this.props.location.state.userName
            : 'Noobie'
        })
      )
      .catch(err => alert(err));
  };
  render() {
    return (
      <div className='container1'>
        <div className='topDiv'>
          <h4 className='alertText' style={{ display: 'inline-block' }}>
            Leader Board
          </h4>
          <button className='back' onClick={this.moveToLogin}>
            Back
          </button>
        </div>

        <div className='tableContiner'>
          <Table bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Games</th>
                <th>Points</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {this.state.objKeys.map((obj, index) => {
                const data = this.state.data[obj];
                return (
                  <tr key={index}>
                    <td>{obj}</td>
                    <td>{data.games}</td>
                    <td>{data.points}</td>
                    <td>{data.percentage}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}
