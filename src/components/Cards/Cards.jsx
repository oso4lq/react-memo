import { shuffle } from "lodash";
import { generateDeck } from "../../utils/cards";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { useContext, useEffect, useState } from "react";
import { ModeContext } from "../../context/ModeContext";
import { useAchievements } from "../../context/AchievementContext";
import styles from "./Cards.module.css";

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

  const diffInSeconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  const minutes = Math.floor(diffInSeconds / 60);
  const seconds = diffInSeconds % 60;
  return {
    minutes,
    seconds,
  };
}

export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  const { isEnabled } = useContext(ModeContext);
  const { achievementsList, addAchievement, resetAchievements } = useAchievements();
  const [cards, setCards] = useState([]);
  const [status, setStatus] = useState(STATUS_PREVIEW);
  const [gameStartDate, setGameStartDate] = useState(null);
  const [gameEndDate, setGameEndDate] = useState(null);
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });
  const maxAttempts = isEnabled ? 3 : 1;
  const [attempts, setAttempts] = useState(maxAttempts);
  const [guessedPairsCount, setGuessedPairsCount] = useState(0);

  // defies the guessed pairs amount
  useEffect(() => {
    if (cards && status === STATUS_IN_PROGRESS) {
      const pairs = cards.filter(e => e.guessed).length;
      if (pairs % 2 === 0) {
        setGuessedPairsCount(pairs / 2);
      }
    }
  }, [cards, status]);

  // "superpower" logics start
  const [isXRay, setIsXRay] = useState(false);
  const [isXRayActive, setIsXRayActive] = useState(false);
  const [isTimerStop, setIsTimerStop] = useState(false);
  const [isAlohomora, setIsAlohomora] = useState(false);

  // X-Ray: makes cards visible for 5 secs
  const xRay = () => {
    setIsTimerStop(true);
    if (isXRay) {
      return;
    }
    // disables alohomora function while xray is active
    setIsXRayActive(true);
    setCards(prevCards => {
      return prevCards.map(card => {
        return {
          ...card,
          open: true,
        };
      });
    });
    setTimeout(() => {
      setCards(prevCards => {
        return prevCards.map(card => {
          if (card.guessed) {
            return {
              ...card,
              open: true,
            };
          }
          return {
            ...card,
            open: false,
          };
        });
      });
      setIsXRayActive(false);
      setIsXRay(true);
      setIsTimerStop(false);
      let newDate = new Date(gameStartDate);
      newDate.setSeconds(newDate.getSeconds() + 5);
      setGameStartDate(newDate);
    }, 5000);
  };

  // Alohomora: opens one correct pair of cards or a pair for one opened card
  const alohomora = () => {
    if (isXRayActive) {
      return;
    }
    const cardsNotGuessed = cards.filter(cards => !cards.guessed);
    let firstCard = cardsNotGuessed.find(card => card.open);
    let secondCard;

    if (firstCard) {
      secondCard = cards.find(
        card => card.rank === firstCard.rank && card.suit === firstCard.suit && card.id !== firstCard.id,
      );
    } else {
      let randomIndex = Math.floor(cardsNotGuessed.length * Math.random());
      firstCard = cardsNotGuessed[randomIndex];
      secondCard = cardsNotGuessed.find(card => card.rank === firstCard.rank && card.suit === firstCard.suit);
    }

    if (firstCard && secondCard) {
      const nextCards = cards.map(card => {
        if (secondCard.id === card.id || firstCard.id === card.id) {
          return {
            ...card,
            open: true,
            guessed: true,
          };
        }
        return card;
      });

      setCards(nextCards);
      setIsAlohomora(true);
    }
  };
  // superpower logics end

  // added setguessedpairscount to all functions below
  function finishGame(status = STATUS_LOST) {
    console.log("finish ", achievementsList);
    setGameEndDate(new Date());
    setStatus(status);
    setGuessedPairsCount(0);

    if (status === STATUS_WON) {
      // added check for achievements
      if (!isAlohomora && !isXRay) {
        addAchievement(1);
      }
      if (!isEnabled) {
        addAchievement(2);
      }
    }
  }

  function startGame() {
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
    setGuessedPairsCount(0);
    resetAchievements();
    setIsXRay(false);
    setIsAlohomora(false);
  }

  function resetGame() {
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
    setAttempts(isEnabled ? 3 : 1);
    setGuessedPairsCount(0);
    resetAchievements();
    setIsXRay(false);
    setIsAlohomora(false);
  }

  // decreases attempts on player's mistake
  const handleAttempts = () => {
    const updatedAttempts = attempts - 1;
    setAttempts(updatedAttempts);
    if (updatedAttempts <= 0) {
      finishGame(STATUS_LOST);
    }
  };

  // main game logics
  const openCard = clickedCard => {
    if (clickedCard.open || status !== STATUS_IN_PROGRESS) {
      return;
    }

    const openCards = cards.filter(card => card.open && !card.guessed);

    if (openCards.length >= 2) {
      return;
    }

    const nextCards = cards.map(card => {
      if (card.id === clickedCard.id || card.guessed) {
        return {
          ...card,
          open: true,
        };
      }
      return card;
    });
    setCards(nextCards);

    const openPairs = nextCards.filter(card => card.open && !card.guessed);
    const guessedPairs = openPairs.filter(card =>
      openPairs.some(openCard => card.id !== openCard.id && card.suit === openCard.suit && card.rank === openCard.rank),
    );

    if (guessedPairs.length === 2) {
      const updatedCards = nextCards.map(card => {
        if (guessedPairs.some(guessedCard => card.id === guessedCard.id)) {
          return {
            ...card,
            guessed: true,
          };
        }
        return card;
      });
      setCards(updatedCards);
      const isPlayerWon = updatedCards.every(card => card.guessed);
      if (isPlayerWon) {
        finishGame(STATUS_WON);
      }
    } else if (openPairs.length === 2) {
      handleAttempts();
      setTimeout(() => {
        const resetCards = nextCards.map(card => {
          if (!card.guessed) {
            return {
              ...card,
              open: false,
            };
          }
          return card;
        });
        setCards(resetCards);
      }, 1000);
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
    // eslint-disable-next-line
    // eslint-disable-next-line
  }, [status, pairsCount, previewSeconds]);

  // added stopping the timer on x-ray use
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isTimerStop) {
        return;
      }
      setTimer(getTimerValue(gameStartDate, gameEndDate));
    }, 300);
    return () => {
      clearInterval(intervalId);
    };
  }, [gameStartDate, gameEndDate, isTimerStop]);

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
            {/* Superpower buttons start */}
            <div className={styles.bar_element}>
              <button
                title="Alohomora: opens a random pair of cards."
                disabled={isAlohomora || isXRayActive}
                onClick={alohomora}
                className={styles.alohomora}
              >
                <svg viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="68" height="68" rx="34" fill="#C2F5FF" />
                  <rect
                    x="31.7295"
                    y="9"
                    width="24.9566"
                    height="34.761"
                    rx="2"
                    transform="rotate(15 31.7295 9)"
                    fill="url(#paint0_linear_2501_2)"
                    stroke="#E4E4E4"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M38.5302 33.4852C38.4143 33.3327 38.2972 33.1797 38.1797 33.0262C36.5408 30.8843 34.8288 28.6471 35.3027 26.6581C35.8981 24.6731 37.4389 24.3711 38.6234 24.6885C39.3167 24.8742 40.0048 25.4818 40.4186 26.3021C41.1243 25.7818 41.9569 25.5817 42.6502 25.7675C43.8346 26.0849 45.1365 27.1485 44.6596 29.1653C44.0534 31.1989 41.3849 32.3165 38.8199 33.3908C38.7345 33.4265 38.6492 33.4622 38.5641 33.4979C38.558 33.5006 38.552 33.5032 38.5459 33.5058C38.5458 33.5057 38.5458 33.5057 38.5458 33.5056C38.5457 33.5057 38.5456 33.5057 38.5455 33.5057C38.5404 33.4989 38.5352 33.492 38.5302 33.4852Z"
                    fill="#FF4545"
                  />
                  <rect
                    x="9.80664"
                    y="24.6251"
                    width="24.9566"
                    height="34.761"
                    rx="2"
                    transform="rotate(-15 9.80664 24.6251)"
                    fill="white"
                    stroke="#E4E4E4"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M25.1215 35.4952C24.353 34.9918 23.4534 34.8097 22.7601 34.9955C21.5757 35.3129 20.3923 36.3448 20.8692 38.3615C21.4533 40.321 24.0545 41.4026 26.5447 42.438C26.7244 42.5127 26.9035 42.5872 27.0812 42.6617C27.0879 42.6646 27.0945 42.6675 27.1012 42.6703C27.1013 42.6702 27.1013 42.6702 27.1013 42.6701C27.1014 42.6702 27.1015 42.6702 27.1016 42.6703C27.1076 42.6624 27.1135 42.6545 27.1193 42.6466C27.1732 42.5756 27.2272 42.5046 27.2813 42.4335C28.9656 40.2207 30.7177 37.9186 30.2259 35.8543C29.6306 33.8693 27.9713 33.5991 26.7868 33.9164C26.0935 34.1022 25.4725 34.6918 25.1215 35.4952Z"
                    fill="#FF4545"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_2501_2"
                      x1="41.9795"
                      y1="17.0218"
                      x2="32.1751"
                      y2="25.0435"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="white" />
                      <stop offset="1" stopColor="#F0F0F0" />
                    </linearGradient>
                  </defs>
                </svg>
              </button>
              <button
                disabled={isXRay}
                title="X-Ray: open all closed cards and stops the timer for 5 seconds."
                className={styles.xray}
                onClick={xRay}
              >
                <svg viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="68" height="68" rx="34" fill="#C2F5FF" />
                  <path
                    d="M6.06365 35.2703L6.06519 35.273C11.8167 45.1958 22.5591 51.3889 34 51.3889C45.4394 51.3889 56.1832 45.2593 61.9355 35.2718L61.9363 35.2703L62.4341 34.3992L62.5759 34.1511L62.4341 33.903L61.9364 33.0319L61.9348 33.0293C56.1833 23.1064 45.4409 16.9133 34 16.9133C22.5591 16.9133 11.8167 23.1064 6.06519 33.0293L6.06518 33.0293L6.06366 33.0319L5.56588 33.903L5.42412 34.1511L5.56588 34.3992L6.06366 35.2703L6.06365 35.2703Z"
                    fill="white"
                    stroke="#E4E4E4"
                  />
                  <mask id="mask0_3_5610" maskUnits="userSpaceOnUse" x="6" y="17" width="56" height="34">
                    <path
                      d="M34 50.8889C22.7378 50.8889 12.16 44.7911 6.49778 35.0222L6 34.1511L6.49778 33.28C12.16 23.5111 22.7378 17.4133 34 17.4133C45.2622 17.4133 55.84 23.5111 61.5022 33.28L62 34.1511L61.5022 35.0222C55.84 44.8533 45.2622 50.8889 34 50.8889Z"
                      fill="white"
                    />
                  </mask>
                  <g mask="url(#mask0_3_5610)">
                    <g filter="url(#filter0_i_3_5610)">
                      <path
                        d="M34 50.8889C22.7378 50.8889 12.16 44.7911 6.49778 35.0222L6 34.1511L6.49778 33.28C12.16 23.5111 22.7378 17.4133 34 17.4133C45.2622 17.4133 55.84 23.5111 61.5022 33.28L62 34.1511L61.5022 35.0222C55.84 44.8533 45.2622 50.8889 34 50.8889Z"
                        fill="white"
                      />
                    </g>
                    <circle cx="34.3108" cy="26.1867" r="17.1111" fill="url(#paint0_linear_3_5610)" />
                    <path
                      d="M39.2891 26.3733C36.3646 26.3733 34.0002 24.0089 34.0002 21.0844C34.0002 20.0267 34.3113 18.9689 34.8713 18.16C34.5602 18.0978 34.2491 18.0978 34.0002 18.0978C29.3957 18.0978 25.7246 21.8311 25.7246 26.3733C25.7246 30.9778 29.4579 34.6489 34.0002 34.6489C38.6046 34.6489 42.2757 30.9156 42.2757 26.3733C42.2757 26.0622 42.2757 25.7511 42.2135 25.5022C41.4046 26.0622 40.4091 26.3733 39.2891 26.3733Z"
                      fill="url(#paint1_linear_3_5610)"
                    />
                  </g>
                  <defs>
                    <filter
                      id="filter0_i_3_5610"
                      x="6"
                      y="17.4133"
                      width="60"
                      height="35.4756"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dx="4" dy="2" />
                      <feGaussianBlur stdDeviation="3" />
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3_5610" />
                    </filter>
                    <linearGradient
                      id="paint0_linear_3_5610"
                      x1="34.3108"
                      y1="9.07556"
                      x2="34.3108"
                      y2="43.2978"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#004980" />
                      <stop offset="1" stopColor="#C2F5FF" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_3_5610"
                      x1="34.0002"
                      y1="18.0978"
                      x2="34.0002"
                      y2="34.6489"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#161616" />
                      <stop offset="1" stopColor="#0B004B" />
                    </linearGradient>
                  </defs>
                </svg>
              </button>
            </div>
            {/* Superpower buttons end */}
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
            disabled={card.disabled}
          />
        ))}
      </div>

      <div className={styles.footer_box}>
        {/* attempts counter moved here */}
        <div className={styles.bar_element}>
          {isEnabled ? <p className={styles.attempts_txt}>attempt: </p> : ""}
          {isEnabled ? (
            <p className={styles.attempts_counter}>
              {attempts} / {maxAttempts}
            </p>
          ) : (
            ""
          )}
        </div>
        {/* added guessed cards counter */}
        <p className={styles.attempts_txt}>Guessed pairs: {guessedPairsCount}</p>
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
