import styles from '../styles/Navbar.module.css'

export default function Navbar() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Diarization Application</div>
      <div onClick={testing} className={styles.settingBtn}>Setting</div>
    </div>
  )
}

function testing() {
  console.log("Hwllo world");
}