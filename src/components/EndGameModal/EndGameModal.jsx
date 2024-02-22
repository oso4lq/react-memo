import styles from "./EndGameModal.module.css";

import { Button } from "../Button/Button";

import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { Link } from "react-router-dom";
import { addScore } from "../../api";
import { useState } from "react";

export function EndGameModal({ isLeader, isWon, gameDurationSeconds, gameDurationMinutes, onClick }) {
  const [username, setUsername] = useState("");
  const handleUsername = e => {
    setUsername(e.target.value);
  };
  const handleScore = () => {
    if (username.trim() === "") {
      alert("Please enter your name.");
      console.log("username not set. using default value: 'user'");
      setUsername("user");
      return;
    }
    const totalTimeInSeconds = gameDurationMinutes * 60 + gameDurationSeconds;
    addScore({ name: username, time: totalTimeInSeconds })
      .then(() => {
        alert("Score saved.");
        onClick();
      })
      .catch(error => {
        console.warn(error);
        alert("Failed to save score.");
      });
  };

  // const iSleader = true;

  const title = isLeader ? "You're on the leaderboard!" : isWon ? "You won!" : "You lose!";

  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;

  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  return (
    <div className={styles.modal}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <h2 className={styles.title}>{title}</h2>
      {isWon ? (
        <input
          className={styles.input_user}
          type="text"
          value={username}
          onChange={handleUsername}
          placeholder="Enter your name"
        />
      ) : (
        ""
      )}
      {isWon ? (
        <button className={styles.buttonmode_addscore} onClick={() => handleScore()}>
          Add your score
        </button>
      ) : (
        ""
      )}
      <p className={styles.description}>Time spent:</p>
      <div className={styles.time}>
        {gameDurationMinutes.toString().padStart("2", "0")}.{gameDurationSeconds.toString().padStart("2", "0")}
      </div>

      <Button onClick={onClick}>Play again</Button>
      <Link to="/">
        <Button>Return to main page</Button>
      </Link>
      {isWon ? (
        <Link className={styles.title_leaderboard} to="/leaderboard">
          View leaderboard
        </Link>
      ) : (
        ""
      )}
    </div>
  );
}
