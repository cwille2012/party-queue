import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle, faArrowAltCircleRight, faPauseCircle } from '@fortawesome/free-solid-svg-icons'

import SpotifyPlayer from './spotify-player.js';

var spotifyStyle = require('../styles/spotify.css');

class Spotify extends React.Component {
  constructor(props) {
    super(props);
    var {client, user} = this.props;
    this.state = {
      user: user,
      client: client,
      spotifyPlayer: new SpotifyPlayer(),
      spotifyUser: null,
      songDetails: null,
      partyDisplay: false
    }

    this.state.spotifyPlayer.on('update', response => {
      this.setState({
        songDetails: response
      }, function(){
        this.forceUpdate();
      });
    });

    this.state.spotifyPlayer.on('login', user => {
      this.setState({
        spotifyUser: user
      }, function(){
        this.forceUpdate();
      });
    });
    this.playPause = this.playPause.bind(this);
    this.skip = this.skip.bind(this);
    this.partyDisplay = this.partyDisplay.bind(this);
  }

  playPause() {
    if(this.state.songDetails.is_playing == true) {
      console.log('pausing')
    } else {
      console.log('playing')
    }
  }

  skip() {
    console.log('skipping')
  }

  partyDisplay() {
    this.setState({
      partyDisplay: !this.state.partyDisplay
    }, function(){
      this.forceUpdate();
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
    var {songDetails} = this.state;

    var songContainer = null;
    var loginContainer = null;

    var playButton;
    if(!!songDetails) {
      if (songDetails.is_playing == true) {
        playButton = (<FontAwesomeIcon className="icon" icon={faPauseCircle} style={{fontSize:'85px'}} onClick={this.playPause} />);
      } else {
        playButton = (<FontAwesomeIcon className="icon" icon={faPlayCircle} style={{fontSize:'85px'}} onClick={this.playPause} />);
      }
    }

    if (!!this.state.spotifyUser) {
      if (this.state.partyDisplay == true) {


      } else {
        if (!!songDetails) {
          loginContainer = null;
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
                <div className="icon-holder">
                  {playButton}
                  <FontAwesomeIcon className="icon" icon={faArrowAltCircleRight} style={{fontSize:'85px'}} onClick={this.skip} />
                  <input type="button" className="btn btn--login" value="Party Display" onClick={this.partyDisplay} style={{width:'45%'}} />
                </div>
              </div>
            </div>
            <div className="background" style={{backgroundImage: String(songDetails.item.album.images[0].url)}}></div>
          </div>
          );
        } else {
          songContainer = null;
        }
      }
    } else {
      songContainer = null;
      loginContainer = (
        <div className="login-container" id="js-login-container">
          <input type="button" className="btn btn--login" id="js-btn-login" value="Login with Spotify" />
        </div>
      );
    }

    if (this.state.partyDisplay == true) {

      var songList = (
        <div id="pricing-table" class="clear">
          <div class="plan">
            <h3>Previous<span>$59</span></h3>       
            <ul>
              <li><b>Title</b> Track Title</li>
              <li><b>Artist</b> Track Artists</li>
              <li><b>Votes</b> +5</li>			
            </ul> 
          </div>
          <div class="plan" id="most-popular">
            <h3>Now Playing<span>$29</span></h3>      
            <ul>
            <li><b>Title</b> Track Title</li>
            <li><b>Artist</b> Track Artists</li>
            <li><b>Votes</b> +7</li>
            </ul>    
          </div>
          <div class="plan">
            <h3>Upcoming<span>$17</span></h3>
            <ul>
              <li><b>Title</b> Track Title</li>
              <li><b>Artist</b> Track Artists</li>
              <li><b>Votes</b> +5</li>
            </ul>
          </div>
          <div class="plan">
            <h3>Upcoming<span>$9</span></h3>	
            <ul>
              <li><b>Title</b> Track Title</li>
              <li><b>Artist</b> Track Artists</li>
              <li><b>Votes</b> +2</li>		
            </ul>
          </div> 	
          <div class="plan">
            <h3>Upcoming<span>$9</span></h3>	
            <ul>
              <li><b>Title</b> Track Title</li>
              <li><b>Artist</b> Track Artists</li>
              <li><b>Votes</b> +1</li>
            </ul>
          </div> 	
      </div>
      );

      return songList





    } else {

      var spotify = (
        <div className="container" style={spotifyStyle}>
          {loginContainer}
          {songContainer}
        </div>
      );
      
      return spotify
    }
  }
}

export default Spotify

