import React from 'react';

var spotifyStyle = require('../styles/spotify.css');

class Spotify extends React.Component {
  constructor(props) {
    super(props);
    var {client, user} = this.props;
    this.state = {
      user: user,
      client: client,
      spotifyPlayer: new SpotifyPlayer()
    }
  }

  componentDidMount() {
    var mainContainer = document.getElementById('js-main-container')
    var loginContainer = document.getElementById('js-login-container')
    var loginButton = document.getElementById('js-btn-login')
    var background = document.getElementById('js-background')

    //var spotifyPlayer = new SpotifyPlayer();

    this.state.spotifyPlayer.on('update', response => {
      mainContainer.innerHTML = template(response);
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
    
    spotifyPlayer.init();
  }

  template(data) {
    return (
      <div style={spotifyStyle}>
        <div className="main-wrapper">
          <div className="now-playing__img">
            <img src="${data.item.album.images[0].url}" />
          </div>
          <div className="now-playing__side">
            <div className="now-playing__name">${data.item.name}</div>
            <div className="now-playing__artist">${data.item.artists[0].name}</div>
            <div className="now-playing__status">${data.is_playing ? 'Playing' : 'Paused'}</div>
            <div className="progress">
              <div className="progress__bar" style="width:${data.progress_ms * 100 / data.item.duration_ms}%"></div>
            </div>
          </div>
        </div>
        <div className="background" style="background-image:url(${data.item.album.images[0].url})"></div>
      </div>
    );
  };

  render() {
    var {viewport} = this.props;
    var {user} = this.state;

    var spotify = (
      <div className="container" style={spotifyStyle}>
        <div className="login-container hidden" id="js-login-container">
          <button className="btn btn--login" id="js-btn-login">Login with Spotify</button>
        </div>
        <div className="main-container hidden" id="js-main-container">
        </div>
      </div>
    );
    
    return spotify
  }
}

export default Spotify