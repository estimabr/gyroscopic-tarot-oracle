
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TarotCardProps {
  id: number;
  name: string;
  isFlipped: boolean;
  isSelected: boolean;
  isShuffling: boolean;
  position: { x: number; y: number; rotation: number };
  onSelect: (id: number) => void;
}

const TarotCard = ({ 
  id, 
  name, 
  isFlipped, 
  isSelected, 
  isShuffling,
  position,
  onSelect 
}: TarotCardProps) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleClick = () => {
    if (!isFlipped && !isSelected) {
      onSelect(id);
    }
  };

  return (
    <div
      className={cn(
        "absolute w-20 h-32 cursor-pointer transform transition-all duration-500",
        isShuffling && "animate-card-shuffle",
        isSelected && "z-50 scale-110",
        isFlipped && "animate-card-flip"
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `rotate(${position.rotation}deg) ${isSelected ? 'scale(1.1)' : 'scale(1)'}`,
        zIndex: isSelected ? 50 : isShuffling ? 20 : 10
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      <div className={cn(
        "w-full h-full rounded-lg border-2 border-gold-400 shadow-lg transition-all duration-300",
        isHovering && !isSelected && "scale-105 shadow-xl",
        isSelected && "animate-mystical-glow border-gold-300"
      )}>
        {isFlipped ? (
          // Frente da carta
          <div className="w-full h-full mystical-gradient rounded-lg flex flex-col items-center justify-center p-2 text-white">
            <div className="text-xs font-bold text-center mb-1">{name}</div>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center">
                <span className="text-purple-900 font-bold text-sm">✦</span>
              </div>
            </div>
          </div>
        ) : (
          // Verso da carta
          <div className="w-full h-full card-back-gradient rounded-lg flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-gold-400 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border border-gold-400 rounded-full flex items-center justify-center">
                <span className="text-gold-400 text-lg">✧</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TarotCard;
