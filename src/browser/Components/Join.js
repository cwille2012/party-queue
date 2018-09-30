import React from 'react';

var homeStyle = require('../styles/home.css');
var loginStyle = require('../styles/login.css');

class Join extends React.Component {
  constructor(props) {
    super(props);
    var {client, user} = this.props;
    this.state = {
      user: user,
      client: client,
      sessionID: '',
      sessionPass: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    var value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    var setStateBool = true;

    if (name == 'sessionID') {
      if (value.length > 8) {
        setStateBool = false;
      }
      if (value.length > 0) {
        value = value.toUpperCase();
      }
    }

    if (setStateBool === true) {
      this.setState({
        [name]: value
      });
    }
  }

  joinParty() {
    
  }

  render() {
    var {viewport} = this.props;
    var {user} = this.state;

    var join = (
      <div className='home' style={homeStyle}>
        <div className='homeholder'>
          <h2>Join Party</h2>

          <form action={null}>
            <div style={loginStyle} className='loginbuttonholder'>
              <input type='text' className='sessioninput' name='sessionID' placeholder='ID' value={this.state.sessionID} onChange={this.handleChange}></input>
            </div>
            <div style={loginStyle} className='loginbuttonholder'>
              <input type='password' className='sessioninput' name='sessionPass' placeholder='PIN' value={this.state.sessionPass} onChange={this.handleChange}></input>
            </div>
            <div style={homeStyle} className='hostbuttonholder'>
              <input type='button' className='hostbutton' onClick={() => window.location="/host"} value='Cancel' />
              <input type='button' className='hostbutton' onClick={() => window.location="/join"} value='Join Party!' />
            </div>
          </form>
          
        </div>
      </div>
    );
    
    return null
  }
}

export default Join