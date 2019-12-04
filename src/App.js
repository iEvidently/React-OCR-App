import React, { Component } from 'react';
import './App.css';
import Form from './components/Form'

class App extends Component {

  render() {
    return (
      <div className="app">
        <header className="header">
          <h1>Receiving Form</h1>
          <Form />
        </header>
      </div>
    )
  }
}

export default App
