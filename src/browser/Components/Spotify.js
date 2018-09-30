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
      spotifyUser: null,
      songDetails: null
    }

    this.state.spotifyPlayer.on('update', response => {
      console.log('updating')
      console.log(response.progress_ms)
      this.setState({
        songDetails: response
      }, function(){
        this.forceUpdate();
      });
    });



    this.state.spotifyPlayer.on('login', user => {
      console.log('logging in')
      this.setState({
        spotifyUser: user
      }, function(){
        this.forceUpdate();
      });
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

  getHistory() {
    console.log('GETTING HISTORY')
    console.log(this.state.spotifyPlayer.history())
  }
  

  render() {
    var {songDetails} = this.state;

    var songContainer = null;
    var loginContainer = null;


    if (!!this.state.spotifyUser) {
      if (!!songDetails) {
        loginContainer = null;
        console.log(songDetails)
        songContainer = (
          <div style={{height:'100%'}}>
          <div className="main-wrapper" style={{height:'100%'}}>
            <div className="now-playing__img">
              <img src={songDetails.item.album.images[0].url} />
            </div>
            <div className="now-playing__side">
              <div className="now-playing__name">{songDetails.item.name}</div>
              <div className="now-playing__artist">{songDetails.item.artists[0].name}</div>
              <div className="now-playing__status">{songDetails.is_playing ? 'Playing' : 'Paused'}</div>
              <div className="progress">
                <div className="progress__bar" style={{width: String(Number((songDetails.progress_ms * 100) / songDetails.item.duration_ms)+'%')}}></div>
              </div>
            </div>
          </div>
          <div className="background" style={{backgroundImage: String(songDetails.item.album.images[0].url)}}></div>
        </div>
        );
      } else {
        songContainer = null;
      }
    } else {
      songContainer = null;
      loginContainer = (
        <div className="login-container" id="js-login-container">
          <input type="button" className="btn btn--login" id="js-btn-login" value="Login with Spotify" />
        </div>
      );
    }

    var spotify = (
      <div className="container" style={spotifyStyle}>
        {loginContainer}
        {songContainer}
        <input type="button" className="btn btn--login" value="Get History" onClick={this.getHistory} />
      </div>
    );
    
    return spotify
  }
}

export default Spotify

