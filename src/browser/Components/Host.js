import React from 'react';

var hostStyle = require('../styles/host.css');

class Host extends React.Component {
  constructor(props) {
    super(props);
    var {client, user} = this.props;
    this.state = {
      user: user,
      client: client
    }
  }

  render() {
    var {viewport} = this.props;
    var {user} = this.state;

    var host = (
      <div className='host' style={hostStyle}>
        <div className='hostholder'>
          <h2 style={{marginBottom: '45px'}}>Start Spotify Session</h2>

          <div className='hostbuttonholder'>
            <input type='button' className='hostbutton' onClick={() => window.location="/auth/spotify"} value='Connect Spotify' />
          </div>

          <div className='hostbuttonholder'>
            <input type='button' className='hostbutton' onClick={() => window.location="/"} value='Back' />
          </div>
        </div>
      </div>
    );
    
    return host
  }
}

export default Host