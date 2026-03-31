import styles from './styles.module.css'
import Link from 'next/link'

const Header = () => {
  return (
    <header className={styles.header}>
      <h1>Autoatendimento</h1>
      <nav className={styles.nav}>
        <Link href="/about">Sobre</Link>
        <Link href="/questions">Perguntas</Link>
        <Link href="/usuarios">Usuários</Link>
      </nav>
    </header>
  )
}

export default Header