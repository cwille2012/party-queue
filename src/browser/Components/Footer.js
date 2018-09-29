import React from 'react';

var footerStyle = require('../styles/footer.css');

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var {viewport} = this.props;

    var footer = (
      <div className='footer' style={footerStyle}>
        <div>Copyright © 2018 Christopher Wille</div>
      </div>
    );
    
    return footer
  }
}

export default Footer