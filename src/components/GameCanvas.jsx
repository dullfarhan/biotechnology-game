import React, { useRef, useEffect, useState } from 'react';

const GameCanvas = ({ onGameOver }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [collectedCount, setCollectedCount] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [activePowerUp, setActivePowerUp] = useState(null); // 'boost' or 'lockon'
  
  // Game Constants
  const GRAVITY = 0.6;
  const JUMP_FORCE = -12;
  const SPEED_INITIAL = 5;
  const SPAWN_RATE = 90; 

  // Micro-info messages
  const INFO_MESSAGES = [
    "We now offer Discovery Proteomics pilot projects.",
    "Ask us about Targeted Proteomics for precision analysis.",
    "Explore Biomarker Verification with our expert team.",
    "Collect proteins and learn about our proteomics capabilities!"
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

    // Game State
    let player = {
      x: 50,
      y: 200,
      width: 30,
      height: 30,
      dy: 0,
      grounded: false,
      color: '#00f0ff'
    };

    let obstacles = [];
    let particles = [];

    const handleInput = (e) => {
      if ((e.code === 'Space' || e.type === 'touchstart' || e.type === 'click') && player.grounded) {
        player.dy = JUMP_FORCE;
        player.grounded = false;
      }
    };

    window.addEventListener('keydown', handleInput);
    canvas.addEventListener('touchstart', handleInput);
    canvas.addEventListener('click', handleInput);

    const spawnEntity = () => {
      const rand = Math.random();
      let type, color, points, width, height, yPos;

      if (rand < 0.6) { // 60% Good items
        const itemRand = Math.random();
        if (itemRand < 0.6) {
          type = 'protein'; color = '#00f0ff'; points = 5; width = 20; height = 20;
        } else if (itemRand < 0.9) {
          type = 'peptide'; color = '#7000ff'; points = 3; width = 15; height = 15;
        } else {
          type = 'mass_spec'; color = '#ffcc00'; points = 10; width = 25; height = 25;
        }
        yPos = canvas.height - 100 - Math.random() * 80;
      } else if (rand < 0.9) { // 30% Bad items
        const badRand = Math.random();
        if (badRand < 0.5) {
          type = 'contaminant'; color = '#ff0000'; points = -3; width = 30; height = 30;
        } else {
          type = 'noise'; color = '#555'; points = -5; width = 25; height = 25;
        }
        yPos = canvas.height - 40; // Ground level usually
      } else { // 10% Power-ups
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
      frameCount++;
      
      // Clear Canvas
      ctx.fillStyle = 'rgba(10, 14, 23, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Micro-info Logic
      if (frameCount % 600 === 0) { // Every ~10s (assuming 60fps)
        const msg = INFO_MESSAGES[Math.floor(Math.random() * INFO_MESSAGES.length)];
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 2500);
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
        
        if (['protein', 'peptide', 'mass_spec', 'power_boost', 'power_lockon'].includes(obs.type)) {
          ctx.beginPath();
          ctx.arc(obs.x + obs.width/2, obs.y + obs.height/2, obs.width/2, 0, Math.PI * 2);
          ctx.fill();
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
          if (['contaminant', 'noise'].includes(obs.type)) {
             // Penalty instead of instant death? Or just score reduction?
             // User spec: "Avoid (Bad items) -> Penalty -3/-5". 
             // Implies game continues.
             currentScore += obs.points;
             setScore(currentScore);
             obstacles.splice(i, 1);
             // Visual feedback for hit?
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

      // Game End Condition (Time based? Or just infinite until user stops? User said 30-45s)
      // Let's make it infinite but speed up, user stops when they crash too much or we can add a timer.
      // User spec: "30-45 second running game". Let's add a timer.
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

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('keydown', handleInput);
      canvas.removeEventListener('touchstart', handleInput);
      canvas.removeEventListener('click', handleInput);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fade-in" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={500} 
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

      {/* Micro-info Toast */}
      {toastMessage && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 240, 255, 0.2)',
          border: '1px solid #00f0ff',
          padding: '10px 20px',
          borderRadius: '20px',
          color: '#fff',
          fontSize: '0.9rem',
          backdropFilter: 'blur(5px)',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {toastMessage}
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
