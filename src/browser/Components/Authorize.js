import React from 'react';

import {
  RemoteMongoClient
} from "mongodb-stitch-browser-sdk";

class Authorize extends React.Component {
  constructor(props) {
    super(props);
    var {client, user, Stitch} = this.props;
    this.state = {
      user: user,
      client: client,
      removing: false
    }

    const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('partyqueue');

    client.auth.handleRedirectResult(window.location.href.split('/callback/')[1])
      .then(user => {
        return user.profile.data
      })
      .then(result => {
        return db.collection('users').updateOne({ owner_id: client.auth.user.id }, { $set: { user: result, token: client.auth.authInfo.accessToken } }, { upsert: true });
      }).then(result => {
        var loggedIn = Stitch.defaultAppClient.auth.isLoggedIn;
        if (loggedIn === true) {
          window.location = '/';
        } else {
          alert('Error: Login failed!');
          window.location = '/';
        }
      })
  }
  render() {
   return null
  }
}

export default Authorize