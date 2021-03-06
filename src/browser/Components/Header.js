import React from 'react';

var headerStyle = require('../styles/header.css');

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    this.setState({
      loading: false
    })
  }


  render() {
    var {viewport, user} = this.props;

    var header = null;

    if (this.state.loading === false) {
      header = (
        <div className='headernull' style={headerStyle}>PartyQueue</div>
      );
  
      if (user != null && user != undefined) {
        header = (
          <div className='header' style={headerStyle}>
            <div className='headerleft'>
              <div className='headermenu'>
                <img src='/menu.png' alt = ''></img>
              </div>
            </div>
            <a href='/'>
              <h3 className='appname'>PartyQueue</h3>
            </a>
            <div className='headerright'>
              <a href='/account'>
                <div className='headeraccount'>
                  <img src={user.picture} alt=''></img>
                  <h4 className='headername'>{user.firstName}</h4>
                </div>
              </a>
            </div>
          </div>
        );
      }
    }

    return header
  }
}

export default Header