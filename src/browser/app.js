import React, { Component } from 'react';
import { render } from 'react-dom';

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
import Authorize from './Components/Authorize';
import Join from './Components/Join';
import Spotify from './Components/Spotify';
import NotFound from './Components/NotFound';

var mainStyle = require('./styles/main.css');
var loginStyle = require('./styles/login.css');
console.log('app')
let appId = 'partyqueue-vdayw';
let redirectUrl = 'http://partyqueso.com/callback';
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

  authenticate(method, redirect) {
    var credential = null;
    if (method == 'facebook') {
      credential = new FacebookRedirectCredential(redirect);
    } else if (method == 'google') {
      credential = new GoogleRedirectCredential(redirect);
    } else {
      alert('Error: Invalid authentication method');
    }
    if (!!credential) {
      Stitch.defaultAppClient.auth.loginWithRedirect(credential);
    }
  }

  render() {
    const { viewport, request } = this.state;

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
              <input type='button' className='authenticatebutton' onClick={() => this.authenticate('facebook', redirectUrl)} value='Login with Facebook' />
              <input type='button' className='authenticatebutton' onClick={() => this.authenticate('google', redirectUrl)} value='Login with Googe' />
            </div>
          </form>
        </div>
      </div>
    );


    var page;

    if ((request == '' || request == 'home') && loggedIn === true) {
      page = (<Home viewport={viewport} client={client} />)
    } else if (request == 'account' && loggedIn === true) { 
      page = (<Account viewport={viewport} client={client} user={user} />);
    } else if (request == 'host' && loggedIn === true) {
      page = (<Host viewport={viewport} client={client} user={user} />);
    } else if (request == 'join' && loggedIn === true) {
      page = (<Join viewport={viewport} client={client} user={user} />);
    } else if (request == 'spotify' && loggedIn === true) {
      page = (<Spotify viewport={viewport} client={client} user={user} />);
    } else if (request.includes('callback')) {
      page = (<Authorize viewport={viewport} client={client} Stitch={Stitch} />);
    } else {
      if (loggedIn === true) {
        page = (<NotFound viewport={viewport} />);
      } else {
        page = loginPage;
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