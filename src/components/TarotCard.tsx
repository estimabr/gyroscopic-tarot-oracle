
import { useState, useRef, useEffect } from 'react';
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
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isShuffling || isSelected) return;
    
    const touch = e.touches[0];
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      });
    }
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isShuffling || isSelected) return;
    
    const container = cardRef.current?.parentElement;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const newX = e.clientX - containerRect.left - dragStart.x;
    const newY = e.clientY - containerRect.top - dragStart.y;
    
    // Constrain to container bounds
    const cardWidth = 80; // w-20 = 80px
    const cardHeight = 128; // h-32 = 128px
    const maxX = container.clientWidth - cardWidth;
    const maxY = container.clientHeight - cardHeight;
    
    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));
    
    onPositionChange(id, {
      x: constrainedX,
      y: constrainedY,
      rotation: position.rotation
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isShuffling || isSelected) return;
    
    const touch = e.touches[0];
    const container = cardRef.current?.parentElement;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const newX = touch.clientX - containerRect.left - dragStart.x;
    const newY = touch.clientY - containerRect.top - dragStart.y;
    
    const cardWidth = 80;
    const cardHeight = 128;
    const maxX = container.clientWidth - cardWidth;
    const maxY = container.clientHeight - cardHeight;
    
    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));
    
    onPositionChange(id, {
      x: constrainedX,
      y: constrainedY,
      rotation: position.rotation
    });
    e.preventDefault();
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!isDragging && !isFlipped && !isSelected && !isShuffling) {
      onSelect(id);
    }
  };

  useEffect(() => {
    if (isDragging) {
      const handleMouseMoveGlobal = (e: MouseEvent) => {
        const container = cardRef.current?.parentElement;
        if (!container) return;
        
        const containerRect = container.getBoundingClientRect();
        const newX = e.clientX - containerRect.left - dragStart.x;
        const newY = e.clientY - containerRect.top - dragStart.y;
        
        const cardWidth = 80;
        const cardHeight = 128;
        const maxX = container.clientWidth - cardWidth;
        const maxY = container.clientHeight - cardHeight;
        
        const constrainedX = Math.max(0, Math.min(newX, maxX));
        const constrainedY = Math.max(0, Math.min(newY, maxY));
        
        onPositionChange(id, {
          x: constrainedX,
          y: constrainedY,
          rotation: position.rotation
        });
      };
      
      const handleTouchMoveGlobal = (e: TouchEvent) => {
        const touch = e.touches[0];
        const container = cardRef.current?.parentElement;
        if (!container) return;
        
        const containerRect = container.getBoundingClientRect();
        const newX = touch.clientX - containerRect.left - dragStart.x;
        const newY = touch.clientY - containerRect.top - dragStart.y;
        
        const cardWidth = 80;
        const cardHeight = 128;
        const maxX = container.clientWidth - cardWidth;
        const maxY = container.clientHeight - cardHeight;
        
        const constrainedX = Math.max(0, Math.min(newX, maxX));
        const constrainedY = Math.max(0, Math.min(newY, maxY));
        
        onPositionChange(id, {
          x: constrainedX,
          y: constrainedY,
          rotation: position.rotation
        });
        e.preventDefault();
      };

      document.addEventListener('mousemove', handleMouseMoveGlobal);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMoveGlobal, { passive: false });
      document.addEventListener('touchend', handleEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMoveGlobal);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleTouchMoveGlobal);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, dragStart, id, onPositionChange, position.rotation]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "absolute w-16 h-24 sm:w-20 sm:h-32 cursor-pointer transform transition-all duration-500 card-container smooth-scale",
        isShuffling && "animate-pulse-gentle floating-animation",
        isSelected && "z-50 scale-110 animate-rainbow-glow",
        isFlipped && "gentle-bounce",
        isDragging && "z-40 scale-105 rotate-2",
        !isShuffling && !isSelected && "hover:z-30"
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `rotate(${position.rotation}deg) ${isSelected ? 'scale(1.1)' : isDragging ? 'scale(1.05)' : 'scale(1)'}`,
        zIndex: isSelected ? 50 : isDragging ? 40 : isShuffling ? 20 : 10,
        cursor: isDragging ? 'grabbing' : (isShuffling || isSelected) ? 'default' : 'grab',
        touchAction: 'none'
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
    >
      <div className={cn(
        "w-full h-full rounded-xl border-2 border-primary/30 shadow-lg transition-all duration-300 card-flip-3d backdrop-blur-sm",
        isHovering && !isSelected && !isDragging && "scale-105 shadow-xl border-primary/50",
        isSelected && "border-primary shadow-2xl",
        isDragging && "shadow-2xl border-primary/70",
        isFlipped && "flipped"
      )}>
        {/* Front face (flipped state) */}
        <div className={cn(
          "absolute inset-0 w-full h-full card-front-gradient rounded-xl flex flex-col items-center justify-center p-2 text-white card-face",
          !isFlipped && "opacity-0"
        )}>
          <div className="text-xs sm:text-sm font-bold text-center mb-1 drop-shadow-lg">{name}</div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm sparkle-animation">
              <span className="text-white font-bold text-sm sm:text-lg">✦</span>
            </div>
          </div>
        </div>
        
        {/* Back face (default state) */}
        <div className={cn(
          "absolute inset-0 w-full h-full card-back-gradient rounded-xl flex items-center justify-center card-face card-back",
          isFlipped && "opacity-0"
        )}>
          <div className="w-8 h-8 sm:w-12 sm:h-12 border-2 border-primary/50 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border border-primary/30 rounded-full flex items-center justify-center">
              <span className="text-primary text-sm sm:text-lg sparkle-animation">✧</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarotCard;
