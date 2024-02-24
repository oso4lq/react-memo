import { Link, useNavigate } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { Button } from "../../components/Button/Button";
import { useContext, useEffect, useState } from "react";
import { ModeContext } from "../../context/ModeContext";
import { ButtonMode } from "../../components/Button/ButtonMode";

export function SelectLevelPage() {
  const { isEnabled, setIsEnabled } = useContext(ModeContext);
  const [difficulty, setDifficulty] = useState("3");
  // sends props for leaderboard
  // const [isLeader, setIsLeader] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedEasyMode = localStorage.getItem("easyMode");
    if (savedEasyMode !== null) {
      setIsEnabled(savedEasyMode === "true");
    }
  }, [setIsEnabled]);

  const gameStart = () => {
    localStorage.setItem("easyMode", isEnabled.toString());

    // setIsLeader(difficulty === "9");

    navigate(`/game/${difficulty}`);
  };

  const difficulties = [
    {
      id: 1,
      pairs: 3,
    },
    {
      id: 2,
      pairs: 6,
    },
    {
      id: 3,
      pairs: 9,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Choose difficulty</h1>

        <ul className={styles.levels}>
          {difficulties.map(e => (
            <li key={e.id} className={styles.level}>
              <button
                type="button"
                id={e.id}
                className={`${difficulty === e.id ? styles._selected_difficulty : ""} ${styles.levelLink}`}
                onClick={() => setDifficulty(e.pairs)}
              >
                {e.id}
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.mode_box}>
          <ButtonMode onClick={() => setIsEnabled(!isEnabled)}>Enable easy mode</ButtonMode>
          {isEnabled === true && <div className={styles.active}></div>}
          {isEnabled === false && <div className={styles.inactive}></div>}
        </div>

        <Button onClick={gameStart}>Play</Button>

        <Link className={styles.title_leaderboard} to="/leaderboard">
          View leaderboard
        </Link>
      </div>
    </div>
  );
}
