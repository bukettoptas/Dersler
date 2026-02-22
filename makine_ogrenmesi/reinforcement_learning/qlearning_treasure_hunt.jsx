import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Pause, Zap, Trophy, Brain, TrendingUp } from 'lucide-react';

const QLearningTreasureHunt = () => {
  // Grid configuration
  const GRID_SIZE = 6;
  const CELL_SIZE = 80;
  
  // Q-Learning parameters
  const [learningRate, setLearningRate] = useState(0.5);
  const [discountFactor, setDiscountFactor] = useState(0.9);
  const [explorationRate, setExplorationRate] = useState(0.3);
  const [speed, setSpeed] = useState(300);
  
  // Game state
  const [robotPos, setRobotPos] = useState({ x: 0, y: 0 });
  const [qTable, setQTable] = useState({});
  const [episode, setEpisode] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const [rewardHistory, setRewardHistory] = useState([0]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [lastAction, setLastAction] = useState(null);
  const [visitedStates, setVisitedStates] = useState(new Set());
  
  // Animation state
  const [animateReward, setAnimateReward] = useState(null);
  
  const intervalRef = useRef(null);
  
  // Grid layout: 0=empty, 1=obstacle, 2=small reward, 3=penalty, 4=treasure
  const grid = [
    [0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 1],
    [0, 3, 0, 0, 2, 0],
    [0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1, 0],
    [0, 3, 0, 4, 0, 1]
  ];
  
  // Actions
  const ACTIONS = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
  
  const getStateKey = (pos) => `${pos.x},${pos.y}`;
  
  const initializeQTable = () => {
    const newQTable = {};
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (grid[y][x] !== 1) {
          const stateKey = getStateKey({ x, y });
          newQTable[stateKey] = {
            UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0
          };
        }
      }
    }
    return newQTable;
  };
  
  const getNextPosition = (pos, action) => {
    const newPos = { ...pos };
    switch (action) {
      case 'UP': newPos.y = Math.max(0, pos.y - 1); break;
      case 'DOWN': newPos.y = Math.min(GRID_SIZE - 1, pos.y + 1); break;
      case 'LEFT': newPos.x = Math.max(0, pos.x - 1); break;
      case 'RIGHT': newPos.x = Math.min(GRID_SIZE - 1, pos.x + 1); break;
    }
    
    // Check if hitting obstacle
    if (grid[newPos.y][newPos.x] === 1) {
      return pos; // Stay in place
    }
    return newPos;
  };
  
  const getReward = (pos) => {
    const cell = grid[pos.y][pos.x];
    if (cell === 4) return 10; // Treasure
    if (cell === 2) return 2;  // Small reward
    if (cell === 3) return -5; // Penalty
    return -0.1; // Small penalty for each step
  };
  
  const chooseAction = (pos, explore) => {
    const stateKey = getStateKey(pos);
    
    // Exploration vs Exploitation
    if (explore && Math.random() < explorationRate) {
      return ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    }
    
    // Exploitation: choose best action
    const qValues = qTable[stateKey] || { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 };
    let maxQ = -Infinity;
    let bestActions = [];
    
    ACTIONS.forEach(action => {
      if (qValues[action] > maxQ) {
        maxQ = qValues[action];
        bestActions = [action];
      } else if (qValues[action] === maxQ) {
        bestActions.push(action);
      }
    });
    
    return bestActions[Math.floor(Math.random() * bestActions.length)];
  };
  
  const updateQValue = (state, action, reward, nextState) => {
    const stateKey = getStateKey(state);
    const nextStateKey = getStateKey(nextState);
    
    const currentQ = qTable[stateKey][action];
    const maxNextQ = Math.max(...Object.values(qTable[nextStateKey] || { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 }));
    
    const newQ = currentQ + learningRate * (reward + discountFactor * maxNextQ - currentQ);
    
    setQTable(prev => ({
      ...prev,
      [stateKey]: {
        ...prev[stateKey],
        [action]: newQ
      }
    }));
  };
  
  const step = () => {
    // Choose action
    const action = chooseAction(robotPos, true);
    setLastAction(action);
    
    // Take action
    const nextPos = getNextPosition(robotPos, action);
    const reward = getReward(nextPos);
    
    // Update Q-Table
    updateQValue(robotPos, action, reward, nextPos);
    
    // Update state
    setRobotPos(nextPos);
    setCurrentPath(prev => [...prev, nextPos]);
    setVisitedStates(prev => new Set([...prev, getStateKey(nextPos)]));
    
    // Update rewards
    const newTotalReward = totalReward + reward;
    setTotalReward(newTotalReward);
    
    // Animate reward
    setAnimateReward({ pos: nextPos, value: reward });
    setTimeout(() => setAnimateReward(null), 600);
    
    // Check if episode ended (found treasure or too many steps)
    if (grid[nextPos.y][nextPos.x] === 4 || currentPath.length > 30) {
      setEpisode(prev => prev + 1);
      setRewardHistory(prev => [...prev, newTotalReward]);
      
      // Reset for new episode
      setTimeout(() => {
        setRobotPos({ x: 0, y: 0 });
        setCurrentPath([]);
        setLastAction(null);
      }, 500);
    }
  };
  
  useEffect(() => {
    if (Object.keys(qTable).length === 0) {
      setQTable(initializeQTable());
    }
  }, []);
  
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(step, speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, robotPos, qTable, totalReward, currentPath, speed]);
  
  const handleReset = () => {
    setIsRunning(false);
    setRobotPos({ x: 0, y: 0 });
    setQTable(initializeQTable());
    setEpisode(0);
    setTotalReward(0);
    setRewardHistory([0]);
    setCurrentPath([]);
    setLastAction(null);
    setVisitedStates(new Set());
  };
  
  const getCellColor = (x, y) => {
    const cell = grid[y][x];
    if (cell === 1) return 'bg-slate-700';
    if (cell === 4) return 'bg-gradient-to-br from-yellow-400 to-amber-500';
    if (cell === 2) return 'bg-gradient-to-br from-green-400 to-emerald-500';
    if (cell === 3) return 'bg-gradient-to-br from-red-500 to-rose-600';
    
    const stateKey = getStateKey({ x, y });
    if (visitedStates.has(stateKey)) {
      return 'bg-blue-50';
    }
    return 'bg-white';
  };
  
  const getActionArrows = (x, y) => {
    const stateKey = getStateKey({ x, y });
    const qValues = qTable[stateKey];
    if (!qValues || grid[y][x] === 1) return null;
    
    const maxQ = Math.max(...Object.values(qValues));
    const minQ = Math.min(...Object.values(qValues));
    const range = maxQ - minQ || 1;
    
    return (
      <div className="absolute inset-0 pointer-events-none">
        {/* UP */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2"
             style={{ opacity: 0.3 + (qValues.UP - minQ) / range * 0.7 }}>
          <div className="text-xs text-blue-600">↑</div>
        </div>
        {/* RIGHT */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2"
             style={{ opacity: 0.3 + (qValues.RIGHT - minQ) / range * 0.7 }}>
          <div className="text-xs text-blue-600">→</div>
        </div>
        {/* DOWN */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2"
             style={{ opacity: 0.3 + (qValues.DOWN - minQ) / range * 0.7 }}>
          <div className="text-xs text-blue-600">↓</div>
        </div>
        {/* LEFT */}
        <div className="absolute left-1 top-1/2 -translate-y-1/2"
             style={{ opacity: 0.3 + (qValues.LEFT - minQ) / range * 0.7 }}>
          <div className="text-xs text-blue-600">←</div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            🤖 Robot's Treasure Hunt
          </h1>
          <p className="text-lg text-gray-600">Q-Learning ile Pekiştirmeli Öğrenme</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <div className="relative inline-block">
                <div className="grid gap-1 bg-gray-100 p-4 rounded-xl"
                     style={{ 
                       gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                       gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`
                     }}>
                  {grid.map((row, y) => 
                    row.map((cell, x) => (
                      <div key={`${x}-${y}`}
                           className={`relative ${getCellColor(x, y)} rounded-lg border-2 border-gray-200 transition-all duration-300`}>
                        
                        {/* Cell content */}
                        {cell === 1 && (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            🧱
                          </div>
                        )}
                        {cell === 4 && (
                          <div className="w-full h-full flex items-center justify-center text-4xl animate-bounce">
                            💰
                          </div>
                        )}
                        {cell === 2 && (
                          <div className="w-full h-full flex items-center justify-center text-3xl">
                            💎
                          </div>
                        )}
                        {cell === 3 && (
                          <div className="w-full h-full flex items-center justify-center text-3xl">
                            🔥
                          </div>
                        )}
                        
                        {/* Q-value arrows */}
                        {getActionArrows(x, y)}
                        
                        {/* Robot */}
                        {robotPos.x === x && robotPos.y === y && (
                          <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="text-5xl animate-pulse">
                              🤖
                            </div>
                          </div>
                        )}
                        
                        {/* Path trace */}
                        {currentPath.some(p => p.x === x && p.y === y) && (
                          <div className="absolute inset-0 bg-blue-200 opacity-30 rounded-lg"></div>
                        )}
                        
                        {/* Reward animation */}
                        {animateReward && animateReward.pos.x === x && animateReward.pos.y === y && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce">
                            <div className={`text-xl font-bold ${animateReward.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {animateReward.value > 0 ? '+' : ''}{animateReward.value}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                
                {/* Legend */}
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded"></div>
                    <span>Hazine (+10)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded"></div>
                    <span>Ödül (+2)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-rose-600 rounded"></div>
                    <span>Tuzak (-5)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-slate-700 rounded"></div>
                    <span>Engel</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Control Panel */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Brain className="text-purple-600" />
                Öğrenme İstatistikleri
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Episode</div>
                  <div className="text-3xl font-bold text-indigo-600">{episode}</div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Toplam Ödül</div>
                  <div className="text-3xl font-bold text-green-600">
                    {totalReward.toFixed(1)}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Son Aksiyon</div>
                  <div className="text-xl font-bold text-purple-600">
                    {lastAction || '—'}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Ziyaret Edilen</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {visitedStates.size} / {GRID_SIZE * GRID_SIZE - grid.flat().filter(c => c === 1).length}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="text-yellow-600" />
                Kontroller
              </h2>
              
              <div className="space-y-4">
                {/* Learning Rate */}
                <div>
                  <label className="text-sm font-medium text-gray-700 flex justify-between">
                    <span>Öğrenme Oranı (α)</span>
                    <span className="text-indigo-600">{learningRate.toFixed(2)}</span>
                  </label>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="0.9" 
                    step="0.1"
                    value={learningRate}
                    onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                    className="w-full mt-2 accent-indigo-600"
                  />
                </div>
                
                {/* Discount Factor */}
                <div>
                  <label className="text-sm font-medium text-gray-700 flex justify-between">
                    <span>İndirim Faktörü (γ)</span>
                    <span className="text-purple-600">{discountFactor.toFixed(2)}</span>
                  </label>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="0.99" 
                    step="0.05"
                    value={discountFactor}
                    onChange={(e) => setDiscountFactor(parseFloat(e.target.value))}
                    className="w-full mt-2 accent-purple-600"
                  />
                </div>
                
                {/* Exploration Rate */}
                <div>
                  <label className="text-sm font-medium text-gray-700 flex justify-between">
                    <span>Keşif Oranı (ε)</span>
                    <span className="text-pink-600">{explorationRate.toFixed(2)}</span>
                  </label>
                  <input 
                    type="range" 
                    min="0.0" 
                    max="1.0" 
                    step="0.1"
                    value={explorationRate}
                    onChange={(e) => setExplorationRate(parseFloat(e.target.value))}
                    className="w-full mt-2 accent-pink-600"
                  />
                </div>
                
                {/* Speed */}
                <div>
                  <label className="text-sm font-medium text-gray-700 flex justify-between">
                    <span>Hız</span>
                    <span className="text-green-600">{(1000/speed).toFixed(1)}x</span>
                  </label>
                  <input 
                    type="range" 
                    min="100" 
                    max="1000" 
                    step="100"
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                    className="w-full mt-2 accent-green-600"
                  />
                </div>
                
                {/* Buttons */}
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`flex-1 py-3 rounded-lg font-bold text-white transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${
                      isRunning 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                    }`}
                  >
                    {isRunning ? <><Pause size={20} /> Durdur</> : <><Play size={20} /> Başlat</>}
                  </button>
                  
                  <button
                    onClick={handleReset}
                    className="px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg font-bold transition-all transform hover:scale-105"
                  >
                    <RotateCcw size={20} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Reward Chart */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="text-blue-600" />
                Ödül Grafiği
              </h2>
              
              <div className="h-40 flex items-end gap-1">
                {rewardHistory.slice(-20).map((reward, i) => {
                  const maxReward = Math.max(...rewardHistory.slice(-20));
                  const minReward = Math.min(...rewardHistory.slice(-20));
                  const range = maxReward - minReward || 1;
                  const height = ((reward - minReward) / range) * 100;
                  
                  return (
                    <div 
                      key={i}
                      className="flex-1 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-t transition-all duration-300"
                      style={{ height: `${Math.max(height, 5)}%` }}
                      title={`Episode ${episode - 20 + i + 1}: ${reward.toFixed(1)}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Info */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">💡 Nasıl Çalışır?</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="font-bold text-blue-800 mb-2">🎯 Q-Learning</div>
              Robot her adımda en iyi aksiyonu öğrenir. Oklar Q-değerlerini gösterir - daha koyu oklar daha iyi aksiyonları temsil eder.
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="font-bold text-purple-800 mb-2">🔍 Keşif vs Sömürü</div>
              ε (epsilon) parametresi rastgele keşif oranını kontrol eder. Yüksek değer daha fazla keşif, düşük değer daha fazla sömürü demektir.
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="font-bold text-green-800 mb-2">📈 Öğrenme Süreci</div>
              Robot zamanla en kısa ve en ödüllü yolu öğrenir. Grafikte ödüllerin artışını gözlemleyebilirsiniz!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QLearningTreasureHunt;
