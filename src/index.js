import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
    
      return (
        <button className="square" style={{color: props.borderstyle}}
        onClick={props.onClick}
        >
        {props.value}
        </button>
      );
    }
  
  class Board extends React.Component {

    keyInWinner(key, winner){
      console.log(winner);
     const [a,b,c] = winner;
     if(key === a || key === b || key === c)
     return true;
     return false;
    }

    renderSquare(i) {
    
      const style = this.keyInWinner(i, this.props.winner) ? "red": "black";
      console.log(style);
      return <Square key={i} className="sqaure"  value={this.props.squares[i]} borderstyle={style} 
      onClick={() => this.props.onClick(i)} />;
    }
  
    renderRow(k) {
      let row = [];
      for(let j=0; j< 3; j++){
        const v = (3*k+j);

        row.push(this.renderSquare(v));      
    }
    return row;
  }


    render() { 

      let column = [];
        for (let i =0; i<3; i++){
           column.push(
              <div key ={i} className="board-row">
                {this.renderRow(i, this.props.winner)}
              </div>);
          }
          return (<div>{column}</div>);
        }

      }
  class Game extends React.Component {
      constructor(props){
          super(props);
          this.state ={
              history: [{
                  squares: Array(9).fill(null),
                  squareNumber: 0,           
                  }],
              stepNumber: 0,
              xIsNext: true,
             sortOrder: true,// for ascending
          }
      }
          
    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber+1);

        const current = history[history.length -1];
        const squares = current.squares.slice();


        if(calculateWinner(squares).winner || squares[i]) return;

        squares[i] =this.state.xIsNext? 'X': 'O';

        this.setState({
          history : history.concat([{
            squares: squares,
            squareNumber: i,
          }]),
          stepNumber: history.length,         
          xIsNext: !this.state.xIsNext,
          sortOrder: this.state.sortOrder,
    });
    }
    jumpTo(step){
        console.log("jumped to" +step);
       // const currentStep  = this.state.stepNumber;
        this.setState({
            //stepNumber: this.state.sortOrder ? step : this.state.history[currentStep - step],
            stepNumber: step,
            xIsNext: (step%2) === 0,
        });
    }
    toggle(){
      this.setState({
        sortOrder : !this.state.sortOrder
    });
    }
    
    setWinner(line){
      this.setState({
        winningLine: line
      })
    }
    render() {

      const history = this.state.history;
      const reverseHistory = history.slice().reverse();


      const currentStep = this.state.stepNumber;
      const current = history[currentStep];
      const winner =
      calculateWinner(current.squares).winner;
      let line = calculateWinner(current.squares).line ? calculateWinner(current.squares).line: [-1,-1,-1];
      //this.setWinner(line);
      console.log(line);
      
      
      const useHistory = this.state.sortOrder ? history : reverseHistory;

      const moves = useHistory.map((step, move) => {
        // For position
        const revMove = history.length - move -1;
        //console.log("revmove" + revMove);
        const coord =  step.squareNumber; //this.state.sortOrder ? step.squareNumber : history[revMove].squareNumber;

         const cold = coord % 3;
         const rowd = Math.floor(coord / 3);
        // console.log(step);
        // console.log(step.squareNumber);

         // for sort order
         
         
         const revDesc =  revMove ? 
         `Go to move #${revMove}(${cold},${rowd})`:
          'Go to game start';

          const desc = move ? 
         `Go to move #${move}(${cold},${rowd})`:
          'Go to game start';
          
          const moveId =  this.state.sortOrder ? move : revMove;
          const display = this.state.sortOrder ? desc : revDesc;
          return(
           <li key ={moveId}>
               <button style ={{fontWeight: (moveId === this.state.stepNumber ? 'bold': 'normal')}} onClick={() =>
               {
               this.jumpTo(moveId)
              }
            }
               >{display}</button>
           </li>           
          );
      });
      let status;
      if(winner){
          status='Winner: '+ winner;
      }
      else{
          status = 'Next player: '+
          (this.state.xIsNext? 'X' : 'O');
          if(isMatchADraw(current.squares))
          status = "Match drawn!";
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={line}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
          <div><button onClick={()=>{this.toggle()}}>Toggle</button></div>          
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  function calculateWinner(squares) {
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
    const winnerDeets = {winner: null, line: null };
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {winner: squares[a], line: lines[i]};
      }
    }
    return winnerDeets;
  }
  function isMatchADraw(squares){

    for(let i=0;i<9;i++){
      if(squares[i] == null)
      return false;
    }
    return true;
  }