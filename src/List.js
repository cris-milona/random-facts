import axios from 'axios';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import Fact from './Fact';
import Spinner from './Spinner';
import './List.css';

const BASE_URL = 'https://rest.blackhistoryapi.io';
const API_KEY = 'eHIubWlsb25hRnJpIEZlYiAyNSAyMD';

class List extends React.Component {
  static defaultProps = {
    factsToGet: 10,
  };

  constructor(props) {
    super(props);
    this.state = {
      facts: JSON.parse(window.localStorage.getItem('facts') || '[]'),
      loading: false,
    };
    this.factsOnScreen = new Set(this.state.facts.map((f) => f.text));
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    if (this.state.facts.length === 0) {
      this.setState({ loading: true });
      this.getFacts();
    }
  }

  async getFacts() {
    try {
      let facts = [];
      while (facts.length < this.props.factsToGet) {
        const response = await axios.get(`${BASE_URL}/fact/random`, {
          headers: {
            'x-api-key': API_KEY,
          },
        });
        if (!this.factsOnScreen.has(response.data.Results[0].text)) {
          facts.push({
            id: uuidv4(),
            text: response.data.Results[0].text,
            votes: 0,
          });
          // check code for new Set(). The ap pis broken
          this.factsOnScreen.add(response.data.Results[0].id);
        } else {
          throw new Error('there are duplicates');
        }
      }
      this.setState(
        (oldState) => ({
          loading: false,
          facts: [...oldState.facts, ...facts],
        }),
        //we are adding in local storage the facts we have on screen
        () => {
          window.localStorage.setItem(
            'facts',
            JSON.stringify(this.state.facts)
          );
        }
      );
    } catch (e) {
      this.setState({ loading: false });
      throw new Error(e.message);
    }
  }

  handleVote(id, newVote) {
    this.setState(
      (oldState) => ({
        facts: oldState.facts.map((fact) =>
          fact.id === id ? { ...fact, votes: fact.votes + newVote } : fact
        ),
      }),
      //we are adding in local storage the votes we have on screen
      () => {
        window.localStorage.setItem('facts', JSON.stringify(this.state.facts));
      }
    );
  }

  handleClick() {
    //getFacts is the second argument in order to be sure that it will run after the change on state
    this.setState({ loading: true }, this.getFacts);
  }

  render() {
    //short all facts based on votes
    let facts = this.state.facts.sort((a, b) => b.votes - a.votes);
    return this.state.loading === true ? (
      <Spinner />
    ) : (
      <div className='List'>
        <div className='List-info'>
          <h1 className='List-info-title'>black history facts</h1>
          <button onClick={this.handleClick} className='btn'>
            More
          </button>
        </div>
        <div className='List-facts'>
          {facts.map((fact) => (
            <Fact
              key={fact.id}
              text={fact.text}
              votes={fact.votes}
              upvote={() => {
                this.handleVote(fact.id, 1);
              }}
              downvote={() => {
                this.handleVote(fact.id, -1);
              }}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default List;
