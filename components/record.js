import styles from '../styles/Record.module.css';

export default function Record(props) {
  const timestamp = props.timestamp;
  const playHandler = props.playHandler;

  const play = () => {
    playHandler(timestamp[0], timestamp[1]);
  }

  return (
    <div className={styles.container}>
      <span className={styles.index}>#1</span>
      <button onClick={play}>Play</button>
      <input type='text' className={styles.input} />
    </div>
  )
}