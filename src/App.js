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
      currentRequest: null,
    };
    this.onChange = this.onChange.bind(this);
    this.submitCode = this.submitCode.bind(this);
    this.pollForStatus = this.pollForStatus.bind(this);
  }

  onChange(currentCode, event) {
    this.setState({
      code: currentCode,
    });
  }

  pollForStatus = (count) => {
    if (count > 20) {
      alert("Timeout!");
      return;
    }

    let taskData = this.state.currentRequest;

    axios
      .get("http://localhost:5100/status", {
        params: { taskID: taskData["id"] },
      })
      .then(({ data }) => {
        console.log(data);

        this.setState({
          currentRequest: data,
        });

        if (this.state.currentRequest["status"] !== 2) {
          setTimeout(() => {
            this.pollForStatus(count + 1);
          }, 500);
        } else {
          console.log("Task complete!");
        }
      })
      .catch((err) => {
        throw err;
      });
  };

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
      .then(({ data }) => {
        console.log(data);
        this.setState({
          currentRequest: data,
        });
        console.log(this.state);
        this.pollForStatus(0);
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
          <hr />
          <div>
            {this.state.currentRequest &&
            this.state.currentRequest["status"] !== 2
              ? "Running task"
              : "Task Completed!"}
          </div>
          <div>
            {this.state.currentRequest &&
            this.state.currentRequest["status"] === 2
              ? this.state.currentRequest["output"]
              : ""}
          </div>
          <div>
            {this.state.currentRequest &&
            this.state.currentRequest["status"] === 2
              ? (new Date(this.state.currentRequest["completedAt"]).getTime() -
                new Date(this.state.currentRequest["startedAt"]).getTime()).toString() + "ms"
              : ""}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
