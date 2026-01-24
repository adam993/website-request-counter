import { useState, useEffect } from 'react';

const symbols = ['⚡', '🔮', '💻', '🐛', '☕', '🚀', '⚙️', '🎯'];

export default function HoroscopeWheel() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-64 h-64 mx-auto my-8">
      {/* Outer ring */}
      <div className="absolute inset-0 border-4 border-terminal-border rounded-full animate-spin-slow opacity-50"></div>

      {/* Middle ring */}
      <div className="absolute inset-8 border-2 border-green-400 rounded-full animate-spin-slow opacity-70" style={{ animationDirection: 'reverse' }}></div>

      {/* Inner ring with symbols */}
      <div className="absolute inset-0 flex items-center justify-center">
        {symbols.map((symbol, index) => {
          const angle = (index * 360) / symbols.length + rotation;
          const x = Math.cos((angle * Math.PI) / 180) * 90;
          const y = Math.sin((angle * Math.PI) / 180) * 90;

          return (
            <div
              key={index}
              className="absolute text-3xl transition-all duration-100"
              style={{
                transform: `translate(${x}px, ${y}px)`,
                textShadow: '0 0 10px #00ff00',
              }}
            >
              {symbol}
            </div>
          );
        })}
      </div>

      {/* Center crystal ball */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-pulse-glow shadow-lg shadow-green-500/50 flex items-center justify-center text-4xl">
          🔮
        </div>
      </div>

      {/* Scan line effect */}
      <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
        <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-50 animate-pulse"></div>
      </div>
    </div>
  );
}
