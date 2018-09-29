import React, {Component} from 'react';
import {render} from 'react-dom';

import {
  Stitch,
  RemoteMongoClient,
  GoogleRedirectCredential,
  FacebookRedirectCredential
} from "mongodb-stitch-browser-sdk";

import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Components/Home';
import Host from './Components/Host';
import Account from './Components/Account';
import NotFound from './Components/NotFound';

var mainStyle = require('./styles/main.css');
var loginStyle = require('./styles/login.css');

let appId = 'partyqueue-vdayw';
let redirectUrl = 'https://655816e4.ngrok.io';
const client = Stitch.initializeDefaultAppClient(appId);
const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('partyqueue');

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      request: window.location.href.split('/').pop().toLowerCase(),
      viewport: {
        width: 0,
        height: 0
      },
      sessionID: '',
      sessionPass: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize.bind(this));
  }

  _resize() {
    this.setState({
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }

  handleChange(event) {
    const target = event.target;
    var value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    var setStateBool = true;

    if (name == 'sessionID') {
      if (value.length > 8) {
        setStateBool = false;
      }
      if (value.length > 0) {
        value = value.toUpperCase();
      }
    }
    if (name == 'sessionPass') {
      if (value.length > 4) {
        setStateBool = false;
      }
      if (isNaN(value)) {
        setStateBool = false;
      }
    }

    if (setStateBool === true) {
      this.setState({
        [name]: value
      });
    }
  }

  authenticate(method, redirect) {
    var credential = null;
    if (method == 'facebook') {
      credential = new FacebookRedirectCredential(redirect);
    } else if (method == 'google') {
      credential = new GoogleRedirectCredential(redirect);
    } else {
      alert ('Error: Invalid authentication method');
    }
    if (!!credential) {
      Stitch.defaultAppClient.auth.loginWithRedirect(credential);
    }
  }

  render() {
    const {viewport, request} = this.state;

    var loggedIn = Stitch.defaultAppClient.auth.isLoggedIn;

    var user = null;
    if (loggedIn === true) {
      user = {
        id: client.auth.user.id,
        firstName: client.auth.user.profile.firstName,
        lastName: client.auth.user.profile.lastName,
        fullName: client.auth.user.profile.name,
        email: client.auth.user.profile.email,
        birthday: client.auth.user.profile.birthday,
        gender: client.auth.user.profile.gender,
        picture: client.auth.user.profile.pictureUrl,
        authProvider: client.auth.user.loggedInProviderName,
        userType: client.auth.user.profile.userType
      }
    }

    var loginPage = (
      <div className='login' style={loginStyle}>
        <div className='loginholder'>
          <h2>Login</h2>
          <form>
            <div className='loginbuttonholder'>
              <input type='text' className='sessioninput' name='sessionID' placeholder='ID' value={this.state.sessionID} onChange={this.handleChange}></input>
            </div>
            <div className='loginbuttonholder'>
              <input type='password' className='sessioninput' name='sessionPass' placeholder='PIN' value={this.state.sessionPass} onChange={this.handleChange}></input>
            </div>
            <div className='loginbuttonholder'>
              <input type='button' className='authenticatebutton' onClick={() => this.authenticate('facebook', redirectUrl)} value='Login with Facebook' />
              <input type='button' className='authenticatebutton' onClick={() => this.authenticate('google', redirectUrl)} value='Login with Googe' />
            </div>
          </form>
        </div>
      </div>
    );
    

    var page;
    if (request == '' || request == 'home') {
      if (loggedIn === true) {
        page = (<Home viewport={viewport} client={client} />);
      } else {
        page = loginPage;
      }
    } else if (request == 'account') {
      if (loggedIn === true) {
        page = (<Account viewport={viewport} client={client} user={user} />);
      } else {
        page = loginPage;
      }
    } else if (request == 'host') {
      if (loggedIn === true) {
        page = (<Host viewport={viewport} client={client} user={user} />);
      } else {
        page = loginPage;
      }
    } else {
      if (request.charAt(0) == '#') {
        client.auth.handleRedirectResult(request)
          .then(user => {
            return user.profile.data
          })
          .then(result => {
            db.collection('users').updateOne({owner_id: client.auth.user.id}, {$set:{user: result}}, {upsert:true});
            window.location = '/';
          })
        if (loggedIn === true) {
          page = (<Home viewport={viewport} />);
        } else {
          page = loginPage;
        }
      } else if (request.charAt(0) == '?') {
        console.log(request)
      } else {
        page = (<NotFound viewport={viewport} />);
      }
    }
    
    return (
      <div style={mainStyle}>
        <Header viewport={viewport} user={user} />
        {page}
        <Footer viewport={viewport} />
      </div>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement('div')));