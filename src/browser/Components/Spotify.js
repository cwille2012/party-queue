import React from 'react';

import SpotifyPlayer from './spotify-player.js';

var spotifyStyle = require('../styles/spotify.css');
//var SpotifyPlayer = require('./spotify-player.js')

class Spotify extends React.Component {
  constructor(props) {
    super(props);
    var {client, user} = this.props;
    this.state = {
      user: user,
      client: client,
      spotifyPlayer: new SpotifyPlayer(),
      mainContainer: null,
      loginContainer: null,
      spotifyUser: null
    }


    this.state.spotifyPlayer.on('update', response => {
      console.log('updating')
      console.log(response.progress_ms)
      this.state.mainContainer = (
        <div style={{height:'100%'}}>
        <div className="main-wrapper" style={{height:'100%'}}>
          <div className="now-playing__img">
            <img src="${response.item.album.images[0].url}" />
          </div>
          <div className="now-playing__side">
            <div className="now-playing__name">{response.item.name}</div>
            <div className="now-playing__artist">{response.item.artists[0].name}</div>
            <div className="now-playing__status">{response.is_playing ? 'Playing' : 'Paused'}</div>
            <div className="progress">
              <div className="progress__bar" style="width:${response.progress_ms * 100 / response.item.duration_ms}%"></div>
            </div>
          </div>
        </div>
        <div className="background" style="background-image:url(${response.item.album.images[0].url})"></div>
      </div>
      )
    });



    this.state.spotifyPlayer.on('login', user => {
      console.log('logging in')
      this.state.spotifyUser = user;
      if (user === null) {
        this.state.loginContainer = (
          <div className="login-container" id="js-login-container">
            <input type="button" className="btn btn--login" id="js-btn-login" value="Login with Spotify" />
          </div>
        );
        this.state.mainContainer = null;
      } else {
        this.state.loginContainer = null;
      }
    });


  }

  componentDidMount() {
    if (!this.state.spotifyUser){
      if (!!document.getElementById('js-btn-login'))
      document.getElementById('js-btn-login').addEventListener('click', () => {
        this.state.spotifyPlayer.login();
      });
    }
    
    this.state.spotifyPlayer.init();
  }
  

  render() {
    var {viewport} = this.props;
    var {user} = this.state;

    var spotify = (
      <div className="container" style={spotifyStyle}>
        {this.state.loginContainer}
        {this.state.mainContainer}
       </div>
    );
    
    return spotify
  }
}

export default Spotify

