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
      mainContainer: null
    }
  }

  componentDidMount() {
    var mainContainer = document.getElementById('js-main-container')
    var loginContainer = document.getElementById('js-login-container')
    var loginButton = document.getElementById('js-btn-login')
    var background = document.getElementById('js-background')

    //var spotifyPlayer = new SpotifyPlayer();

    this.state.spotifyPlayer.on('update', response => {
      console.log('updating')
      mainContainer = (
        <div style={spotifyStyle}>
        <div className="main-wrapper" style={{height:'100%'}}>
          <div className="now-playing__img">
            <img src="${response.item.album.images[0].url}" />
          </div>
          <div className="now-playing__side">
            <div className="now-playing__name">${response.item.name}</div>
            <div className="now-playing__artist">${response.item.artists[0].name}</div>
            <div className="now-playing__status">${response.is_playing ? 'Playing' : 'Paused'}</div>
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
      if (user === null) {
        loginContainer.style.display = 'block';
        mainContainer.style.display = 'none';
      } else {
        loginContainer.style.display = 'none';
        mainContainer.style.display = 'block';
      }
    });
    
    loginButton.addEventListener('click', () => {
      this.state.spotifyPlayer.login();
    });
    
    this.state.spotifyPlayer.init();
  }

  render() {
    var {viewport} = this.props;
    var {user} = this.state;

    var spotify = (
      <div className="container" style={spotifyStyle}>
        <div className="login-container hidden" id="js-login-container">
          <button className="btn btn--login" id="js-btn-login">Login with Spotify</button>
        </div>
          {{mainContainer}}
        </div>
      </div>
    );
    
    return spotify
  }
}

export default Spotify