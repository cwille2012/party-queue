import React from 'react';

var homeStyle = require('../styles/home.css');

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var {viewport} = this.props;

    var home = (
      <div className='home' style={homeStyle}>
        <div className='homeholder'>
          <h2>PartyQueue</h2>

          <div className='hostbuttonholder'>
            <input type='button' className='hostbutton' onClick={() => window.location="/host"} value='Start a Party' />
            <input type='button' className='hostbutton' onClick={() => window.location="/join"} value='Join a Party' />
          </div>
          
        </div>
      </div>
    );
    
    return home
  }
}

export default Home