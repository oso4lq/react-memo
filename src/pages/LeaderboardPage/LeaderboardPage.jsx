import { Link } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import styles from "./LeaderboardPage.module.css";
import { useEffect, useState } from "react";
import { getScores } from "../../api";

export function LeaderboardPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scores, setScores] = useState([]);
  useEffect(() => {
    getScores()
      .then(data => {
        const sortedScores = [...data];
        sortedScores.sort((a, b) => a.time - b.time);
        setScores(sortedScores);
      })
      .catch(error => {
        console.warn(error);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.headerh1}>Leaderboard</h1>
        <h4 className={styles.headerh4}>Best scores on difficulty 3</h4>
        <Link to="/">
          <Button>Play</Button>
        </Link>
      </div>
      {isLoaded ? (
        <>
          <div className={styles.leaderboard_unit}>
            <div className={styles.leaderboard_ttl}>Position</div>
            <div className={styles.leaderboard_ttl}>User</div>
            <div className={styles.leaderboard_ttl}>Time</div>
          </div>
          {scores.map((e, index) => (
            <div key={e.id} className={styles.leaderboard_unit}>
              <div className={styles.leaderboard_text}>{index + 1}</div>
              <div className={styles.leaderboard_text}>{e.name}</div>
              <div className={styles.leaderboard_text}>{e.time}</div>
            </div>
          ))}
        </>
      ) : (
        <div>
          <p className={styles.leaderboard_ttl}>Loading...</p>
        </div>
      )}
    </div>
  );
}
