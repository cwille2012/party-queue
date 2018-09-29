import React from 'react';

var notFoundStyle = require('../styles/notfound.css');

class NotFound extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var {viewport} = this.props;

    var notfound = (
      <div className='notfound' style={notFoundStyle}>
        <div className='notfoundholder'>404 Not Found</div>
      </div>
    );
    
    return notfound
  }
}

export default NotFound