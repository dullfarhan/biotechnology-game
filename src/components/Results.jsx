import React, { useState } from 'react';

const SERVICE_INFO = {
  'Discovery Proteomics': {
    title: 'Discovery Proteomics',
    desc: 'Ideal for exploring complex biological systems. Our unbiased approach identifies thousands of proteins to uncover novel biomarkers and pathways.'
  },
  'Targeted Proteomics': {
    title: 'Targeted Proteomics',
    desc: 'The gold standard for validation. We use SRM/MRM to precisely quantify specific proteins with high sensitivity and absolute specificity.'
  },
  'Biomarker Verification': {
    title: 'Biomarker Verification',
    desc: 'Bridge the gap to the clinic. Verify your candidate biomarkers in larger sample cohorts with our high-throughput, robust workflows.'
  },
  'Not Sure': {
    title: 'Custom Consultation',
    desc: 'Not sure where to start? Our team of PhD scientists will help design the perfect proteomics strategy for your research goals.'
  }
};

const Results = ({ score, collectedCount, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [interest, setInterest] = useState('Discovery Proteomics');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    onSubmit({ email, name, interest });
  };

  return (
    <div className="fade-in" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100%', 
      textAlign: 'center',
      padding: '2rem',
      overflowY: 'auto'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#ff0099' }}>GREAT RUN!</h2>
      
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '1rem', color: '#aaa' }}>SCORE</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{score}</div>
        </div>
        <div>
          <div style={{ fontSize: '1rem', color: '#aaa' }}>PROTEINS</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00f0ff' }}>{collectedCount}</div>
        </div>
      </div>

      <div style={{ 
        display: 'flex',
        gap: '1rem',
        width: '100%',
        maxWidth: '800px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {/* Form Section */}
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          padding: '1.5rem', 
          borderRadius: '12px',
          flex: '1 1 300px',
          border: '1px solid var(--glass-border)'
        }}>
          <p style={{ color: '#00f0ff', marginBottom: '1rem', fontSize: '1.1rem' }}>
            Unlock Pilot Opportunities
          </p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Name (Optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              className="form-input"
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
            />
            
            <div style={{ textAlign: 'left' }}>
              <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Select your interest:</label>
              <select
                className="form-select"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
              >
                <option value="Discovery Proteomics">Discovery Proteomics</option>
                <option value="Targeted Proteomics">Targeted Proteomics</option>
                <option value="Biomarker Verification">Biomarker Verification</option>
                <option value="Not Sure">Not sure — send me details</option>
              </select>
            </div>

            {error && <p style={{ color: '#ff0099', fontSize: '0.9rem' }}>{error}</p>}

            <button type="submit" className="btn" style={{ width: '100%', marginTop: '0.5rem' }}>
              SUBMIT & CLAIM BONUS
            </button>
          </form>
        </div>

        {/* Dynamic Info Section */}
        <div style={{ 
          background: 'rgba(0, 240, 255, 0.05)', 
          padding: '1.5rem', 
          borderRadius: '12px',
          flex: '1 1 300px',
          border: '1px solid var(--primary-color)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'left'
        }}>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>
            {SERVICE_INFO[interest].title}
          </h3>
          <p style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
            {SERVICE_INFO[interest].desc}
          </p>
          <div style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.7 }}>
            *Select this option to receive a tailored pilot project proposal.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
