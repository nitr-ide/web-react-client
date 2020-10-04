import React, { Component } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/ext-language_tools";
import "./App.css";

import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
    };
    this.onChange = this.onChange.bind(this);
    this.submitCode = this.submitCode.bind(this);
  }

  onChange(currentCode, event) {
    this.setState({
      code: currentCode,
    });
  }

  submitCode() {
    const requestBody = JSON.stringify({
      language: "cpp",
      code: this.state.code,
    });

    axios
      .post("http://localhost:5000/run", requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        throw err;
      });

    console.log("submitting", requestBody);
  }

  render() {
    return (
      <div className="ide-container">
        <AceEditor
          mode="c_cpp"
          theme="monokai"
          height="100%"
          width="75%"
          fontSize="20px"
          onChange={this.onChange}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
          }}
          showPrintMargin={false}
        />
        <div className="options-container">
          <button onClick={this.submitCode}>Submit</button>
        </div>
      </div>
    );
  }
}

export default App;
