
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

var numRows = parseInt(window.prompt("Enter the number of rows: "));
var numCols = parseInt(window.prompt("Enter the number of col: "));

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    // const winning = this.props.winningSquares.contains(i);
    let win = false;
    for (var k = 0; k < this.props.winningSquares.length; k++) {
      if (this.props.winningSquares[k] === i) {
        win = true;
      }
    }
    let content = this.props.squares[i];
    if (win) {
      content = <div className="win">{this.props.squares[i]}</div>;
    } else {
      content = this.props.squares[i];
    }
    
    return (
      <Square 
        key={i}
        value={content} 
        onClick={() => this.props.onClick(i)} 
      />
    );
  }

  render() {
    console.log("In render board:");
    console.log(numCols)
    console.log(numRows);

    const row = []; //makes an empty array for storing the rows
    let k = 0; //keeps track of the current square
    for(let i = 0; i < numRows; i++) {
      const col = []; //makes an empty array for storing the cols
      for(let j = 0; j < numCols; j++) {
        col.push(this.renderSquare(k));
        k++;
      }
      console.log(row);
      row.push(<div key={k} className="board-row">{col}</div>);
    }


    return(
      <div>
        {row}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reverseHistory: false,
      history: [
        {
          squares: Array(numRows * numCols).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleReverseHistoryClick() {
    this.setState({
      reverseHistory: !this.state.reverseHistory
    });
  }

  handleBoardClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }


  calculateWinner(squares) {
    console.log("length of squares " + squares.length)
    //checkrows
    var winner = [];
    for (let i = 0; i<squares.length;i+=numCols){
      winner[0] = i;
      for( let j = 1; j<numCols ; j++){
        if(squares[i]===squares[i+j] && squares[i]!==null){
          winner.push(i+j);
          console.log("Pushing rows");
        }
        else{
          winner = [];
          break;
        }
      }
       if(winner.length !== 0){
        return winner;
      }
    }
  //checkcols
    var winner = [];
    for (let i = 0; i<numCols;i++){
      winner[0] = i;
      for( let j = 1; j<numRows;j++){
        if(squares[i]===squares[i+j*numCols] && squares[i+j*numCols]!==null)
          winner.push(i+j*numCols)
        else{
          winner = [];
          break;
        }
      }
      if(winner.length !== 0){
        return winner;
      }
    }
    
    if(numRows===numCols){
      var winner = [];
      //back diagonal
      console.log("Square Board")
      for(let i = 1 ; i < numRows; i++){
        winner[0] = numCols-1;
        if(squares[numCols-1]===squares[i*numCols+numCols-i-1] && squares[i*numCols+numCols-i-1]!==null){
          winner.push(i*numCols+numCols-i-1);
        }
        else{
          winner = [];
          break;
        }
      }
      if(winner.length !== 0){
        return winner;
      }
      var winner = [];
      for(let i = 1 ;i <numRows; i++){
        winner[0] = 0;
        if(squares[0]===squares[i*numRows+i] && squares[i*numRows+i]!==null){
          winner.push(i*numRows+i);
        }
        else{
          winner = []
        }
      }
      if(winner.length !== 0){
        return winner;
      }
    
    }

    return null;
  }

  currentMove(step, move) {
    if (move === 0) {
      //should not be called for 1st move
      return "";
    }
    const previous = this.state.history[move - 1];
    const currentSquares = step.squares;
    let diff;
    for (var i = 0; i < previous.squares.length; i++) {
      if (previous.squares[i] !== currentSquares[i]) {
        diff = i;
        break;
      }
      diff = null;
    }
    if (diff === null) {
      return "";
    }
    const humanReadablePos = diff + 1;
    return "" + currentSquares[diff] + "->" + humanReadablePos;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const bold = move === this.state.stepNumber;
      const desc = move
        ? "Go to move " + this.currentMove(step, move)
        : "Go to game start";
      const boldDesc = bold ? <b>{desc}</b> : desc;
      return (
        <li value={move + 1} key={move}>
          <button onClick={() => this.jumpTo(move)}>{boldDesc}</button>
        </li>
      );
    });

    const reverseButtonDesc = this.state.reverseHistory
      ? "Change to descending history"
      : "Change to ascending history";
    const reverseButton = (
      <button onClick={() => this.handleReverseHistoryClick()}>
        {reverseButtonDesc}
      </button>
    );
    if (!this.state.reverseHistory) {
      moves.reverse();
    }

    // let draw = current.contains(null) && !winner;
    let draw = true;
    for (var k = 0; k < current.squares.length; k++) {
      if (current.squares[k] === null || winner) {
        draw = false;
      }
    }

    let status;
    let winningSquares;
    if (winner) {
      status = "Winner: " + current.squares[winner[0]];
      winningSquares = winner;
    } else {
      if (draw) {
        status = "Draw";
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
      winningSquares = [];
    }
    console.log(current.squares)
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winningSquares={winningSquares}
            onClick={i => this.handleBoardClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <div>{reverseButton}</div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));