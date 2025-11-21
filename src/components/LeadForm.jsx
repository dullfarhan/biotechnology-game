import React, { useState } from 'react';

const LeadForm = ({ onStart }) => {
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('Mass Spectrometry');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    onStart({ email, interest });
  };

  return (
    <div className="fade-in" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100%', 
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div className="animate-float">
        <h1>PROTEOMICS RUN</h1>
        <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
          Accelerate your research. Collect data points. Avoid contaminants.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            placeholder="researcher@lab.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Interested Pilot Project</label>
          <select
            className="form-select"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
          >
            <option value="Mass Spectrometry">Mass Spectrometry Analysis</option>
            <option value="Biomarker Discovery">Biomarker Discovery</option>
            <option value="Protein Characterization">Protein Characterization</option>
            <option value="Custom Assay Development">Custom Assay Development</option>
            <option value="General Proteomics">General Proteomics Services</option>
          </select>
        </div>

        {error && <p style={{ color: '#ff0099', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}

        <button type="submit" className="btn">
          START PILOT RUN
        </button>
      </form>
      
      <p style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.6 }}>
        *Top scorers qualify for exclusive pilot program benefits.
      </p>
    </div>
  );
};

export default LeadForm;
