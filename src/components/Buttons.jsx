import styles from "./Button.module.css";
function Buttons({ children, onClick, type }) {
  return (
    <button onClick={onClick} className={`${styles.btn}  ${styles[type]}`}>
      {children}
    </button>
  );
}

export default Buttons;
