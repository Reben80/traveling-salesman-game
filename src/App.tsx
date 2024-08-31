import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { Slider } from '@radix-ui/react-slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@radix-ui/react-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@radix-ui/react-select';
import { Award } from 'lucide-react';

const CANVAS_WIDTH = Math.min(1200, window.innerWidth - 40);
const CANVAS_HEIGHT = Math.min(900, window.innerHeight - 200);
const CITY_RADIUS = 15;
const MARGIN = CITY_RADIUS + 10;
const BORDER_PADDING = 50; // Padding inside the border

type City = {
  x: number;
  y: number;
  name: string;
  color?: string;
};

type Challenge = {
  name: string;
  cities: City[];
};

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#D2B4DE'];
const MIN_DISTANCE = 50;

const TSPChallenges: Record<string, Challenge> = {
  miniUSA1: {
    name: "Mini USA 1 - Easy",
    cities: [
      { x: 0.17, y: 0.67, name: "Seattle" },
      { x: 0.33, y: 1.00, name: "Los Angeles" },
      { x: 0.75, y: 0.94, name: "Miami" },
      { x: 0.83, y: 0.44, name: "New York" },
      { x: 0.50, y: 0.56, name: "Denver" }
    ]
  },
  // Add other challenges here...
};

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

  useEffect(() => {
    console.log('Effect triggered. Current challenge:', currentChallenge, 'City count:', cityCount);
    if (currentChallenge) {
      loadChallenge(currentChallenge);
    } else {
      generateRandomCities();
    }
  }, [currentChallenge, cityCount]);

  useEffect(() => {
    if (canvasRef.current) {
      drawGame();
    }
  }, [cities, route]);

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
  }, []);

  const scaleCoordinates = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
  
    const scaledX = x * (canvas.width - 2 * MARGIN - 2 * BORDER_PADDING) + MARGIN + BORDER_PADDING;
    const scaledY = y * (canvas.height - 2 * MARGIN - 2 * BORDER_PADDING) + MARGIN + BORDER_PADDING;
    return { x: scaledX, y: scaledY };
  };

  const loadChallenge = (challengeKey: keyof typeof TSPChallenges) => {
    const challenge = TSPChallenges[challengeKey];
    if (challenge) {
      const scaledCities = challenge.cities.map((city, index) => {
        const { x, y } = scaleCoordinates(city.x, city.y);
        return {
          ...city,
          x,
          y,
          color: COLORS[index % COLORS.length],
        };
      });
      setCities(scaledCities);
      resetGameState();
    }
  };

  const generateRandomCities = () => {
    const newCities: City[] = [];
    let attempts = 0;
    const maxAttempts = 100;

    while (newCities.length < cityCount && attempts < maxAttempts) {
      const { x, y } = scaleCoordinates(Math.random(), Math.random());
      const city: City = {
        x,
        y,
        name: `City ${newCities.length + 1}`,
        color: COLORS[newCities.length % COLORS.length]
      };

      if (isCityValid(city, newCities)) {
        newCities.push(city);
        attempts = 0;
      } else {
        attempts++;
      }
    }

    setCities(newCities);
    resetGameState();
  };

  const isCityValid = (newCity: City, existingCities: City[]) => {
    return existingCities.every(city =>
      Math.sqrt((city.x - newCity.x) ** 2 + (city.y - newCity.y) ** 2) >= MIN_DISTANCE
    );
  };

  const resetGameState = () => {
    setRoute([]);
    setScore(0);
    setShowCongrats(false);
    setBestScore(Infinity);
    setOptimalDistance(null);
  };

  const drawCities = (ctx: CanvasRenderingContext2D) => {
    cities.forEach((city) => {
      // Draw city circle
      ctx.beginPath();
      ctx.arc(city.x, city.y, CITY_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = city.color || '#000';
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();

      // Draw city name
      ctx.font = '14px Arial';
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(city.name, city.x, city.y + CITY_RADIUS + 15);
    });
  };

  const drawRoute = (ctx: CanvasRenderingContext2D) => {
    if (route.length > 0) {
      ctx.beginPath();
      ctx.moveTo(cities[route[0]].x, cities[route[0]].y);
      for (let i = 1; i < route.length; i++) {
        ctx.lineTo(cities[route[i]].x, cities[route[i]].y);
      }
      if (route.length === cities.length) {
        ctx.lineTo(cities[route[0]].x, cities[route[0]].y);
      }
      ctx.strokeStyle = 'rgba(65, 105, 225, 0.7)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  };

  const calculateDistance = () => {
    let distance = 0;
    console.log("Calculating player's route distance:");
    console.log("Player's route:", route.map(i => cities[i].name).join(" -> "));
    for (let i = 0; i < route.length; i++) {
      const city1 = cities[route[i]];
      const city2 = cities[route[(i + 1) % route.length]];
      const segmentDistance = Math.sqrt((city2.x - city1.x) ** 2 + (city2.y - city1.y) ** 2);
      distance += segmentDistance;
      console.log(`  Distance from ${city1.name} to ${city2.name}: ${segmentDistance.toFixed(2)}`);
    }
    console.log("Total player route distance:", distance.toFixed(2));
    setScore(distance);

    if (route.length === cities.length) {
      if (distance < bestScore) {
        setBestScore(distance);
        setShowCongrats(true);
        setTimeout(() => setShowCongrats(false), 3000);
      }
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    cities.forEach((city, index) => {
      const dx = city.x - x;
      const dy = city.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < CITY_RADIUS) {
        if (!route.includes(index)) {
          const newRoute = [...route, index];
          setRoute(newRoute);
          if (newRoute.length === cities.length) {
            calculateDistance();
          }
        }
      }
    });
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBorder(ctx);
    drawRoute(ctx);
    drawCities(ctx);
  };

  const resetGame = () => {
    if (currentChallenge) {
      loadChallenge(currentChallenge);
    } else {
      generateRandomCities();
    }
  };

  const handleChallengeChange = (value: string) => {
    console.log('Challenge changed to:', value);
    setCurrentChallenge(value);
  };

  const handleCityCountChange = (value: number[]) => {
    console.log('City count changed to:', value[0]);
    setCityCount(value[0]);
  };

  const drawBorder = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.rect(MARGIN, MARGIN, CANVAS_WIDTH - 2 * MARGIN, CANVAS_HEIGHT - 2 * MARGIN);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const calculateOptimalPath = () => {
    console.log("Starting calculation...");
    setIsCalculating(true);

    setTimeout(() => {
      try {
        const cityIndices = Array.from({ length: cities.length }, (_, i) => i);
        console.log("Cities:", cities);

        let minDistance = Infinity;
        let bestRoute: number[] = [];
        const permutations = getPermutations(cityIndices);
        console.log("Number of permutations:", permutations.length);

        for (const perm of permutations) {
          let distance = 0;
          console.log("Checking permutation:", perm.map(i => cities[i].name).join(" -> "));
          for (let i = 0; i < perm.length; i++) {
            const city1 = cities[perm[i]];
            const city2 = cities[perm[(i + 1) % perm.length]];
            const segmentDistance = Math.sqrt((city2.x - city1.x) ** 2 + (city2.y - city1.y) ** 2);
            distance += segmentDistance;
            console.log(`  Distance from ${city1.name} to ${city2.name}: ${segmentDistance.toFixed(2)}`);
          }
          console.log(`Total distance for this permutation: ${distance.toFixed(2)}`);
          if (distance < minDistance) {
            minDistance = distance;
            bestRoute = perm;
            console.log(`New best route found: ${distance.toFixed(2)}`);
          }
        }

        console.log("Calculation complete. Optimal distance:", minDistance.toFixed(2));
        console.log("Best route:", bestRoute.map(i => cities[i].name).join(" -> "));
        setOptimalDistance(minDistance);
      } catch (error) {
        console.error("Error calculating optimal path:", error);
      } finally {
        setIsCalculating(false);
      }
    }, 0);
  };

  const getPermutations = (arr: number[]): number[][] => {
    if (arr.length <= 1) return [arr];
    return arr.flatMap((item, i) => 
      getPermutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map(p => [item, ...p])
    );
  };

  // Add this useEffect to log when optimalDistance changes
  useEffect(() => {
    console.log("Optimal distance updated:", optimalDistance);
  }, [optimalDistance]);

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
      backgroundColor: '#0078D7', // Blue background
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      marginBottom: '2rem',
    },
    title: {
      fontFamily: 'Arial, sans-serif',
      fontSize: 'min(70px, 8vw)', // Responsive font size
      fontWeight: 'bold',
      color: 'white',
      textShadow:
        '0.04em 0.04em 0px #FF0000, ' + // Bottom layer (red)
        '0.08em 0.08em 0px #FFD700',    // Middle layer (yellow)
      padding: '10px',
      display: 'inline-block',
      textTransform: 'uppercase',
      letterSpacing: '2px',
    },
    controls: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '1rem',
      gap: '1rem',
    },
    buttonRow: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
    },
    button: {
      cursor: 'pointer',
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      fontSize: '1rem',
      transition: 'background-color 0.3s ease',
    },
    buttonBlue: {
      backgroundColor: '#4299e1',
      color: 'white',
    },
    buttonGreen: {
      backgroundColor: '#48bb78',
      color: 'white',
    },
    canvasContainer: {
      position: 'relative',
      border: '4px solid #90cdf4',
      borderRadius: '0.5rem',
      backgroundColor: 'white',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    scoreDisplay: {
      marginTop: '1rem',
      textAlign: 'center',
    },
    scoreText: {
      fontSize: '1.125rem',
      color: '#2a4365',
    },
  };

  return (
    <div style={styles.appContainer}>
      <div style={styles.gameContainer}>
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>TSP Adventure</h1>
        </div>
        {/* Controls */}
        <div style={styles.controls}>
          <div style={styles.buttonRow}>
            <button 
              onClick={() => {
                console.log('Random Challenge clicked');
                setCurrentChallenge(null);
              }} 
              style={{...styles.button, ...styles.buttonGreen}}
            >
              Random Challenge
            </button>
            <Select onValueChange={handleChallengeChange} value={currentChallenge || ''}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a challenge" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TSPChallenges).map(([key, challenge]) => (
                  <SelectItem key={key} value={key}>{challenge.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {!currentChallenge && (
            <div style={{width: '100%', maxWidth: '32rem'}}>
              <p style={styles.scoreText}>Number of Cities: {cityCount}</p>
              <Slider
                defaultValue={[5]}
                max={12}
                min={2}
                step={1}
                onValueChange={handleCityCountChange}
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
          {showCongrats && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#faf089',
              color: '#744210',
              padding: '1rem',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              animation: 'bounce 1s infinite',
            }}>
              <Award style={{display: 'inline-block', marginRight: '0.5rem'}} />
              New Best Score!
            </div>
          )}
        </div>
        {/* Score */}
        <div style={styles.scoreDisplay}>
          <p style={styles.scoreText}>Distance: <span style={{fontWeight: 'bold'}}>{score.toFixed(2)}</span></p>
          <p style={styles.scoreText}>Best Score: <span style={{fontWeight: 'bold'}}>{bestScore === Infinity ? 'N/A' : bestScore.toFixed(2)}</span></p>
        </div>

        {/* Buttons */}
        <div style={{...styles.buttonRow, marginTop: '1rem'}}>
          <button onClick={resetGame} style={{...styles.button, ...styles.buttonBlue}}>Reset Game</button>
          <button 
            onClick={calculateOptimalPath} 
            style={{...styles.button, ...styles.buttonGreen}}
            disabled={isCalculating}
          >
            {isCalculating ? 'Calculating...' : 'Calculate Optimal Path'}
          </button>
        </div>

        {/* Optimal Path Result */}
        {isCalculating && <p style={styles.scoreText}>Calculating optimal path...</p>}
        {!isCalculating && optimalDistance !== null && (
          <p style={{...styles.scoreText, marginTop: '0.5rem'}}>
            Optimal Path Distance: <span style={{fontWeight: 'bold'}}>{optimalDistance.toFixed(2)}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default TravelingSalesmanGame;
