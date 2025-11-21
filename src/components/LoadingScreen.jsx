import React, { useEffect } from 'react';

const LoadingScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      textAlign: 'center',
      padding: '2rem',
      background: 'var(--bg-color)'
    }}>
      <div className="animate-float" style={{ marginBottom: '2rem' }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid var(--primary-color)',
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
      
      <h2 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>Did you know?</h2>
      <p style={{ fontSize: '1.2rem', color: 'var(--primary-color)', maxWidth: '600px' }}>
        We now offer full proteomics services.
      </p>
      <p style={{ fontSize: '1rem', opacity: 0.7, marginTop: '0.5rem' }}>
        Play to explore our proteomics pilot projects!
      </p>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
