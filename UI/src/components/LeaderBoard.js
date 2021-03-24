import React, { Component } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';

export default class LeaderBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      userName: ''
    };
  }

  moveToLogin = () => {
    this.props.history.push('/');
  };

  componentDidMount = () => {
    axios
      .get('http://localhost:7001/leader_board')
      .then(obj =>{
        const user_name_response = Object.keys(obj.data.message);
        let leader_board_response = Object.values(obj.data.message);
        leader_board_response.map((record,index)=>{
          record.user_name= user_name_response[index]
        })
        leader_board_response.sort((a,b) => b.percentage - a.percentage);
        this.setState({
          data: leader_board_response,
          userName: this.props.location.state.userName
            ? this.props.location.state.userName
            : 'Noobie'
        })
      })
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
              {
                this.state.data.map((data, index) => {
                return (
                  <tr key={index}>
                    <td>{data.user_name}</td>
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
