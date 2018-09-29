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

          <center><a href='/host'>Create Queue</a></center>
          
        </div>
      </div>
    );
    
    return home
  }
}

export default Home