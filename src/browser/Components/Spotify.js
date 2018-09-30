import React from 'react';

var spotifyStyle = require('./styles/spotify.css');

class Spotify extends React.Component {
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

    
    
    
    return null
  }
}

export default Spotify