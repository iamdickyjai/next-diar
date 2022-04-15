import React from 'react';
import { Switch } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';
import cn from 'classnames';

import styles from '../styles/Navbar.module.css'
import { ThemeContext } from './reducer';

export default function Navbar() {
  const { theme, setTheme } = React.useContext(ThemeContext);

  const handleChange = (event) => {
    if (theme === "light") {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }

  return (
    <div className={cn(styles.container, { [styles.containerLight]: theme === 'light' })}>
      <div className={cn(styles.title, { [styles.titleLight]: theme === 'light' })}>Diarization Application</div>

      <div className={styles.themeWrapper}>
        <FontAwesomeIcon icon={faCircleHalfStroke} className={styles.icon} />
        <Switch checked={theme === 'light' ? false : true} onChange={handleChange} />
      </div>

      {theme === 'light' && <style jsx global>{`
        html, body {
          background-color: white;;
        }
      `}</style>}
    </div>
  )
}