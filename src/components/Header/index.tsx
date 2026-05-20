import styles from "./styles.module.css";

type HeaderProps = {
  onBackHome?: () => void;
  onOpenEmailModal?: () => void;
};

const Header = ({ onBackHome, onOpenEmailModal }: HeaderProps) => {
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

        <button
          className={styles.emailButton}
          onClick={onOpenEmailModal}
          type="button"
        >
          Envie seu Email
        </button>
      </nav>
    </header>
  );
};

export default Header;
