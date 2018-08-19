import React, { Component, Fragment } from 'react';
import GameTab from './components/GameTab';
import Board from './components/Board';

/**
 * @class App
 * @extends ReactComponent
 * @description Main component of the game. It holds the state of the game.
 */
export default class App extends Component {
  constructor(props) {
    super(props)
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateGameBoard = this.updateGameBoard.bind(this);
    this.evaluateMarioPosition = this.evaluateMarioPosition.bind(this);

    /**
     * @description Class methods that are accessible by children components.
     */
    this.actions = {
      setAppState: this.letChildrenSetState.bind(this)
    }

    /**
     * @description State of the app.
     */
    this.state = {
      time: 0,
      rows: 10, 
      columns: 10, 
      isGameStarted: false,
      hitList: [],
      toadBoxes: [],
      movesList: [],
      gameIsWon: false,
      numberOfToads: 0
    }
  }
  
  componentDidCatch(error, info){
    console.log(error, info)
  }
  
  /**
   * @method componentDidUpdate
   * @description Binds and unbinds the handleKeyPress method to the Windows keyup event.
   */
  componentDidUpdate() {
    this.state.isGameStarted && window.addEventListener('keyup', this.handleKeyPress);
    !this.state.isGameStarted && window.removeEventListener('keyup', this.handleKeyPress);
  }

  /**
   * @method evaluateMarioPosition
   * @description Evaluates the position of Mario on the board and determines the directions which Mario can move at.
   * @return {object} marioDirections
   */
  evaluateMarioPosition(){
    const { marioBox, columns, rows } = this.state;;
    const quotient = marioBox / columns;
    const modulus = marioBox % columns;

    return {
      MarioMoveUp: Math.floor(quotient) > 0,
      MarioMoveDown: Math.ceil(quotient) < rows && (rows - quotient > 1),
      MarioMoveLeft: (modulus) > 0,
      MarioMoveRight: (modulus) < (columns - 1)
    }
  }

  /**
   * @method handleKeyPress
   * @param {KeyboardEvent} e The keyboard event
   * @description Handles the keypress event and evaluates key presses of the player and translates them to changes in the position of Mario.
   */
  handleKeyPress(e){
    const keyIsNotValid = [27,37,38,39,40].indexOf(e.which) < 0;
    if(keyIsNotValid) return;

    let { hitList, marioBox, columns, movesList } = this.state;
    const can = this.evaluateMarioPosition();

    switch(e.which){
      case 27:
        if(movesList.length < 1) return;
        marioBox = movesList.pop();

        const toadBoxes = hitList.pop();
        const gameIsWon = toadBoxes.length === 0;

        this.setState({ marioBox, movesList, toadBoxes, hitList, gameIsWon });
        return;

      case 37:
        if(!can.MarioMoveLeft) return;
        --marioBox;
        break; 

      case 38:
        if(!can.MarioMoveUp) return;
        marioBox -= columns;
        break; 

      case 39:
        if(!can.MarioMoveRight) return;
        ++marioBox;
        break;

      case 40:
        if(!can.MarioMoveDown) return;
        marioBox += columns;
        break; 

      default:
    }
    this.updateGameBoard(marioBox);
  }
  
  /**
   * @method updateGameBoard
   * @param {number} marioBox The boardIndex of the box that Mario is occupying on the board.
   * @description Updates the state of the app to cause changes on the game board.
   */
  updateGameBoard(marioBox){
    let { hitList, toadBoxes, movesList } = this.state;
    hitList.push(Object.assign([], this.state.toadBoxes));
    movesList.push(this.state.marioBox);

    const knockOutBoxIndex = toadBoxes.lastIndexOf(marioBox);
    knockOutBoxIndex >= 0 && toadBoxes.splice(knockOutBoxIndex, 1);

    const gameIsWon = toadBoxes.length === 0;
    this.setState({ marioBox, movesList, toadBoxes, gameIsWon, hitList });
  }

  /**
   * @method letChildrenSetState
   * @param {object} ReactState 
   * @description lets children component set the state of the App component.
   */
  letChildrenSetState(newState){
    this.setState(newState);
  }

  render() {
    return (
      <Fragment>
        <GameTab actions={this.actions} data={this.state} />
        <Board actions={this.actions} data={this.state} />
      </Fragment>
    )
  }
}