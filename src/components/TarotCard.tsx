
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TarotCardProps {
  id: number;
  name: string;
  isFlipped: boolean;
  isSelected: boolean;
  isShuffling: boolean;
  position: { x: number; y: number; rotation: number };
  onSelect: (id: number) => void;
  onPositionChange: (id: number, position: { x: number; y: number; rotation: number }) => void;
}

const TarotCard = ({ 
  id, 
  name, 
  isFlipped, 
  isSelected, 
  isShuffling,
  position,
  onSelect,
  onPositionChange
}: TarotCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isShuffling || isSelected) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    
    // Prevent text selection
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isShuffling || isSelected) return;
    
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
    
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isShuffling || isSelected) return;
    
    const newPosition = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
      rotation: position.rotation
    };
    
    onPositionChange(id, newPosition);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isShuffling || isSelected) return;
    
    const touch = e.touches[0];
    const newPosition = {
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
      rotation: position.rotation
    };
    
    onPositionChange(id, newPosition);
    e.preventDefault();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!isDragging && !isFlipped && !isSelected) {
      onSelect(id);
    }
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "absolute w-20 h-32 cursor-pointer transform transition-all duration-500",
        isShuffling && "animate-card-shuffle",
        isSelected && "z-50 scale-110",
        isFlipped && "animate-card-flip",
        isDragging && "z-40 scale-105",
        !isShuffling && !isSelected && "hover:z-30"
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `rotate(${position.rotation}deg) ${isSelected ? 'scale(1.1)' : isDragging ? 'scale(1.05)' : 'scale(1)'}`,
        zIndex: isSelected ? 50 : isDragging ? 40 : isShuffling ? 20 : 10,
        cursor: isDragging ? 'grabbing' : (isShuffling || isSelected) ? 'default' : 'grab'
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      <div className={cn(
        "w-full h-full rounded-lg border-2 border-gold-400 shadow-lg transition-all duration-300",
        isHovering && !isSelected && !isDragging && "scale-105 shadow-xl",
        isSelected && "animate-mystical-glow border-gold-300",
        isDragging && "shadow-2xl"
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
