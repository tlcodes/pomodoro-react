import React, { Component } from 'react';
import './App.css';
import beep from './audio/beepbop.mp3'

// const BeepBop = function() {
//   return (
    
//   );
// }

class App extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      running: false,
      timerDisplay: 1500,
      sessionLength: 25,
      breakLength: 5,
      sessionTime: true,
      timerID: null
      // timerLabel: 'Session'
    }
    this.state = this.initialState;
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.startStop = this.startStop.bind(this);
    this.timer = this.timer.bind(this);    
    this.beep = '';
  }

  increment(length){
    if (this.state.running) {
      return;
    } 
    if (/session/.test(length.target.id)) {
      if (this.state.sessionLength === 60) {
        return;
      } else {
      this.setState({
        timerDisplay: (this.state.sessionLength + 1) * 60,
        sessionLength: this.state.sessionLength + 1,        
        });
      }
    } else {
      if (this.state.breakLength === 60) {
        return;
      } else {
      this.setState({
        breakLength: this.state.breakLength + 1,
        });
      }
    }
  }

  decrement(length){
    if (this.state.running) {
      return;
    } 
    if (/session/.test(length.target.id)) {
      if (this.state.sessionLength === 1) {
        return;
      } else {
      this.setState({
        timerDisplay: (this.state.sessionLength - 1 ) * 60,
        sessionLength: this.state.sessionLength - 1     
        });
      }
    } else {
      if (this.state.breakLength === 1) {
        return;
      } else {
      this.setState({
        breakLength: this.state.breakLength - 1,
        });
      }
    }
  }

  renderTime(time) {
    let minutes = Math.floor(time/60);
    let seconds = time%60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return minutes + ':' + seconds;
  }

  resetTimer() {
    this.setState(this.initialState);
    clearInterval(this.state.timerID);
    this.beep.pause();
    this.beep.currentTime = 0;
  }

  startStop() {
    // this.setState({running: !this.state.running});    
    if (this.state.timerID) {
      clearInterval(this.state.timerID);
      this.setState({running: false, timerID: null});
      
    } else {
      this.setState({running: true});
      this.timer();
    } 
  }

  componentDidMount() {
    this.beep = document.getElementById('beep');
  }

  timer() {    
    this.setState({timerID: setInterval(function() {        
      if (this.state.sessionTime) {
        this.setState({ timerDisplay: this.state.timerDisplay - 1 });
        if (this.state.timerDisplay < 0) {
          this.beep.currentTime = 0;
          this.beep.play();
          this.setState({sessionTime: false, timerDisplay: this.state.breakLength * 60});            
        }        
      } else {
        this.setState({timerDisplay: this.state.timerDisplay - 1});
        if (this.state.timerDisplay < 0) {
          this.beep.currentTime = 0;
          this.beep.play();
          this.setState({sessionTime: true, timerDisplay: this.state.sessionLength * 60});
        }
      }
    }.bind(this), 1000)});
  }

  render() {
    const sessionTime = this.state.sessionTime;
    return (
      <div id="pomodoro">        
        <p id="timer-label">{sessionTime ? 'Session' : 'Break'}</p>
        <div id="timer">                        
          <button id="start_stop" onClick={this.startStop}>{this.state.running ? '\u2225' :'\u25b6'}</button>
          <span id="time-left">{this.renderTime(this.state.timerDisplay)}</span>
          <button id="reset" onClick={this.resetTimer}>{'\u21ba'}</button>
        </div>

        <div id="controls">
          <div id="break">
            <p id="break-label">Break Length</p>
            <button id="break-decrement" onClick={this.decrement}>{'\u25be'}</button>
            <span id="break-length">{this.state.breakLength}</span>
            <button id="break-increment" onClick={this.increment}>{'\u25b4'}</button>            
          </div>
          <div id="session">
            <p id="session-label">Session Length</p>
            <button id="session-decrement" onClick={this.decrement}>{'\u25be'}</button>
            <span id="session-length">{this.state.sessionLength}</span>
            <button id="session-increment" onClick={this.increment}>{'\u25b4'}</button>            
          </div>
      </div>
      {/* <BeepBop /> */}
      <audio id="beep" type="audio/mp3" src={beep}></audio>
    </div>
    
    );
  }
}

export default App;
