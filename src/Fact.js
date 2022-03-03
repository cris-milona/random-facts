import React from 'react';
import './Fact.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

class Fact extends React.Component {
  render() {
    return (
      <div className='Fact'>
        <div className='Fact-arrows'>
          <FontAwesomeIcon
            icon={faArrowUp}
            onClick={this.props.upvote}
            className='Fact-arrow-left'
          />
          <span className='Fact-votes'>{this.props.votes}</span>
          <FontAwesomeIcon
            icon={faArrowDown}
            onClick={this.props.downvote}
            className='Fact-arrow-right'
          />
        </div>
        <div>
          <p className='Fact-text'>{this.props.text}</p>
        </div>
      </div>
    );
  }
}

export default Fact;
