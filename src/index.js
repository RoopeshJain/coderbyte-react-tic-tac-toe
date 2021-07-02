import React, { Component } from "react";
import ReactDOM from "react-dom";

class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={this.props.onClick}
        style={{ width: 40, height: 40 }}
      >
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: ["", "", "", "", "", "", "", "", ""],
      firstPlayer: true,
      winner: "",
      stepCount: 0,
    };
  }
  renderSquare(i) {
    return (
      <Square
        value={this.state.fields[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  reset() {
    this.setState({
      fields: ["", "", "", "", "", "", "", "", ""],
      firstPlayer: true,
      winner: "",
      stepCount: 0,
    });
  }

  handleClick(i) {
    if (!this.state.winner && this.state.stepCount < 9) {
      if (this.state.firstPlayer) {
        this.state.fields[i] = "X";
      } else {
        this.state.fields[i] = "O";
      }
      let data = this.calculateWinner(this.state.fields);
      if (data) {
        if (data === "O") {
          this.setState({
            winner: "Player Two",
          });
        } else if (data === "X") {
          this.setState({
            winner: "Player One",
          });
        }
      }
      this.setState({
        firstPlayer: !this.state.firstPlayer,
        stepCount: this.state.stepCount + 1,
      });
    }
    if (this.state.stepCount >= 8) {
      this.setState({
        winner: "Match Draw",
      });
    }
  }

  calculateWinner(fields) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
        return fields[a];
      }
    }
    return null;
  }

  render() {
    return (
      <>
        {this.state.winner && <div>{this.state.winner}</div>}
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
        <button
          onClick={() => {
            this.reset();
          }}
        >
          RESET
        </button>
      </>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
