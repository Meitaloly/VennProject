import React, { Component } from 'react';
import './App.css';
import ImageGallery from './Components/ImageGallery'

class App extends Component {
  render() {
    return (
      <div className="App" id="MainApp">
        <ImageGallery />
      </div>
    );
  }
}

export default App;
