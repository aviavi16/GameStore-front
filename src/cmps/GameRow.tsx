import { useState, useRef, useEffect } from 'react';

interface Game {
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  isFake?: boolean,
  bgg?: {
    description: string;
    minPlayers: number;
    maxPlayers: number;
    playingTime: number;
    complexity: number;
    categories: string[];
    mechanics: string[];
  };
}

export default function GameRow({ game }: { game: Game }) {
  const [showMore, setShowMore] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState('0px');
  const MAX_DESCRIPTION_LENGTH = 160;
  const fullDescription = game.description || game.bgg?.description || '';
  const shortDescription =
    fullDescription.length > MAX_DESCRIPTION_LENGTH
      ? fullDescription.slice(0, MAX_DESCRIPTION_LENGTH) + '...'
      : fullDescription;
  
  useEffect(() => {
    if (showMore && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setMaxHeight('0px');
    }
  }, [showMore]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 py-4 border-b border-gray-300 dark:border-gray-700 transition-all">
      <img
        src={game.imageUrl || '/fallback.jpg'}
        alt={game.name}
        className="w-full sm:w-40 h-32 object-cover rounded-md shadow"
      />
      <div className="flex-1">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        {game.name}
        {game.isFake && (
          <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
            🔻 DEMO
          </span>
        )}
      </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          {showMore ? fullDescription : shortDescription}
        </p>
        <p className="text-xs text-gray-500 mt-2">📅 Added: {game.createdAt}</p>

        {fullDescription.length > MAX_DESCRIPTION_LENGTH && (
          <button
          onClick={() => setShowMore(!showMore)}
          className="mt-2 px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center gap-2"
        >
          {showMore ? 'Hide Info' : 'More Info'}
          <span
            className={`transform transition-transform duration-300 ${
              showMore ? 'rotate-180' : ''
            }`}
          >
            ⬇️
          </span>
        </button>
        )}

        {/* Animated Expandable Section */}
        <div
          ref={contentRef}
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight }}
        >
          {game.bgg && (
            <div className="mt-3 text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded-md space-y-2">
              <p>👥 Players: {game.bgg.minPlayers}–{game.bgg.maxPlayers}</p>
              <p>⏱️ Play Time: {game.bgg.playingTime} min</p>
              <p>🎯 Complexity: {game.bgg.complexity.toFixed(2)} / 5</p>
              <p>📂 Categories: {game.bgg.categories.join(', ')}</p>
              <p>⚙️ Mechanics: {game.bgg.mechanics.join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
