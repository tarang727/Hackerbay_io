import React, { Component } from 'react';

/**
 * @class GameTab
 * @extends React.Component
 * @description Settings component of the game. It holds the methods that start and restart of the game.
 */
export default class GameTab extends Component {
  constructor(props) {
    super(props)
    this.timer = null;
    this.clock = this.clock.bind(this);
    this.startGame = this.startGame.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.state = {
      width: 0, height: 0
    }
  }

  /**
   * @method componentDidUpdate
   * @description Binds and unbinds the handleKeyPress method to the Windows keyup event.
   */
  componentWillReceiveProps({ data }) {
    data.gameIsWon && clearInterval(this.timer);
  }
  
  /**
   * @method CreateToadBoxes
   * @param {number} boardLimit The highest index any box can occupy on the game board.
   * @param {number} numberOfToads The number of toads for Mario to catch on the game board.
   * @returns {number[]} An array of indexes occupied by the boxes with toads.
   */
  createToadBoxes(boardLimit, numberOfToads){
    const toadBoxes = [];
    do{
      const boardIndex = Math.floor(Math.random() * boardLimit);
      toadBoxes.indexOf(boardIndex) < 0 && (
        toadBoxes.push(boardIndex)
      )
    }
    while(toadBoxes.length <= numberOfToads);
    return toadBoxes;
  }

  /**
   * @method clock
   * @description Counts the time spent when playing the game.
   */
  clock(){
    this.props.actions.setAppState(i => {
      return { time: ++i.time }
    })
  }

  /**
   * @method startGame
   * @description Updates the App.Component state and starts the game
   * @param {FormEvent} e FormEvent object
   */
  startGame(e){
    e.preventDefault();
    const columns = parseInt(e.target[0].value, 10);
    const rows = parseInt(e.target[1].value, 10);
    const numberOfToads = parseInt(e.target[2].value, 10);
    const boardLimit = rows * columns;
    const toadBoxes = this.createToadBoxes(boardLimit, numberOfToads);
    const marioBox = toadBoxes.shift();

    this.props.actions.setAppState({
      columns, rows, isGameStarted: true,
      numberOfToads, toadBoxes, marioBox,
      hitList: []
    });

    this.timer = setInterval(this.clock, 1000);
  }

  /**
   * @method restartGame
   * @description Updates the App.Component state and restarts the game
   */
  restartGame(){
    this.props.actions.setAppState({
      isGameStarted: false, toadBoxes: [], time: 0,
      movesList: [], marioBox: null, gameIsWon: false,
      numberOfToads: 0, hitList: []
    });
    clearInterval(this.timer);
  }

  /**
   * @method InputBox
   * @description React component for form input
   * @param {React.Props} props 
   * @return {JSX.Element} A JSX element for HTML form input.
   */
  InputBox(props){
    const { placeholder, disabled } = props;
    return (
      <input 
        type="number"
        min={5}
        max={10}
        placeholder={placeholder}
        required
        disabled={disabled}
      />
    )
  }
  
  render() {
    const { InputBox } = this;
    const { isGameStarted } = this.props.data;
    return (
      <form onSubmit={this.startGame}>
        <h2>Settings</h2>
        <InputBox 
          placeholder="NUMBER OF COLUMNS"
          disabled={isGameStarted}
        />
        <InputBox 
          placeholder="NUMBER OF ROWS"
          disabled={isGameStarted}
        />
        <InputBox 
          placeholder="NUMBER OF TOADS"
          disabled={isGameStarted}
        />
        <div>
          <button 
            type="submit"
            disabled={isGameStarted}
          >
            START
          </button>
          <button 
            onClick={this.restartGame}
            disabled={!isGameStarted}
          >
            RESTART
          </button>
        </div>
      </form>
    )
  }
}
