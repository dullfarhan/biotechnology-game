import React, { useRef, useEffect, useState } from 'react';

const GameCanvas = ({ onGameOver }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [collectedCount, setCollectedCount] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [activePowerUp, setActivePowerUp] = useState(null); // 'boost' or 'lockon'
  const [isPaused, setIsPaused] = useState(false);
  const [activeInfo, setActiveInfo] = useState(null); // Content for the modal
  
  // Game Constants
  const GRAVITY = 0.6;
  const JUMP_FORCE = -12;
  const SPEED_INITIAL = 5;
  const SPAWN_RATE = 90; 

  // Micro-info messages
  const INFO_MESSAGES = [
    { title: "Did you know?", text: "Look for the white 'i' icons to learn more!" },
    { title: "New Service", text: "We now offer Discovery Proteomics pilot projects." },
    { title: "Precision Analysis", text: "Ask us about Targeted Proteomics for precision analysis." },
    {
      title: "Discovery Proteomics",
      text: "Our Discovery Proteomics service offers unbiased analysis of thousands of proteins in a single run. Perfect for identifying new biomarkers and understanding complex biological systems without prior knowledge of targets."
    },
    {
      title: "Targeted Proteomics",
      text: "Need precise quantification? Our Targeted Proteomics approach uses Selected Reaction Monitoring (SRM) to measure specific proteins with high sensitivity and absolute accuracy. Ideal for validation studies."
    },
    {
      title: "Biomarker Verification",
      text: "Bridge the gap between discovery and clinical application. We help verify candidate biomarkers in larger cohorts, ensuring they are robust, reproducible, and ready for clinical assay development."
    },
    {
      title: "Data Analysis",
      text: "It's not just about data generation. Our bioinformatics team provides comprehensive data analysis, turning raw mass spec spectra into actionable biological insights with clear visualizations."
    }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let frameCount = 0;
    let gameSpeed = SPEED_INITIAL;
    let currentScore = 0;
    let currentCollected = 0;
    let powerUpTimer = 0;
    let powerUpType = null; // 'boost', 'lockon'

    // Resize Handler
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize(); // Initial size

    // Game State
    let player = {
      x: 50,
      y: canvas.height - 100, // Initial Y
      width: 30,
      height: 30,
      dy: 0,
      grounded: false,
      color: '#00f0ff'
    };

    let obstacles = [];
    let particles = [];

    const handleInput = (e) => {
      // Prevent default for touch to stop scrolling
      if (e.type === 'touchstart') {
        e.preventDefault();
      }
      
      // Don't jump if paused
      if (isPaused) return;

      if ((e.code === 'Space' || e.type === 'touchstart' || e.type === 'click') && player.grounded) {
        player.dy = JUMP_FORCE;
        player.grounded = false;
      }
    };

    window.addEventListener('keydown', handleInput);
    canvas.addEventListener('touchstart', handleInput, { passive: false });
    canvas.addEventListener('click', handleInput);

    const spawnEntity = () => {
      const rand = Math.random();
      let type, color, points, width, height, yPos;

      if (rand < 0.2) { // 20% Chance for Info Point (Much more frequent)
        type = 'info_point';
        color = '#ffffff';
        points = 0;
        width = 30;
        height = 30;
        yPos = canvas.height - 150; // Floating slightly higher
      } else if (rand < 0.6) { // Good items
        const itemRand = Math.random();
        if (itemRand < 0.6) {
          type = 'protein'; color = '#00f0ff'; points = 5; width = 20; height = 20;
        } else if (itemRand < 0.9) {
          type = 'peptide'; color = '#7000ff'; points = 3; width = 15; height = 15;
        } else {
          type = 'mass_spec'; color = '#ffcc00'; points = 10; width = 25; height = 25;
        }
        yPos = canvas.height - 100 - Math.random() * 80;
      } else if (rand < 0.9) { // Bad items
        const badRand = Math.random();
        if (badRand < 0.5) {
          type = 'contaminant'; color = '#ff0000'; points = -3; width = 30; height = 30;
        } else {
          type = 'noise'; color = '#555'; points = -5; width = 25; height = 25;
        }
        yPos = canvas.height - 40; // Ground level usually
      } else { // Power-ups
        const powerRand = Math.random();
        type = powerRand < 0.5 ? 'power_boost' : 'power_lockon';
        color = '#00ff00';
        points = 0;
        width = 25;
        height = 25;
        yPos = canvas.height - 120;
      }

      obstacles.push({ x: canvas.width, y: yPos, width, height, type, color, points });
    };

    const update = () => {
      if (isPaused) {
        // Draw Pause Overlay (static)
        // We don't request animation frame here, we rely on React state re-render for the modal
        // But we need to keep the loop alive if we want animations in background? 
        // Actually, let's just stop the loop logic but keep drawing?
        // For simplicity, we just return and let the React component handle the modal.
        // We need to restart the loop when unpaused.
        // Better approach: check ref inside the loop.
      }
      
      // We need to access the *current* isPaused state inside the closure.
      // Since we are using a ref for the loop, we can't easily access the React state directly without it being stale.
      // We'll use a ref for paused state to communicate with the loop.
    };
    
    // Ref-based loop to handle pause state correctly without re-binding
    const loop = () => {
      if (canvasRef.current?.dataset.paused === 'true') {
        animationFrameId = requestAnimationFrame(loop);
        return;
      }

      frameCount++;
      
      // Clear Canvas
      ctx.fillStyle = 'rgba(10, 14, 23, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Micro-info Logic (Toast)
      if (frameCount % 400 === 0) { // Every ~6-7 seconds
        const msgObj = INFO_MESSAGES[Math.floor(Math.random() * INFO_MESSAGES.length)];
        // Handle both string and object formats just in case, though we standardized on objects
        const text = msgObj.text || msgObj; 
        setToastMessage(text);
        setTimeout(() => setToastMessage(''), 4000);
      }

      // Power-up Logic
      if (powerUpTimer > 0) {
        powerUpTimer--;
        if (powerUpTimer === 0) {
          powerUpType = null;
          setActivePowerUp(null);
        }
      }

      // Player Physics
      player.dy += GRAVITY;
      player.y += player.dy;

      // Dynamic Ground Collision
      if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.grounded = true;
      }

      // Draw Player
      ctx.fillStyle = player.color;
      ctx.shadowBlur = powerUpType ? 20 : 10;
      ctx.shadowColor = powerUpType === 'boost' ? '#ffcc00' : (powerUpType === 'lockon' ? '#00ff00' : player.color);
      ctx.fillRect(player.x, player.y, player.width, player.height);
      ctx.shadowBlur = 0;

      // Spawn
      if (frameCount % Math.floor(SPAWN_RATE / (gameSpeed / SPEED_INITIAL)) === 0) {
        spawnEntity();
      }

      // Update Entities
      for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        obs.x -= gameSpeed;

        // Magnet Effect (Lock-On)
        if (powerUpType === 'lockon' && ['protein', 'peptide', 'mass_spec'].includes(obs.type)) {
          if (obs.x < player.x + 300 && obs.x > player.x) {
            obs.y += (player.y - obs.y) * 0.1;
            obs.x -= 2; // Pull faster
          }
        }

        // Draw Entity
        ctx.fillStyle = obs.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = obs.color;
        
        if (['protein', 'peptide', 'mass_spec', 'power_boost', 'power_lockon', 'info_point'].includes(obs.type)) {
          ctx.beginPath();
          if (obs.type === 'info_point') {
             // Pulsing Info Icon
             const pulse = Math.sin(frameCount * 0.1) * 5;
             ctx.arc(obs.x + obs.width/2, obs.y + obs.height/2, obs.width/2 + pulse, 0, Math.PI * 2);
             ctx.fillStyle = '#fff';
             ctx.fill();
             ctx.fillStyle = '#00f0ff';
             ctx.font = '20px Arial';
             ctx.fillText('i', obs.x + 10, obs.y + 22);
          } else {
             ctx.arc(obs.x + obs.width/2, obs.y + obs.height/2, obs.width/2, 0, Math.PI * 2);
             ctx.fill();
          }
        } else {
          // Spikes/Squares for bad stuff
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        }
        ctx.shadowBlur = 0;

        // Collision
        if (
          player.x < obs.x + obs.width &&
          player.x + player.width > obs.x &&
          player.y < obs.y + obs.height &&
          player.y + player.height > obs.y
        ) {
          if (obs.type === 'info_point') {
             // PAUSE GAME
             const info = INFO_MESSAGES[Math.floor(Math.random() * INFO_MESSAGES.length)];
             setActiveInfo(info);
             setIsPaused(true);
             obstacles.splice(i, 1);
             // We don't break here, but the next loop iteration will be paused
          } else if (['contaminant', 'noise'].includes(obs.type)) {
             currentScore += obs.points;
             setScore(currentScore);
             obstacles.splice(i, 1);
          } else if (['power_boost', 'power_lockon'].includes(obs.type)) {
             powerUpType = obs.type === 'power_boost' ? 'boost' : 'lockon';
             powerUpTimer = obs.type === 'power_boost' ? 300 : 180; // 5s or 3s
             setActivePowerUp(powerUpType);
             obstacles.splice(i, 1);
          } else {
             // Good items
             let pts = obs.points;
             if (powerUpType === 'boost') pts *= 2;
             currentScore += pts;
             currentCollected++;
             setScore(currentScore);
             setCollectedCount(currentCollected);
             obstacles.splice(i, 1);
          }
        }

        if (obs.x + obs.width < 0) {
          obstacles.splice(i, 1);
        }
      }

      // Game End Condition
      if (frameCount >= 2700) { // 45 seconds @ 60fps
         cancelAnimationFrame(animationFrameId);
         onGameOver(currentScore, currentCollected);
         return;
      }

      // Increase Speed
      if (frameCount % 500 === 0) gameSpeed += 0.5;

      // Floor
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleInput);
      canvas.removeEventListener('touchstart', handleInput);
      canvas.removeEventListener('click', handleInput);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Empty dependency array means this runs once. 
  // ISSUE: setIsPaused inside the loop won't update the ref used by the loop if we don't handle it carefully.
  // Actually, `setIsPaused` triggers re-render. The `useEffect` runs only once.
  // So `isPaused` inside `useEffect` is always false (closure).
  // FIX: Use a data attribute on the canvas to communicate state to the loop.

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.dataset.paused = isPaused;
    }
  }, [isPaused]);

  const handleResume = () => {
    setIsPaused(false);
    setActiveInfo(null);
    // Focus canvas back?
  };

  return (
    <div className="fade-in" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas 
        ref={canvasRef} 
        data-paused={isPaused}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
      
      {/* HUD */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '30px',
        textAlign: 'right'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', textShadow: '0 0 10px #00f0ff' }}>
          SCORE: {score}
        </div>
        <div style={{ fontSize: '1rem', color: '#00f0ff' }}>
          PROTEINS: {collectedCount}
        </div>
      </div>

      {/* Power-up Indicator */}
      {activePowerUp && (
        <div style={{
          position: 'absolute',
          top: '80px',
          right: '30px',
          color: '#00ff00',
          fontWeight: 'bold',
          animation: 'pulse 0.5s infinite alternate'
        }}>
          {activePowerUp === 'boost' ? '⚡ DOUBLE POINTS' : '🎯 MAGNET ACTIVE'}
        </div>
      )}

      {/* Micro-info Toast (In-Game) */}
      {toastMessage && (
        <div style={{
          position: 'absolute',
          top: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 240, 255, 0.15)',
          border: '1px solid rgba(0, 240, 255, 0.5)',
          padding: '10px 20px',
          borderRadius: '20px',
          color: '#fff',
          fontSize: '0.95rem',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.5s ease-out',
          width: '80%',
          maxWidth: '600px',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 50
        }}>
          <span style={{ color: '#00f0ff', fontWeight: 'bold', marginRight: '8px' }}>INFO:</span>
          {toastMessage}
        </div>
      )}

      {/* Info Modal Overlay */}
      {isPaused && activeInfo && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(10, 14, 23, 0.9)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid #00f0ff',
            padding: '2rem',
            borderRadius: '20px',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 0 30px rgba(0, 240, 255, 0.2)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>ℹ️</div>
            <h2 style={{ color: '#00f0ff', marginBottom: '1rem' }}>{activeInfo.title}</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              {activeInfo.text}
            </p>
            <button 
              className="btn"
              onClick={handleResume}
              style={{ fontSize: '1.2rem', padding: '15px 40px' }}
            >
              RESUME RUN
            </button>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes pulse {
          from { opacity: 0.7; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default GameCanvas;
