import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { Button } from "../../components/Button/Button";
import { useContext } from "react";
import { ModeContext } from "../../context/ModeContext";

export function SelectLevelPage() {
  const { isEnabled, setIsEnabled } = useContext(ModeContext);

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Choose difficulty</h1>
        <ul className={styles.levels}>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/3">
              1
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/6">
              2
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/9">
              3
            </Link>
          </li>
        </ul>

        <Button onClick={() => setIsEnabled(!isEnabled)}>Enable easy mode</Button>
        {isEnabled === true && <div className={styles.active}></div>}
        {isEnabled === false && <div className={styles.inactive}></div>}
      </div>
    </div>
  );
}
