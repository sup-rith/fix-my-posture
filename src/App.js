import React from 'react';
import './App.css';
import Video from './Video';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Instructions: </h1>
        <ol>
          <li>Back straight </li>
          <li>Clinch shoulders back </li>
          <li>Keep chin up </li>
          <li>Get in good posture</li>
          <li>Press Start</li>
        </ol>
        <Video/>
      </header>
    </div>
  );
}

export default App;
