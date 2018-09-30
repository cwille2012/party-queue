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
        <div class="limiter">
          <div class="container-table100">
            <div class="wrap-table100">
              <div class="table100 ver1">
                <div class="table100-firstcol">
                  <table>
                    <thead>
                      <tr class="row100 head">
                        <th class="cell100 column1">Employees</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="row100 body">
                        <td class="cell100 column1">Brandon Green</td>
                      </tr>

                      <tr class="row100 body">
                        <td class="cell100 column1">Kathy Daniels</td>
                      </tr>

                      <tr class="row100 body">
                        <td class="cell100 column1">Elizabeth Alvarado</td>
                      </tr>

                      <tr class="row100 body">
                        <td class="cell100 column1">Michael Coleman</td>
                      </tr>

                      <tr class="row100 body">
                        <td class="cell100 column1">Jason Cox</td>
                      </tr>

                      <tr class="row100 body">
                        <td class="cell100 column1">Christian Perkins</td>
                      </tr>

                      <tr class="row100 body">
                        <td class="cell100 column1">Emily Wheeler</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div class="wrap-table100-nextcols js-pscroll">
                  <div class="table100-nextcols">
                    <table>
                      <thead>
                        <tr class="row100 head">
                          <th class="cell100 column2">Position</th>
                          <th class="cell100 column3">Start date</th>
                          <th class="cell100 column4">Last Activity</th>
                          <th class="cell100 column5">Contacts</th>
                          <th class="cell100 column6">Age</th>
                          <th class="cell100 column7">Address</th>
                          <th class="cell100 column8">Card No</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="row100 body">
                          <td class="cell100 column2">CMO</td>
                          <td class="cell100 column3">16 Nov 2012</td>
                          <td class="cell100 column4">16 Nov 2017</td>
                          <td class="cell100 column5">brandon94@example.com</td>
                          <td class="cell100 column6">30</td>
                          <td class="cell100 column7">New York City, NY</td>
                          <td class="cell100 column8">424242xxxxxx6262</td>
                        </tr>

                        <tr class="row100 body">
                          <td class="cell100 column2">Marketing</td>
                          <td class="cell100 column3">16 Nov 2015</td>
                          <td class="cell100 column4">30 Nov 2017</td>
                          <td class="cell100 column5">kathy_82@example.com</td>
                          <td class="cell100 column6">26</td>
                          <td class="cell100 column7">New York City, NY</td>
                          <td class="cell100 column8">424242xxxxxx1616</td>
                        </tr>

                        <tr class="row100 body">
                          <td class="cell100 column2">CFO</td>
                          <td class="cell100 column3">16 Nov 2013</td>
                          <td class="cell100 column4">30 Nov 2017</td>
                          <td class="cell100 column5">elizabeth82@example.com</td>
                          <td class="cell100 column6">32</td>
                          <td class="cell100 column7">New York City, NY</td>
                          <td class="cell100 column8">424242xxxxxx5326</td>
                        </tr>

                        <tr class="row100 body">
                          <td class="cell100 column2">Designer</td>
                          <td class="cell100 column3">16 Nov 2013</td>
                          <td class="cell100 column4">30 Nov 2017</td>
                          <td class="cell100 column5">michael94@example.com</td>
                          <td class="cell100 column6">22</td>
                          <td class="cell100 column7">New York City, NY</td>
                          <td class="cell100 column8">424242xxxxxx6328</td>
                        </tr>

                        <tr class="row100 body">
                          <td class="cell100 column2">Developer</td>
                          <td class="cell100 column3">16 Nov 2017</td>
                          <td class="cell100 column4">30 Nov 2017</td>
                          <td class="cell100 column5">jasoncox@example.com</td>
                          <td class="cell100 column6">25</td>
                          <td class="cell100 column7">New York City, NY</td>
                          <td class="cell100 column8">424242xxxxxx7648</td>
                        </tr>

                        <tr class="row100 body">
                          <td class="cell100 column2">Sale</td>
                          <td class="cell100 column3">16 Nov 2016</td>
                          <td class="cell100 column4">30 Nov 2017</td>
                          <td class="cell100 column5">christian_83@example.com</td>
                          <td class="cell100 column6">28</td>
                          <td class="cell100 column7">New York City, NY</td>
                          <td class="cell100 column8">424242xxxxxx4152</td>
                        </tr>

                        <tr class="row100 body">
                          <td class="cell100 column2">Support</td>
                          <td class="cell100 column3">16 Nov 2013</td>
                          <td class="cell100 column4">30 Nov 2017</td>
                          <td class="cell100 column5">emily90@example.com</td>
                          <td class="cell100 column6">24</td>
                          <td class="cell100 column7">New York City, NY</td>
                          <td class="cell100 column8">424242xxxxxx6668</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

      var rightSideBar = (
        <div class="col-lg-3 ds" id="sidebar" style={{width:'20%', height: '100%', position: 'absolute', right: '0'}}>
          <h4 class="centered mt">RECENT ACTIVITY</h4>
          <div class="desc">
            <div class="thumb">
              <span class="badge bg-theme"><i class="fa fa-clock-o"></i></span>
            </div>
            <div class="details">
              <p>
                <muted>Just Now</muted>
                <br/>
                <a href="#">Paul Rudd</a> purchased an item.<br/>
              </p>
            </div>
          </div>
          <div class="desc">
            <div class="thumb">
              <span class="badge bg-theme"><i class="fa fa-clock-o"></i></span>
            </div>
            <div class="details">
              <p>
                <muted>2 Minutes Ago</muted>
                <br/>
                <a href="#">James Brown</a> subscribed to your newsletter.<br/>
              </p>
            </div>
          </div>
          <div class="desc">
            <div class="thumb">
              <span class="badge bg-theme"><i class="fa fa-clock-o"></i></span>
            </div>
            <div class="details">
              <p>
                <muted>3 Hours Ago</muted>
                <br/>
                <a href="#">Diana Kennedy</a> purchased a year subscription.<br/>
              </p>
            </div>
          </div>
          <div class="desc">
            <div class="thumb">
              <span class="badge bg-theme"><i class="fa fa-clock-o"></i></span>
            </div>
            <div class="details">
              <p>
                <muted>7 Hours Ago</muted>
                <br/>
                <a href="#">Brando Page</a> purchased a year subscription.<br/>
              </p>
            </div>
          </div>
          <h4 class="centered mt">TEAM MEMBERS ONLINE</h4>
          <div class="desc">
            <div class="thumb">
              <img class="img-circle" src="img/ui-divya.jpg" width="35px" height="35px" align="" />
            </div>
            <div class="details">
              <p>
                <a href="#">DIVYA MANIAN</a><br/>
                <muted>Available</muted>
              </p>
            </div>
          </div>
          <div class="desc">
            <div class="thumb">
              <img class="img-circle" src="img/ui-sherman.jpg" width="35px" height="35px" align="" />
            </div>
            <div class="details">
              <p>
                <a href="#">DJ SHERMAN</a><br/>
                <muted>I am Busy</muted>
              </p>
            </div>
          </div>
          <div class="desc">
            <div class="thumb">
              <img class="img-circle" src="img/ui-danro.jpg" width="35px" height="35px" align=""/>
            </div>
            <div class="details">
              <p>
                <a href="#">DAN ROGERS</a><br/>
                <muted>Available</muted>
              </p>
            </div>
          </div>
          <div class="desc">
            <div class="thumb">
              <img class="img-circle" src="img/ui-zac.jpg" width="35px" height="35px" align=""/>
            </div>
            <div class="details">
              <p>
                <a href="#">Zac Sniders</a><br/>
                <muted>Available</muted>
              </p>
            </div>
          </div>
        </div>
      );

      return (
        <div>
        {rightSideBar}
        {songList}
        </div>
      )
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

