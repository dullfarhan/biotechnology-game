import React, { useState } from 'react';

const ServiceExplorer = () => {
  const [activeService, setActiveService] = useState(null);

  const services = [
    {
      id: 'discovery',
      icon: '🔍',
      title: 'Discovery Proteomics',
      desc: 'Unbiased analysis of the entire proteome. Identify thousands of proteins in a single run to discover new biomarkers and pathways.'
    },
    {
      id: 'targeted',
      icon: '🎯',
      title: 'Targeted Proteomics',
      desc: 'Precise quantification of specific proteins. The gold standard for validating biomarkers with high sensitivity and reproducibility.'
    },
    {
      id: 'biomarker',
      icon: '✅',
      title: 'Biomarker Verification',
      desc: 'Bridge the gap between discovery and clinical application. Verify candidates in large cohorts with our high-throughput workflows.'
    }
  ];

  return (
    <div style={{ marginTop: '2rem', width: '100%', maxWidth: '600px' }}>
      <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '1rem' }}>
        EXPLORE OUR SERVICES
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
        {services.map((s) => (
          <div 
            key={s.id}
            onClick={() => setActiveService(s)}
            style={{
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'transform 0.2s'
            }}
            className="service-icon"
          >
            <div style={{ 
              fontSize: '2.5rem', 
              background: 'rgba(255,255,255,0.1)', 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '0.5rem',
              border: '1px solid var(--primary-color)'
            }}>
              {s.icon}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)' }}>{s.title.split(' ')[0]}</div>
          </div>
        ))}
      </div>

      {activeService && (
        <div className="fade-in" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }} onClick={() => setActiveService(null)}>
          <div style={{
            background: '#1a1f2e',
            padding: '2rem',
            borderRadius: '16px',
            maxWidth: '400px',
            border: '1px solid var(--primary-color)',
            textAlign: 'center',
            position: 'relative'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{activeService.icon}</div>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>{activeService.title}</h3>
            <p style={{ lineHeight: '1.6', marginBottom: '2rem' }}>{activeService.desc}</p>
            <button className="btn" onClick={() => setActiveService(null)}>CLOSE</button>
          </div>
        </div>
      )}
      
      <style>{`
        .service-icon:hover {
          transform: translateY(-5px);
        }
        .service-icon:hover div:first-child {
          background: rgba(0, 240, 255, 0.2) !important;
          box-shadow: 0 0 15px var(--primary-color);
        }
      `}</style>
    </div>
  );
};

const StartScreen = ({ onStart }) => {
  return (
    <div className="fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      textAlign: 'center',
      padding: '2rem',
      background: 'radial-gradient(circle at center, rgba(0, 240, 255, 0.1) 0%, transparent 70%)'
    }}>
      <h1 style={{ 
        fontSize: '3.5rem', 
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '2px'
      }}>
        Proteomics Dash
      </h1>
      
      <p style={{ 
        fontSize: '1.2rem', 
        marginBottom: '2rem',
        color: 'var(--text-color)',
        opacity: 0.9
      }}>
        Run through the proteomics pipeline & collect proteins.
      </p>

      <button onClick={onStart} className="btn" style={{ 
        fontSize: '1.5rem', 
        padding: '16px 48px',
        marginBottom: '1rem'
      }}>
        START GAME
      </button>

      <ServiceExplorer />
    </div>
  );
};

export default StartScreen;
