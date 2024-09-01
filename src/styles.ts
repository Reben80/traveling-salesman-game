import { CSSProperties } from 'react';

const styles: { [key: string]: CSSProperties } = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100vw',
    background: 'linear-gradient(to bottom right, #ebf8ff, #faf5ff)',
    padding: '1rem',
    overflowX: 'hidden',
  },
  gameContainer: {
    width: '100%',
    maxWidth: '1200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  titleContainer: {
    backgroundColor: '#0078D7',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem',
  },
  title: {
    fontFamily: 'Arial, sans-serif',
    fontSize: 'min(70px, 8vw)',
    fontWeight: 'bold',
    color: 'white',
    textShadow:
      '0.04em 0.04em 0px #FF0000, ' +
      '0.08em 0.08em 0px #FFD700',
    padding: '10px',
    display: 'inline-block',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  completedChallenges: {
    marginTop: '1rem',
    textAlign: 'left',
    width: '100%',
  },
  buttonRow: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: '1rem',
  },
  buttonGreen: {
    backgroundColor: '#48bb78',
    color: 'white',
  },
  buttonBlue: {
    backgroundColor: '#4299e1',
    color: 'white',
  },
  slider: {
    width: '100%',
    margin: '0.5rem 0',
  },
  button: {
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  // ... (include all other styles here)
};

export default styles;
