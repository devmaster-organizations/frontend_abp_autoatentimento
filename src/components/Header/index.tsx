import styles from './styles.module.css'

const Header = () => {
  return (
    <header className={styles.header}>
      <button className={styles.menuButton} type="button" aria-label="Abrir menu">
        <span />
        <span />
        <span />
      </button>
      <h1>FATEC</h1>
      <nav className={styles.nav}>
        <span>Envie suas duvidas</span>
      </nav>
    </header>
  )
}

export default Header
