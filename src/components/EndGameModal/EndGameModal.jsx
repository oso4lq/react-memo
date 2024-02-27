import { Button } from "../Button/Button";
import { Link } from "react-router-dom";
import { addScore } from "../../api";
import { useState } from "react";
import { useAchievements } from "../../context/AchievementContext";
import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import styles from "./EndGameModal.module.css";

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick }) {
  const currentDifficulty = localStorage.getItem("currentDifficulty");
  const { achievementsList } = useAchievements();

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
    addScore({ name: username, time: totalTimeInSeconds, achievements: achievementsList })
      .then(() => {
        alert("Score saved.");
        onClick();
      })
      .catch(error => {
        console.warn(error);
        alert("Failed to save score.");
      });
  };

  const title = isWon ? (currentDifficulty === "9" ? "You are on the leaderboard!" : "You won!") : "You lose!";

  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;

  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  return (
    <div className={styles.modal}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <div className={styles.title}>{title}</div>
      {isWon && currentDifficulty === "9" && (
        <input
          className={styles.input_user}
          type="text"
          value={username}
          onChange={handleUsername}
          placeholder="Enter your name"
        />
      )}
      {isWon && currentDifficulty === "9" && (
        <button className={styles.buttonmode_addscore} onClick={() => handleScore()}>
          Add your score
        </button>
      )}
      <p className={styles.description}>Time spent:</p>
      <div className={styles.time}>
        {gameDurationMinutes.toString().padStart("2", "0")}.{gameDurationSeconds.toString().padStart("2", "0")}
      </div>

      <Button onClick={onClick}>Play again</Button>
      <Link to="/">
        <Button>Return to main page</Button>
      </Link>
      {isWon && currentDifficulty === "9" && (
        <Link className={styles.title_leaderboard} to="/leaderboard">
          View leaderboard
        </Link>
      )}
    </div>
  );
}
