import styles from "./ButtonMode.module.css";

export function ButtonMode({ children, onClick }) {
  return (
    <button onClick={onClick} className={styles.buttonmode}>
      {children}
    </button>
  );
}
