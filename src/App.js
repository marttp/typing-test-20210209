import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const getTextList = () =>
  `ear tree stake section polish timber funny sunrise revive sword twilight warning repeat satisfaction meadow addicted charter bear soak isolation composer mosque compartment lace convenience conglomerate intermediate swim appendix safety hunting wear candle credibility frank`
    .split(' ')
    .sort(() => (Math.random > 0.5 ? 1 : -1));

function Word(props) {
  const { text, active, correct } = props;
  const rerender = useRef(0);

  useEffect(() => {
    rerender.current += 1;
  });

  if (correct === true) {
    return <span className="correct">{text} </span>;
  }
  if (correct === false) {
    return <span className="incorrect">{text} </span>;
  }
  if (active) {
    return <span className="active">{text} </span>;
  }
  return <span>{text} </span>;
}

Word = React.memo(Word);

function Timer(props) {
  const { correctWords, startCounting } = props;
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let id;
    if (startCounting) {
      id = setInterval(() => {
        // Do something
        setTimeElapsed((oldTime) => oldTime + 1);
      }, 1000);
    }

    return () => {
      clearInterval(id);
    };
  }, [startCounting]);

  const minutes = timeElapsed / 60;

  return (
    <div>
      <p>
        <b>Time:</b> {timeElapsed}
      </p>
      <p>
        <b>Speed:</b> {(correctWords / minutes || 0).toFixed(2)} WPM
      </p>
    </div>
  );
}

const App = () => {
  const [userInput, setUserInput] = useState('');

  const list = useRef(getTextList());
  const [startCounting, setStartCounting] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [correctWordArray, setCorrectWordArray] = useState([]);

  function processInput(value) {
    if (!startCounting) {
      setStartCounting(true);
    }

    if (activeWordIndex === list.current.length) {
      // Stop
      return;
    }

    if (value.endsWith(' ')) {
      if (activeWordIndex === list.current.length - 1) {
        // overflow
        setUserInput('Completed');
        setStartCounting(false);
      } else {
        setUserInput('');
      }

      setActiveWordIndex((index) => index + 1);
      setCorrectWordArray((data) => {
        const word = value.trim();
        const newResult = [...data];
        newResult[activeWordIndex] = word === list.current[activeWordIndex];
        return newResult;
      });
    } else {
      setUserInput(value);
    }
  }

  return (
    <div className="App">
      <h1>Typing Test</h1>
      <Timer
        startCounting={startCounting}
        correctWords={correctWordArray.filter(Boolean).length}
      />
      <p>
        {list.current.map((word, index) => {
          return (
            <Word
              text={word}
              active={index === activeWordIndex}
              correct={correctWordArray[index]}
            />
          );
        })}
      </p>
      <input
        placeholder="Start typing..."
        type="text"
        value={userInput}
        onChange={(e) => processInput(e.target.value)}
      />
    </div>
  );
};

export default App;
