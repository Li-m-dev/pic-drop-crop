import React, { Component } from "react";
import ImgDropAndCrop from "./ImgDropAndCrop";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <ImgDropAndCrop />
      </div>
    );
  }
}

export default App;
