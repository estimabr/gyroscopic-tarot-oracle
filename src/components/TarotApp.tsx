import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TarotCard from './TarotCard';
import { toast } from 'sonner';
import { Shuffle, Sparkles, Moon, Sun, Heart, Star, Zap } from 'lucide-react';
interface TarotCardData {
  id: number;
  name: string;
  meaning: string;
  isFlipped: boolean;
  isSelected: boolean;
  position: {
    x: number;
    y: number;
    rotation: number;
  };
}
const tarotCards = [{
  name: "O Mago",
  meaning: "Manifestação de poder pessoal e habilidades."
}, {
  name: "A Sacerdotisa",
  meaning: "Intuição, mistério e sabedoria interior."
}, {
  name: "A Imperatriz",
  meaning: "Fertilidade, criatividade e abundância."
}, {
  name: "O Imperador",
  meaning: "Autoridade, estrutura e liderança."
}, {
  name: "O Hierofante",
  meaning: "Tradição, ensino espiritual e conformidade."
}, {
  name: "Os Amantes",
  meaning: "Relacionamentos, escolhas e harmonia."
}, {
  name: "A Carruagem",
  meaning: "Determinação, controle e vitória."
}, {
  name: "A Força",
  meaning: "Coragem interior, paciência e compaixão."
}, {
  name: "O Eremita",
  meaning: "Busca interior, orientação e sabedoria."
}, {
  name: "A Roda da Fortuna",
  meaning: "Mudanças, ciclos e destino."
}, {
  name: "A Justiça",
  meaning: "Equilíbrio, verdade e responsabilidade."
}, {
  name: "O Enforcado",
  meaning: "Suspensão, sacrifício e nova perspectiva."
}, {
  name: "A Morte",
  meaning: "Transformação, renovação e novos começos."
}, {
  name: "A Temperança",
  meaning: "Moderação, paciência e cura."
}, {
  name: "O Diabo",
  meaning: "Tentação, materialismo e prisões internas."
}, {
  name: "A Torre",
  meaning: "Mudanças súbitas e revelações."
}, {
  name: "A Estrela",
  meaning: "Esperança, inspiração e orientação."
}, {
  name: "A Lua",
  meaning: "Ilusões, medos e subconsciente."
}, {
  name: "O Sol",
  meaning: "Sucesso, vitalidade e alegria."
}, {
  name: "O Julgamento",
  meaning: "Renovação, perdão e chamado superior."
}, {
  name: "O Mundo",
  meaning: "Realização, conclusão e totalidade."
}];
const TarotApp = () => {
  const [cards, setCards] = useState<TarotCardData[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [gamePhase, setGamePhase] = useState<'question' | 'shuffle' | 'select' | 'reading'>('question');
  const [reading, setReading] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState<string>('');
  const [shuffleCount, setShuffleCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    initializeCards();
    // Check for system dark mode preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  const initializeCards = () => {
    const initialCards = tarotCards.map((card, index) => ({
      id: index,
      name: card.name,
      meaning: card.meaning,
      isFlipped: false,
      isSelected: false,
      position: generateRandomPosition()
    }));
    setCards(initialCards);
  };
  const generateRandomPosition = () => {
    // Make positions more responsive
    const containerWidth = window.innerWidth < 768 ? 300 : 500;
    const containerHeight = window.innerWidth < 768 ? 200 : 300;
    return {
      x: Math.random() * (containerWidth - 80) + 10,
      y: Math.random() * (containerHeight - 128) + 10,
      rotation: Math.random() * 60 - 30 // Reduced rotation for better UX
    };
  };
  const handleCardPositionChange = (cardId: number, newPosition: {
    x: number;
    y: number;
    rotation: number;
  }) => {
    setCards(prevCards => prevCards.map(card => card.id === cardId ? {
      ...card,
      position: newPosition
    } : card));
  };
  const handleQuestionSubmit = () => {
    if (question.trim()) {
      setGamePhase('shuffle');
      toast.success('✨ Pergunta registrada! Agora embaralhe as cartas quando quiser.', {
        duration: 3000
      });
    } else {
      toast.error('🌙 Por favor, digite sua pergunta antes de continuar.', {
        duration: 3000
      });
    }
  };
  const shuffleCards = () => {
    setIsShuffling(true);
    setShuffleCount(prev => prev + 1);

    // Reset selected cards and flip states
    setSelectedCards([]);
    setCards(prevCards => prevCards.map(card => ({
      ...card,
      isSelected: false,
      isFlipped: false,
      position: generateRandomPosition()
    })));

    // Animate shuffle
    const shuffleInterval = setInterval(() => {
      setCards(prevCards => prevCards.map(card => ({
        ...card,
        position: generateRandomPosition()
      })));
    }, 150);
    setTimeout(() => {
      clearInterval(shuffleInterval);
      setIsShuffling(false);
      setGamePhase('select');
      toast.success(`🎴 Cartas embaralhadas ${shuffleCount + 1}x! Selecione 3 cartas tocando nelas.`, {
        duration: 4000
      });
    }, 2500);
  };
  const selectCard = (cardId: number) => {
    if (selectedCards.length >= 3 || selectedCards.includes(cardId)) return;
    const newSelectedCards = [...selectedCards, cardId];
    setSelectedCards(newSelectedCards);
    setCards(prevCards => prevCards.map(card => card.id === cardId ? {
      ...card,
      isSelected: true,
      isFlipped: true
    } : card));
    toast.success(`⭐ Carta ${newSelectedCards.length}/3 selecionada!`, {
      duration: 2000
    });
    if (newSelectedCards.length === 3) {
      setTimeout(() => {
        generateReading(newSelectedCards);
      }, 1500);
    }
  };
  const generateReading = async (selectedCardIds: number[]) => {
    setIsLoading(true);
    setGamePhase('reading');

    // Simulate AI API call
    setTimeout(() => {
      const selectedCardData = selectedCardIds.map(id => cards[id]);
      const mockReading = `
🔮 **Leitura das Cartas para: "${question}"** 🔮

**✨ PASSADO** - ${selectedCardData[0]?.name}
${selectedCardData[0]?.meaning}
Esta carta revela as influências que moldaram sua situação atual.

**🌟 PRESENTE** - ${selectedCardData[1]?.name}  
${selectedCardData[1]?.meaning}
Esta energia está ativa em sua vida neste momento.

**🌙 FUTURO** - ${selectedCardData[2]?.name}
${selectedCardData[2]?.meaning}
Esta é a direção para onde sua jornada está se encaminhando.

**💫 MENSAGEM FINAL**
O universo sussurra através dessas cartas que sua pergunta "${question}" encontra resposta na harmonia entre passado, presente e futuro. Confie em sua intuição e permita que a sabedoria ancestral dos arcanos ilumine seu caminho. As estrelas estão alinhadas a seu favor! ✨
      `;
      setReading(mockReading);
      setIsLoading(false);
      toast.success('🌟 Sua leitura está pronta!', {
        duration: 3000
      });
    }, 3000);
  };
  const resetGame = () => {
    setSelectedCards([]);
    setGamePhase('question');
    setReading('');
    setIsLoading(false);
    setQuestion('');
    setShuffleCount(0);
    initializeCards();
    toast.success('🔄 Nova consulta iniciada!', {
      duration: 2000
    });
  };
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  return <div className="min-h-screen p-2 sm:p-4 flex flex-col items-center relative overflow-hidden">
      {/* Background sparkles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => <div key={i} className="absolute w-1 h-1 bg-primary/30 rounded-full sparkle-animation" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`
      }} />)}
      </div>

      <div className="w-full max-w-6xl relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 animate-slide-up">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <Button onClick={toggleDarkMode} variant="ghost" size="icon" className="rounded-full">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text mystical-gradient mb-2 sm:mb-4">
            ✦ Oráculo Místico ✦
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Faça sua pergunta ao universo, embaralhe as cartas sagradas e descubra os segredos que as estrelas querem revelar
          </p>
        </div>

        {/* Question Phase */}
        {gamePhase === 'question' && <Card className="bg-card/80 backdrop-blur-sm border-primary/30 mb-6 sm:mb-8 max-w-md mx-auto shadow-xl animate-slide-up">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="question" className="text-primary font-semibold text-sm sm:text-base">
                    ✨ Qual é sua pergunta para o Oráculo?
                  </Label>
                  <Input id="question" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ex: O que devo saber sobre meu futuro profissional?" className="mt-2 bg-background/50 border-primary/30 text-foreground focus:border-primary/50 text-sm sm:text-base" onKeyPress={e => e.key === 'Enter' && handleQuestionSubmit()} />
                </div>
                <Button onClick={handleQuestionSubmit} className="w-full mystical-gradient text-white font-bold py-2 sm:py-3 text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 smooth-scale">
                  <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Continuar para o Embaralhamento
                </Button>
              </div>
            </CardContent>
          </Card>}

        {/* Shuffle Phase */}
        {gamePhase === 'shuffle' && <div className="text-center mb-6 sm:mb-8 animate-slide-up">
            <div className="mb-4">
              <p className="text-sm sm:text-base text-muted-foreground mb-2">
                {shuffleCount > 0 ? `Embaralhadas ${shuffleCount}x` : 'Pronto para embaralhar'}
              </p>
              <Button onClick={shuffleCards} disabled={isShuffling} size="lg" className="mystical-gradient text-white font-bold px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 smooth-scale">
                <Shuffle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {isShuffling ? '🌟 Embaralhando...' : '🎴 Embaralhar Cartas'}
              </Button>
            </div>
            
            {shuffleCount > 0 && !isShuffling && <Button onClick={shuffleCards} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 ml-2 sm:ml-4">
                <Shuffle className="mr-2 h-4 w-4" />
                Embaralhar Novamente
              </Button>}
          </div>}

        {/* Selection Phase */}
        {gamePhase === 'select' && <div className="text-center mb-6 sm:mb-8 animate-slide-up">
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-primary/20 shadow-lg max-w-md mx-auto">
              <div className="flex items-center justify-center mb-3">
                <Star className="h-5 w-5 text-accent mr-2 sparkle-animation" />
                <h3 className="text-lg sm:text-xl font-bold text-primary">Selecione 3 cartas tocando nelas</h3>
                <Star className="h-5 w-5 text-accent ml-2 sparkle-animation" />
              </div>
              
              <div className="flex justify-center items-center space-x-2 mb-3">
                <div className="flex space-x-1">
                  {[0, 1, 2].map(index => <div key={index} className={`w-3 h-3 rounded-full transition-all duration-300 ${selectedCards.length > index ? 'bg-accent animate-pulse-gentle' : 'bg-muted border-2 border-primary/30'}`} />)}
                </div>
                <span className="text-primary font-semibold text-lg">
                  ({selectedCards.length}/3)
                </span>
              </div>
              
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                Você pode arrastar as cartas para organizá-las antes de selecionar
              </p>
              
              <Button onClick={shuffleCards} variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary/10 smooth-scale">
                <Shuffle className="mr-2 h-4 w-4" />
                Embaralhar Novamente
              </Button>
            </div>
          </div>}

        {/* Cards Container - Centralized */}
        {(gamePhase === 'shuffle' || gamePhase === 'select') && <div className="flex-1 flex items-center justify-center mb-8">
            <div className="relative w-full max-w-4xl h-64 sm:h-96 border-2 border-dashed border-primary/30 rounded-xl overflow-hidden bg-card/20 backdrop-blur-sm shadow-inner">
              {cards.map(card => <TarotCard key={card.id} id={card.id} name={card.name} isFlipped={card.isFlipped} isSelected={card.isSelected} isShuffling={isShuffling} position={card.position} onSelect={selectCard} onPositionChange={handleCardPositionChange} />)}
            </div>
          </div>}

        {/* Reading Phase */}
        {gamePhase === 'reading' && <div className="flex-1">
            <Card className="bg-card/80 backdrop-blur-sm border-primary/30 shadow-xl animate-slide-up">
              <CardContent className="p-4 sm:p-6">
                {isLoading ? <div className="text-center py-8 sm:py-12">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-4 sm:mb-6 animate-spin"></div>
                    <p className="text-primary text-sm sm:text-base font-medium">
                      🔮 O Oráculo está interpretando suas cartas...
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                      As energias cósmicas estão se alinhando
                    </p>
                  </div> : <div>
                    <div className="prose prose-sm sm:prose-base max-w-none">
                      <pre className="text-foreground whitespace-pre-wrap text-xs sm:text-sm leading-relaxed font-sans">
                        {reading}
                      </pre>
                    </div>
                    <div className="mt-6 sm:mt-8 text-center">
                      <Button onClick={resetGame} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 smooth-scale">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Nova Consulta
                      </Button>
                    </div>
                  </div>}
              </CardContent>
            </Card>
          </div>}
      </div>

      {/* Incredible Footer */}
      <footer className="w-full mt-auto relative z-10">
        <div className="mystical-gradient rounded-t-3xl backdrop-blur-sm border-t-2 border-primary/30 shadow-2xl">
          <div className="relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
              {[...Array(15)].map((_, i) => <div key={i} className="absolute opacity-20 sparkle-animation" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}>
                  <Star className="h-3 w-3 text-white" />
                </div>)}
            </div>
            
            
          </div>
        </div>
      </footer>
    </div>;
};
export default TarotApp;