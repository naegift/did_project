import axios from "axios";
import { useState } from "react";

function App() {
  // 통신 테스트
  const [display, setDisplay] =
    useState(null);

  const activate = async () => {
    const response = await axios.get(
      "http://localhost:4000/"
    );
    console.log(response);
    setDisplay(response.data);
  };

  return (
    <div className="App">
      <button onClick={activate}>
        Check
      </button>
      <div>{display}</div>
    </div>
  );
}

export default App;
