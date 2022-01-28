import React from "react";
import "./App.css";
import { useRandom } from "./hooks/random";
import { useTimer } from "./hooks/timer";

function App() {
  // first generate a random number
  const randomNumber = useRandom();

  // get seconds left until next random number will be generated
  const timer = useTimer(randomNumber);

  console.info("app render");
  return (
    <div className="App">
      <p>Random number: {randomNumber}</p>
      <p>New random number in: {timer} seconds.</p>
    </div>
  );
}

export default App;
