	import React, { Component } from 'react'

  export default  class  App extends React.Component{
		
	  render(){
	    return(
	      <div className="row">
	        <Board />
	      </div>
	    );
	  }
	}

  // create the board
  class  Board extends React.Component{
    //getInitialState:
    constructor (props) {
      super(props);

      this.state = {
        //Initial state of the game board.
        cells:  ['','','','','','','','',''],
        //O always have the first go.
        turn: 'o',
        singlePlayer: true,
        winner: false
      };

      this.cellClick = this.cellClick.bind(this);
      this.resetGame = this.resetGame.bind(this);
      this.testWin = this.testWin.bind(this);
      this.moveAi = this.moveAi.bind(this);
      this.setSingle = this.setSingle.bind(this);
      this.setTurn = this.setTurn.bind(this);
    }


    testWin(arr, turn){

      let boardWidth = Math.sqrt(arr.length), // Board width
          newArr = [];

      newArr = addDim(arr, boardWidth);

      // test horizontally
      var condition1 = testAlignItems(newArr, turn);

      // test diagonal 1
      var condition3 = testDiagonalItems(newArr, turn);

      // permute items
      let permutedArr = permutation(newArr);
      let switchedArr = switched(newArr);

      // test vertically
      var condition2 = testAlignItems(permutedArr, turn);

      // test diagonal 2
      var condition4 = testDiagonalItems(switchedArr, turn);

      if(condition1 || condition2 || condition3 || condition4) {
        this.setState({winner: true});
        setTimeout(
          function(){
            this.resetGame();
          }.bind(this),
          2000
        );
      }
    }

    resetGame (){
      this.setState({
        cells : ['','','','','','','','',''],
        turn : 'o',
        winner: false
      });
    }

    //Cell click method to modify the state of the tiles array
    cellClick (position, player) {
      var cells = this.state.cells;

      //If the selected position is already filled, return to prevent it being replaced.
      if( (cells[position] === 'x' || cells[position] === 'o' || this.state.winner) ){
        return;
      }else{
        // else we can play
        cells[position] = player;

        this.setState({cells: cells});

        // setState does not mutate this.state immediately !!!
        this.testWin(this.state.cells, this.state.turn);

        this.setState({turn: this.state.turn === 'o' ? 'x' : 'o'}, function(){
          if(this.state.singlePlayer){
            // if the mode single player is activated, we need to call the AI for the next move
            this.moveAi(cells);

          }
        });
      }
    }

    setSingle(){
      this.setState({singlePlayer: this.state.singlePlayer === true ? false : true});
      this.resetGame();
    }

    setTurn(turn){
      this.resetGame();
      this.setState({turn: turn ? 'o' : 'x'});

    }

    hasWinner(){
      this.setState({winner: true});
    }

    isATie(arr){
      var result = [];
      result = arr.map(isEmpty).filter(isDefined);

      if(result.length === 0){
        setTimeout(
          function(){
            this.resetGame();
          }.bind(this),
          2000
        );
      }
      return !result.length;
    }

    moveAi(arr){
      var result = [];

      // create an array of emtpy cells
      result = arr.map(isEmpty).filter(isDefined);

      // pick a random number in that array
      arr[result[Math.floor(Math.random()*result.length)]] = this.state.turn;

      this.setState({cells: arr}, function(){
        this.testWin(this.state.cells, this.state.turn);

        if(!this.state.winner){

          this.setState({turn: this.state.turn === 'o' ? 'x' : 'o'});
        }
      });
    }


    render () {
      return(
        <div id="game" className="container">
          <div className="row">
          {this.state.cells.map(function(cell,pos){
              return (
                  <Cell status={cell} keyy={pos} turn={this.state.turn} cellClick={this.cellClick} />
            );
          },this)}
          </div>
          <div className="row">
            <Menu
              resetGame={this.resetGame}
              turn={this.state.turn}
              win={this.state.winner}
              tie={this.isATie(this.state.cells)}
              setSingle={this.setSingle}
              singlePlayer={this.state.singlePlayer}
              setTurn={this.setTurn}
              checked={this.state.turn === 'o' ? true : false}
            />
          </div>
        </div>
      );
    }//end render

  }

    //The cell component
  class Cell extends React.Component{

    constructor(props) {
      super(props);

      this.clickHandler = this.clickHandler.bind(this);
    }
    //The method to handle when a user clicks on the cell, calls the cellClick method on the parent component that is referenced in the props object.

    clickHandler () {
      this.props.cellClick(this.props.keyy, this.props.turn);
    }

    render () {
      return (
        <div className={this.props.status === '' ? 'col-xs-4 cell' : 'col-xs-4 cell status-' + this.props.status} onClick={this.clickHandler}>{this.props.status}</div>
        );
    }
  }

  //The menu (blue)
  class Menu extends React.Component{
    constructor(props) {
      super(props);

      this.clickHandler = this.clickHandler.bind(this);
      this.buttonClick = this.buttonClick.bind(this);
      this.selected = this.selected.bind(this);
    }

    clickHandler (){
      this.props.resetGame();
    }

    buttonClick(){
      this.props.setSingle();
    }

    selected(checked){
      this.props.setTurn(checked);
    }

    render() {
      var winner = (this.props.turn === 'o' ? 'x' : 'o').toUpperCase();
      return (
        <nav id='menu' onClick={this.clickHandler} className="text-center"><a id="reset" className="btn btn-warning">Reset</a><br/>
           {(() => {
            if (this.props.win) {
              return (
                <p>{winner} won the game ! </p>
              );
            }else if(this.props.tie){
              return(
                <p>It's a tie !</p>
              );
            }else{
              return (
                <p>It's {this.props.turn.toUpperCase()}'s turn !</p>
              );
            }
          })()
          }

          <Button buttonClick={this.buttonClick} />
          <SelectPlayer display={this.props.singlePlayer} selected={this.selected} checked={this.props.checked} />

        </nav>
      );
    }
  }

  class Button extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      selectPlayer: true
    }

    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler(){
    this.props.buttonClick();
    this.setState({selectPlayer: this.selectPlayer===true ? false : true});
  }

  render(){
    return(
      <section title=".slideThree">
        <div className="slideThree">
          <input type="checkbox" id="slideThree" name="check" onClick={this.clickHandler} />
          <label htmlFor="slideThree"></label>
        </div>
      </section>
    );
  }
}
  
  class SelectPlayer extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      checked: this.props.checked
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(){
    this.setState({checked: this.state.checked === true ? false : true}, function(){
      this.props.selected(this.state.checked);
    });
  }

  render(){
    var display = this.props.display,
        displayClass;

    displayClass = display ? 'show' : 'hide';
    return(
      <div className={displayClass} id="selectplayer">
        <h2>Choose your side !</h2>
        <form>
          <div className="form-group">
            <label className="radio-inline">
              <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="x" checked={!this.props.checked} onChange={this.handleChange} /> X
            </label>
          </div>
          <div className="form-group">
            <label className="radio-inline">
              <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="o" checked={this.props.checked} onChange={this.handleChange} /> O
            </label>
          </div>
        </form>
      </div>
    );
  }
}
	
	// ReactDOM.render(<App />, document.getElementById('app'));


// transform [0,1,2,3] into [[0,1],[2,3]]
  function addDim(arr, dim){
    var arr_dim_2 = [];

    for (var i = 0; i < arr.length; i+=dim){
      var subarray = [];

      for (var j = i; j < i+dim; j++) {
        subarray.push(arr[j]);
      }
      arr_dim_2.push(subarray);
      //console.log(newArr);
    }

    return arr_dim_2;
  }

  // test if horizontal elements are equal, if used after permutation, test if vertical elements are equal
  function testAlignItems(arr_dim_2, turn){
    for (var i = 0; i < arr_dim_2.length; i++) {
      var result;

      result = arr_dim_2[i].every(function(a){
        return a === turn;
      });

      if (result) {
        return true;
      }
    }
  }

  // test if the diagonal elements are equal, if used after switched, test if the element of the second diagonal are equal
  function testDiagonalItems(arr_dim_2, turn){
    var result = [];

    for (var i = 0; i < arr_dim_2[0].length; i++) {
      for (var j = 0; j < arr_dim_2[0].length; j++) {
        if(i===j){
          result.push( arr_dim_2[i][j] === turn );
        }
      }
    }

    return result.every(function(a){
      return a;
    });
  }

  // transform [[0,1],[2,3]] into [[0,2],[1,3]], allows you to use the same method for horizontal and vertical testing
  function permutation(arr_dim_2){
    var result = [];

    for (var i = 0; i < arr_dim_2.length; i++) {
      for (var j = 0; j < arr_dim_2.length; j++) {

        result.push(arr_dim_2[j][i]);
      }
    }
    result = addDim(result, arr_dim_2.length);

    return result;
  }

  // transform [[0,1],[2,3]] into [[2,3],[0,1]]
  function switched(arr_dim_2){
    var result = [];

    for (var i = 0; i < arr_dim_2.length; i++) {
      result[i] = arr_dim_2[arr_dim_2.length - (i+1)];
    }

    return result;
  }

  // select a random position in the cell array :
  // first we create an array containing the keys of the emtpy cells into the cells array
  // then we select a random number in that array
  // return the index of an element if the element is not an empty string
  function isEmpty(el, i, arr){
    if(el === ''){
      return i;
    }
  }

  // remove the undefined values return by the map method
  function isDefined(el, i, arr){
    return el !== undefined;
  }
