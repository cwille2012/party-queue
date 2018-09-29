import React from 'react';

var accountStyle = require('../styles/account.css');

class Account extends React.Component {
  constructor(props) {
    super(props);
    var {client, user} = this.props;
    this.state = {
      user: user,
      client: client,
      removing: false
    }
  }

  logout(client) {
    client.auth.logout();
    window.location = '/';
  }

  cancelRemove() {
    this.setState({
      removing: false
    });
  }

  removeAccountVerify() {
    this.setState({
      removing: true
    });
    this.forceUpdate();
  }

  removeAccount() {
    var userID = this.state.client.auth.user.id;
    var db = this.state.db;
    db.collection('users').deleteOne({owner_id: userID});
    this.logout(this.state.client);
  }

  render() {
    var {viewport} = this.props;
    var {user} = this.state;

    var account = (
      <div className='account' style={accountStyle}>
        <div className='accountholder'>
          <h2 style={{marginBottom: '45px'}}>Account Details</h2>
          <img src={user.picture} alt='not found'></img>
          <h4>{user.fullName || 'Name missing'}</h4>
          <h5>{user.email || 'Email missing'}</h5>
          <h5>{'Logged in with: ' + user.authProvider || ''}</h5>
          <div className='accountbuttonholder'>
            <input type='button' className='accountbutton' onClick={() => window.location="/"} value='Back' />
            <input type='button' className='accountbutton' onClick={() => this.logout(this.state.client)} value='Logout' />
            <input type='button' className='accountbutton' onClick={() => this.removeAccountVerify()} value='Delete Account' />
          </div>
        </div>
      </div>
    );

    if (this.state.removing === true) {
      account = (
        <div className='account' style={accountStyle}>
          <div className='accountholder'>
            <h2>Account Details</h2>
            <h3>Are you sure you want to remove your account?</h3>
            <div className='buttonholder'>
              <input type='button' className='accountbutton' onClick={() => this.cancelRemove()} style={{width: '75px'}} value='Cancel' />
              <input type='button' className='deleteaccountbutton' onClick={() => this.removeAccount()} style={{width: '110px'}} value='Delete Account' />
            </div>
          </div>
        </div>
      );
    }
    
    return account
  }
}

export default Account