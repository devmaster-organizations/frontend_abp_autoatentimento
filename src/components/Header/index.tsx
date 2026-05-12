import styles from "./styles.module.css";

type HeaderProps = {
  onBackHome?: () => void;
};

const Header = ({ onBackHome }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.logoArea}>
        <p className={styles.logo}>Fatec</p>
        <span>Jacareí</span>
      </div>

      <nav className={styles.nav}>
        <span>Atendimento Virtual</span>

        {onBackHome ? (
          <button type="button" onClick={onBackHome}>
            Início
          </button>
        ) : null}
      </nav>
    </header>
  );
};

export default Header;
