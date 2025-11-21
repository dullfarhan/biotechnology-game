import React, { useEffect, useState } from 'react';

const BonusLevel = ({ onRestart }) => {
  const [stage, setStage] = useState('intro'); // intro, collecting, done

  useEffect(() => {
    if (stage === 'intro') {
      setTimeout(() => setStage('collecting'), 2000);
    } else if (stage === 'collecting') {
      setTimeout(() => setStage('done'), 4000);
    }
  }, [stage]);

  return (
    <div className="fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      textAlign: 'center',
      padding: '2rem',
      background: 'linear-gradient(135deg, #0a0e17 0%, #1a0b2e 100%)'
    }}>
      {stage === 'intro' && (
        <div className="fade-in">
          <h1 style={{ color: '#00ff00', textShadow: '0 0 20px #00ff00' }}>BONUS LEVEL UNLOCKED</h1>
          <p style={{ fontSize: '1.5rem' }}>Inside the Mass Spec...</p>
        </div>
      )}

      {stage === 'collecting' && (
        <div className="fade-in">
          <h2 style={{ marginBottom: '2rem' }}>Acquiring High-Res Spectra...</h2>
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            justifyContent: 'center', 
            alignItems: 'flex-end',
            height: '100px'
          }}>
            {[...Array(10)].map((_, i) => (
              <div key={i} style={{
                width: '20px',
                height: `${Math.random() * 100}%`,
                background: `hsl(${Math.random() * 60 + 240}, 100%, 50%)`,
                animation: `equalizer 0.5s ease-in-out infinite alternate ${i * 0.1}s`
              }} />
            ))}
          </div>
          <style>{`
            @keyframes equalizer {
              0% { height: 20%; }
              100% { height: 100%; }
            }
          `}</style>
        </div>
      )}

      {stage === 'done' && (
        <div className="fade-in">
          <h2 style={{ color: '#00f0ff', marginBottom: '1rem' }}>ANALYSIS COMPLETE</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '500px' }}>
            Thanks for playing! We have received your details and will reach out with exclusive pilot opportunities.
          </p>
          <button onClick={onRestart} className="btn">
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
};

export default BonusLevel;
