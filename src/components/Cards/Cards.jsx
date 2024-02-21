import { shuffle } from "lodash";
import { useContext, useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { ModeContext } from "../../context/ModeContext";

const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
const STATUS_PREVIEW = "STATUS_PREVIEW";

function getTimerValue(startDate, endDate) {
  if (!startDate && !endDate) {
    return {
      minutes: 0,
      seconds: 0,
    };
  }

  if (endDate === null) {
    endDate = new Date();
  }

  const diffInSecconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  const minutes = Math.floor(diffInSecconds / 60);
  const seconds = diffInSecconds % 60;
  return {
    minutes,
    seconds,
  };
}

export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  const { isEnabled } = useContext(ModeContext);
  const [cards, setCards] = useState([]);
  const [status, setStatus] = useState(STATUS_PREVIEW);

  const [gameStartDate, setGameStartDate] = useState(null);
  const [gameEndDate, setGameEndDate] = useState(null);

  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });

  function finishGame(status = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(status);
  }
  function startGame() {
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
  }
  function resetGame() {
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
    // sets attepmts for new game
    setAttempts(isEnabled ? 3 : 1);
  }

  //  Attempts
  const maxAttempts = isEnabled ? 3 : 1;
  const [attempts, setAttempts] = useState(maxAttempts);
  const handleAttempts = e => {
    e--;
    setAttempts(e);
    if (e <= 0) {
      finishGame(STATUS_LOST);
    }
  };

  const openCard = clickedCard => {
    if (clickedCard.open) {
      return;
    }
    const nextCards = cards.map(card => {
      if (card.id !== clickedCard.id) {
        return card;
      }
      return {
        ...card,
        open: true,
      };
    });

    setCards(nextCards);

    const isPlayerWon = nextCards.every(card => card.open);

    if (isPlayerWon) {
      finishGame(STATUS_WON);
      return;
    }

    const openCards = nextCards.filter(card => card.open);

    const openCardsWithoutPair = openCards.filter(card => {
      const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);

      if (sameCards.length < 2) {
        return true;
      }

      return false;
    });

    // lose attempt if picked without pair
    const pickedWrong = openCardsWithoutPair.length >= 2;
    if (pickedWrong) {
      handleAttempts(attempts);
      // and flip over the cards if the easy mode is enabled
      if (isEnabled) {
        setTimeout(() => {
          const resetCards = nextCards.map(card => ({
            ...card,
            open: false,
          }));
          setCards(resetCards);
        }, 1000);
      }
      return;
    }
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  useEffect(() => {
    if (status !== STATUS_PREVIEW) {
      return;
    }

    if (pairsCount > 36) {
      alert("Impossible to make this amount of pairs");
      return;
    }

    setCards(() => {
      return shuffle(generateDeck(pairsCount, 10));
    });

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [status, pairsCount, previewSeconds]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer(getTimerValue(gameStartDate, gameEndDate));
    }, 300);
    return () => {
      clearInterval(intervalId);
    };
  }, [gameStartDate, gameEndDate]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div>
              <p className={styles.previewText}>Memorize the pairs!</p>
              <p className={styles.previewDescription}>Game will start in {previewSeconds} seconds</p>
            </div>
          ) : (
            <>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>min</div>
                <div>{timer.minutes.toString().padStart("2", "0")}</div>
              </div>
              .
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{timer.seconds.toString().padStart("2", "0")}</div>
              </div>
            </>
          )}
        </div>
        {status === STATUS_IN_PROGRESS ? (
          <div className={styles.bar}>
            {/* ATTEMPTS */}
            <p className={styles.attempts_txt}>attempt: </p>
            <p className={styles.attempts_counter}>
              {attempts} / {maxAttempts}
            </p>
            <Button onClick={resetGame}>Start again</Button>
          </div>
        ) : null}
      </div>

      <div className={styles.cards}>
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
            open={status !== STATUS_IN_PROGRESS ? true : card.open}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
      </div>

      {isGameEnded ? (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={status === STATUS_WON}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            onClick={resetGame}
          />
        </div>
      ) : null}
    </div>
  );
}
