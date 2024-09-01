import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TSPChallenges } from './challenges';
import styles from './styles';
import './App.css';
import { getPermutations } from './utils/permutations';
import { calculateRouteDistance } from './utils/calculateRouteDistance';
import { City } from './types';

const CANVAS_WIDTH = Math.min(1200, window.innerWidth - 40);
const CANVAS_HEIGHT = Math.min(900, window.innerHeight - 200);
const CITY_RADIUS = 15;
const MARGIN = CITY_RADIUS + 10;
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#D2B4DE'];

const TravelingSalesmanGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(Infinity);
  const [cities, setCities] = useState<City[]>([]);
  const [route, setRoute] = useState<number[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null);
  const [showCongrats, setShowCongrats] = useState<boolean>(false);
  const [cityCount, setCityCount] = useState<number>(5);
  const [isCalculating, setIsCalculating] = useState(false);
  const [optimalDistance, setOptimalDistance] = useState<number | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [cityCountChanged, setCityCountChanged] = useState(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  const loadChallenge = useCallback((challengeKey: keyof typeof TSPChallenges) => {
    console.log('Loading challenge:', challengeKey);
    const challenge = TSPChallenges[challengeKey];
    if (challenge) {
      const cities = challenge.cities.map((city, index) => ({
        ...city,
        color: COLORS[index % COLORS.length],
      }));
      console.log('Cities:', cities);
      setCities(cities);
      resetGame(); // This will clear the route and score
      setBestScore(Infinity); // Reset best score for new challenge
    }
  }, []);

  const generateRandomCities = useCallback(() => {
    const newCities: City[] = [];
    const gridSize = Math.ceil(Math.sqrt(cityCount));
    const cellSize = 1 / gridSize;

    for (let i = 0; i < cityCount; i++) {
      const gridX = i % gridSize;
      const gridY = Math.floor(i / gridSize);

      const x = (gridX + Math.random()) * cellSize * 0.9 + 0.05; // Ensure cities are within 5% margin
      const y = (gridY + Math.random()) * cellSize * 0.9 + 0.05; // Ensure cities are within 5% margin

      newCities.push({
        x,
        y,
        name: `City ${i + 1}`,
        color: COLORS[i % COLORS.length]
      });
    }

    setCities(newCities);
    resetGame(); // This will clear the route and score
    setBestScore(Infinity); // Reset best score for new set of cities
  }, [cityCount]);

  useEffect(() => {
    if (currentChallenge) {
      loadChallenge(currentChallenge);
    } else {
      generateRandomCities();
    }
  }, [currentChallenge, cityCount, loadChallenge, generateRandomCities]);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBorder(ctx);
    drawRoute(ctx);
    drawCities(ctx);
  }, [cities, route]);

  useEffect(() => {
    if (canvasRef.current) {
      drawGame();
    }
  }, [cities, route, drawGame]);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = Math.min(1200, window.innerWidth - 40);
      const newHeight = Math.min(900, window.innerHeight - 200);
      if (canvasRef.current) {
        canvasRef.current.width = newWidth;
        canvasRef.current.height = newHeight;
      }
      drawGame();
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial size
    return () => window.removeEventListener('resize', handleResize);
  }, [drawGame]);

  const resetGame = () => {
    setRoute([]);
    setScore(0);
    setShowCongrats(false);
    // We're not changing the cities or best score here
  };

  const calculateDistance = (route: number[]) => {
    let distance = 0;

    console.log("Calculating player's route distance:");
    console.log("Player's route:", route.map(i => cities[i].name).join(" -> "));
    for (let i = 0; i < route.length; i++) {
      const city1 = cities[route[i]];
      const city2 = cities[route[(i + 1) % route.length]];
      console.log(`  ${city1.name}: (${city1.x.toFixed(2)}, ${city1.y.toFixed(2)})`);
      console.log(`  ${city2.name}: (${city2.x.toFixed(2)}, ${city2.y.toFixed(2)})`);
      const dx = city2.x - city1.x;
      const dy = city2.y - city1.y;
      console.log(`  dx: ${dx.toFixed(2)}, dy: ${dy.toFixed(2)}`);
      const segmentDistance = Math.sqrt(dx ** 2 + dy ** 2);
      distance += segmentDistance;
      console.log(`  Distance from ${city1.name} to ${city2.name}: ${segmentDistance.toFixed(2)}`);
    }

    console.log("Total player route distance:", distance.toFixed(2));
    setScore(distance);

    checkChallengeCompletion();
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    const y = (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;

    const clickedCityIndex = cities.findIndex(city => {
      const cityX = city.x * (CANVAS_WIDTH - 2 * MARGIN) + MARGIN;
      const cityY = city.y * (CANVAS_HEIGHT - 2 * MARGIN) + MARGIN;
      const distance = Math.sqrt((x - cityX) ** 2 + (y - cityY) ** 2);
      return distance <= CITY_RADIUS;
    });

    if (clickedCityIndex !== -1 && !route.includes(clickedCityIndex)) {
      setRoute(prevRoute => {
        const newRoute = [...prevRoute, clickedCityIndex];
        calculateDistance(newRoute); // Call calculateDistance with the new route
        return newRoute;
      });
    }
  };

  const calculateOptimalPathBruteForce = () => {
    console.log("Starting Brute Force calculation...");
    setIsCalculating(true);

    setTimeout(() => {
      try {
        const cityIndices = cities.map((_, index) => index);
        const permutations = getPermutations(cityIndices);
        let shortestDistance = Infinity;
        let bestRoute: number[] = [];

        permutations.forEach((perm: number[]) => {
          const distance = calculateRouteDistance(perm, cities);
          if (distance < shortestDistance) {
            shortestDistance = distance;
            bestRoute = perm;
          }
        });

        console.log("Brute Force optimal distance:", shortestDistance.toFixed(2));
        console.log("Brute Force optimal path:", bestRoute.map(i => cities[i].name).join(" -> "));
        setOptimalDistance(shortestDistance);

      } catch (error) {
        console.error("Error calculating Brute Force path:", error);
      } finally {
        setIsCalculating(false);
      }
    }, 0);
  };

  const checkChallengeCompletion = () => {
    if (currentChallenge && score < bestScore) {
      setBestScore(score);
      setShowCongrats(true);
      setCompletedChallenges([...completedChallenges, currentChallenge]);
    } else if (score === optimalDistance) {
      setShowCongrats(true);
    }
  };

  const handleChallengeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentChallenge(event.target.value);
  };

  const handleCityCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCityCount(parseInt(event.target.value, 10));
    setCityCountChanged(true);
    setTimeout(() => setCityCountChanged(false), 300);
  };

  const drawBorder = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.rect(MARGIN, MARGIN, CANVAS_WIDTH - 2 * MARGIN, CANVAS_HEIGHT - 2 * MARGIN);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawCities = (ctx: CanvasRenderingContext2D) => {
    cities.forEach((city) => {
      const x = city.x * (CANVAS_WIDTH - 2 * MARGIN) + MARGIN;
      const y = city.y * (CANVAS_HEIGHT - 2 * MARGIN) + MARGIN;

      ctx.beginPath();
      ctx.arc(x, y, CITY_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = city.color || '#000';
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();

      ctx.font = '14px Arial';
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(city.name, x, y + CITY_RADIUS + 15);
    });
  };

  const drawRoute = (ctx: CanvasRenderingContext2D) => {
    if (route.length > 0) {
      ctx.beginPath();
      const startX = cities[route[0]].x * (CANVAS_WIDTH - 2 * MARGIN) + MARGIN;
      const startY = cities[route[0]].y * (CANVAS_HEIGHT - 2 * MARGIN) + MARGIN;
      ctx.moveTo(startX, startY);

      for (let i = 1; i < route.length; i++) {
        const x = cities[route[i]].x * (CANVAS_WIDTH - 2 * MARGIN) + MARGIN;
        const y = cities[route[i]].y * (CANVAS_HEIGHT - 2 * MARGIN) + MARGIN;
        ctx.lineTo(x, y);
      }

      if (route.length === cities.length) {
        ctx.lineTo(startX, startY);
      }

      ctx.strokeStyle = 'rgba(65, 105, 225, 0.7)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  };

  return (
    <div style={styles.appContainer}>
      <div style={styles.gameContainer}>
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>TSP Adventure</h1>
        </div>
        {/* Controls */}
        <div style={styles.controls}>
          <div style={{...styles.buttonRow, marginBottom: '1rem'}}>
            <button 
              onClick={() => {
                setCurrentChallenge(null);
                generateRandomCities();
              }} 
              style={{
                ...styles.button, 
                ...styles.buttonGreen, 
                fontSize: '1.1rem', 
                padding: '12px 24px',
                marginRight: '20px'
              }}
              className="button-green"
            >
              Random Challenge
            </button>
            <select 
              onChange={handleChallengeChange} 
              value={currentChallenge || ''}
              style={{
                ...styles.button, 
                ...styles.buttonBlue, 
                fontSize: '1.1rem',
                padding: '12px 24px',
                width: '250px',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px top 50%',
                backgroundSize: '12px auto',
                cursor: 'pointer'
              }}
              className="button-blue"
            >
              <option value="">Select a challenge</option>
              {Object.entries(TSPChallenges).map(([key, challenge]) => (
                <option key={key} value={key}>
                  {challenge.name} ({challenge.difficulty})
                </option>
              ))}
            </select>
          </div>
          
          {!currentChallenge && (
            <div style={{width: '100%', maxWidth: '32rem', margin: '1rem 0'}}>
              <p style={{
                ...styles.scoreText,
                transition: 'all 0.3s',
                transform: cityCountChanged ? 'scale(1.1)' : 'scale(1)',
              }}>
                Number of Cities: {cityCount}
              </p>
              <input
                type="range"
                min="2"
                max="12"
                value={cityCount}
                onChange={handleCityCountChange}
                style={styles.slider}
              />
            </div>
          )}
        </div>
        {/* Canvas */}
        <div style={styles.canvasContainer}>
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onClick={handleCanvasClick}
          />
          
          {showInstructions && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={() => setShowInstructions(false)}>&times;</span>
                <h2>How to Play</h2>
                <p>1. Click on the canvas to select cities in the order you want to visit them.</p>
                <p>2. The distance of your route will be calculated and displayed.</p>
                <p>3. Try to find the shortest route that visits all cities.</p>
                <p>4. You can reset the game or generate a new random challenge using the buttons provided.</p>
              </div>
            </div>
          )}
        </div>
        {/* Score */}
        <div style={styles.scoreDisplay}>
          <p style={styles.scoreText}>Distance: <span style={{fontWeight: 'bold'}}>{score.toFixed(2)}</span></p>
          <p style={styles.scoreText}>Best Score: <span style={{fontWeight: 'bold'}}>{bestScore === Infinity ? 'N/A' : bestScore.toFixed(2)}</span></p>
          <p style={styles.scoreText}>Optimal Distance: <span style={{fontWeight: 'bold'}}>{optimalDistance === null ? 'N/A' : optimalDistance.toFixed(2)}</span></p>
        </div>

        {/* Buttons */}
        <div style={{...styles.buttonRow, marginTop: '1rem'}}>
          <button
            onClick={resetGame}
            style={{
              ...styles.button,
              ...styles.buttonBlue,
              fontSize: '1.1rem',
              padding: '12px 24px',
              minWidth: '150px',
              marginRight: '20px'
            }}
            className="button-blue"
          >
            Reset Game
          </button>
          <button
            onClick={calculateOptimalPathBruteForce}
            style={{
              ...styles.button,
              ...styles.buttonGreen,
              fontSize: '1.1rem',
              padding: '12px 24px',
              minWidth: '200px'
            }}
            className="button-green"
            disabled={isCalculating}
          >
            {isCalculating ? 'Calculating...' : 'Calculate Optimal Path (Brute Force)'}
          </button>
          <button
            onClick={() => setShowInstructions(true)}
            style={{
              ...styles.button,
              ...styles.buttonBlue,
              fontSize: '1.1rem',
              padding: '12px 24px',
              minWidth: '150px',
              marginRight: '20px'
            }}
            className="button-blue"
          >
            How to Play
          </button>
        </div>

        {/* Completed Challenges */}
        <div style={styles.completedChallenges}>
          <h3>Completed Challenges:</h3>
          <ul>
            {completedChallenges.map((challengeKey: string) => (
              <li key={challengeKey}>{TSPChallenges[challengeKey as keyof typeof TSPChallenges].name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TravelingSalesmanGame;