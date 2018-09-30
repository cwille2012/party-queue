// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faPlayCircle, faArrowAltCircleRight, faPauseCircle } from '@fortawesome/free-solid-svg-icons'

// import SpotifyPlayer from './spotify-player.js';

// var spotifyStyle = require('../styles/spotify.css');

// class Spotify extends React.Component {
//   constructor(props) {
//     super(props);
//     var {client, user} = this.props;
//     this.state = {
//       user: user,
//       client: client,
//       spotifyPlayer: new SpotifyPlayer(),
//       spotifyUser: null,
//       songDetails: null,
//       partyDisplay: false,
//       session: null
//     }

//     this.state.spotifyPlayer.on('update', response => {
//       this.setState({
//         songDetails: response
//       }, function(){
//         this.forceUpdate();
//       });
//     });

//     this.state.spotifyPlayer.on('login', user => {
//       this.setState({
//         spotifyUser: user
//       }, function(){
//         this.forceUpdate();
//       });
//     });
//     this.playPause = this.playPause.bind(this);
//     this.skip = this.skip.bind(this);
//     this.partyDisplay = this.partyDisplay.bind(this);
//   }

//   playPause() {
//     if(this.state.songDetails.is_playing == true) {
//       console.log('pausing')
//     } else {
//       console.log('playing')
//     }
//   }

//   skip() {
//     console.log('skipping')
//   }

//   partyDisplay() {
//     this.setState({
//       partyDisplay: !this.state.partyDisplay
//     }, function(){
//       this.forceUpdate();
//     });
//   }

//   componentDidMount() {
//     if (!this.state.spotifyUser){
//       if (!!document.getElementById('js-btn-login'))
//       document.getElementById('js-btn-login').addEventListener('click', () => {
//         this.state.spotifyPlayer.login();
//       });
//       //this.state.spotifyPlayer.login();
//     }

//     'http://api.partyqueso.com/party/<partyid>/queue'

//     // fetch('http://api.partyqueso.com/party/5bb0dd37b093135161f5f0a2/queue', {
//     //   method: 'GET',
//     //   headers: {
//     //     'Accept': 'application/json',
//     //     'Content-Type': 'application/json',
//     //     'Authorization': 'BQAEvg7ETeQqWEmRAMLV_lhQSSDnmnoWX4QjB-zzJf6ccsNgRu4oX7K0IcUSN2LDBIbzg36Hj4FDxBXPNbHB-9faSoAWM1JzkEKOdQQfkFD4hjGljZ7aj1ajjA0qOYHKM9APipyOENViIPd9a6yDwc9Y2kSenI5srw8h7R3pfL1Y7GouVFAay9V5h8Ur7NyC3LsgXoULNTBbaOe9t9mLSXVobscTtOeHFOZ4DAOhga_INVQ-W3RSqqa5rIpvQsUjJmtZRzhXB8ty5Ksl5UdnZHjEwQ'
//     //   }
//     // })
//     // .then(function(response) {
//     //   return response.json()
//     // })
//     // .then(jsonResponse => {
//     //   console.log(jsonResponse)
//     //   this.setState({
//     //     session: jsonResponse
//     //   })
//     // }).catch (error => {
//     //   alert('Error: ' + error);
//     //   console.log(error);
//     // })
//     //this.state.spotifyPlayer.login();
//     this.state.spotifyPlayer.init();
//   }
  
//   render() {
//     var {songDetails} = this.state;

//     var songContainer = null;
//     var loginContainer = null;

//     var playButton;
//     if(!!songDetails) {
//       if (songDetails.is_playing == true) {
//         playButton = (<FontAwesomeIcon className="icon" icon={faPauseCircle} style={{fontSize:'85px'}} onClick={this.playPause} />);
//       } else {
//         playButton = (<FontAwesomeIcon className="icon" icon={faPlayCircle} style={{fontSize:'85px'}} onClick={this.playPause} />);
//       }
//     }

//     if (!!this.state.spotifyUser) {
//       if (this.state.partyDisplay == true) {
//         if (!!this.state.session) {
//           var songValues = Object.keys(this.state.session).map(function(key) {
//             return (
//               <tr key={key}>
//                 <th>{key}</th>
//                 <td>{alarm[key]}</td>
//               </tr>
//             );
//           });
    
//           var songTable = (
//             <div className="row">
//               <h2>(701)543-6969</h2>
//               <table className="config-table">
//                 <thead className="table-head">
//                   <tr className="header-row">
//                     <th style={{width: '50%'}}>Parameter</th>
//                     <th style={{width: '50%'}}>Value</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   { songValues }
//                 </tbody>
//               </table>
//             </div>
//           );

//           return songTable

//         } else {
//           return null
//         }
//       } else {
//         if (!!songDetails) {
//           loginContainer = null;
//           songContainer = (
//             <div style={{height:'100%'}}>
//             <div className="main-wrapper" style={{height:'100%'}}>
//               <div className="now-playing__img">
//                 <img src={songDetails.item.album.images[0].url} />
//               </div>
//               <div className="now-playing__side">
//                 <div className="now-playing__name">{songDetails.item.name}</div>
//                 <div className="now-playing__artist">{songDetails.item.artists[0].name}</div>
//                 <div className="now-playing__status">{songDetails.is_playing ? 'Playing' : 'Paused'}</div>
//                 <div className="progress">
//                   <div className="progress__bar" style={{width: String(Number((songDetails.progress_ms * 100) / songDetails.item.duration_ms)+'%')}}></div>
//                 </div>
//                 <div className="icon-holder">
//                   {playButton}
//                   <FontAwesomeIcon className="icon" icon={faArrowAltCircleRight} style={{fontSize:'85px'}} onClick={this.skip} />
//                   <input type="button" className="btn btn--login" value="Party Display" onClick={this.partyDisplay} style={{width:'45%'}} />
//                 </div>
//               </div>
//             </div>
//             <div className="background" style={{backgroundImage: String(songDetails.item.album.images[0].url)}}></div>
//           </div>
//           );
//         } else {
//           songContainer = null;
//         }
//       }
//     } else {
//       songContainer = null;
//       loginContainer = (
//         <div className="login-container" id="js-login-container">
//           <input type="button" className="btn btn--login" id="js-btn-login" value="Login with Spotify" />
//         </div>
//       );
//     }

//     if (this.state.partyDisplay == false) {
    
//       var spotify = (
//         <div className="container" style={spotifyStyle}>
//           {loginContainer}
//           {songContainer}
//         </div>
//       );
      
//       return spotify
//     }
//   }
// }

// export default Spotify



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
      partyDisplay: false,
      session: null
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

    fetch('http://api.partyqueso.com/party/5bb0dd37b093135161f5f0a2/queue', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MzgzMjc5MDcsImlhdCI6MTUzODMyNjEwNywiaXNzIjoiNWJiMGZlNWJiNGE1YzU1ZmE0Y2JmNWQ1Iiwic3RpdGNoX2RhdGEiOm51bGwsInN0aXRjaF9kZXZJZCI6IjViYjBmZTViYjRhNWM1NWZhNGNiZjVkNCIsInN0aXRjaF9kb21haW5JZCI6IjViOTdkM2FhMGUxMTkwZjg2YmUyMjIzOCIsInN1YiI6IjViOTdlY2IzYTY2ZTY3ZGY0N2QzYWM2YiIsInR5cCI6ImFjY2VzcyJ9.mUBy6XuYenGloGxakkcIYq8xfU34QWU4Sdic8wgv1Co'
      }
    })
    .then(function(response) {
      return response.json()
    })
    .then(jsonResponse => {
      console.log(jsonResponse)
      this.setState({
        session: jsonResponse
      },function() {
        this.state.spotifyPlayer.init();
        this.forceUpdate();
      })
    }).catch (error => {
      alert('Error: ' + error);
      console.log(error);
    })
    
    // this.state.spotifyPlayer.init();
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

    var sessionTable = null;
    if(!!this.state.session) {
      
      sessionTable = (
      <div>
        <table className="sensor-table">
          <thead className="table-head">
            <tr className="header-row">
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {this.state.session.map(({ songId, name, score }) => (
              <tr key={songId}> 
                <td><a href={'/song/'+name}>{String(name)}</a></td>
                <td><a href={'/song/'+name}>{String(score)}</a></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      );

      // sessionTable = (
      //   <div className="row">
      //     <table className="config-table">
      //       <thead className="table-head">
      //         <tr className="header-row">
      //           <th style={{width: '50%'}}>Parameter</th>
      //           <th style={{width: '50%'}}>Value</th>
      //         </tr>
      //       </thead>
      //       <tbody>
      //         { sessionValues }
      //       </tbody>
      //     </table>
      //   </div>
      // );
    }

    if (!!this.state.spotifyUser) {
      if (!!songDetails) {
        loginContainer = null;
        songContainer = (
          
            <div className="main-wrapper" style={{height:'100%'}}>
            <div>
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
                </div>
                </div>
              </div>
              
              {sessionTable}
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
      </div>
    );
    
    return spotify
  }
}

export default Spotify