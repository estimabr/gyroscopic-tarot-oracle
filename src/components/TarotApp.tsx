import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TarotCard from './TarotCard';
import { toast } from 'sonner';

interface TarotCardData {
  id: number;
  name: string;
  meaning: string;
  isFlipped: boolean;
  isSelected: boolean;
  position: { x: number; y: number; rotation: number };
}

const tarotCards = [
  { name: "O Mago", meaning: "Manifestação de poder pessoal e habilidades." },
  { name: "A Sacerdotisa", meaning: "Intuição, mistério e sabedoria interior." },
  { name: "A Imperatriz", meaning: "Fertilidade, criatividade e abundância." },
  { name: "O Imperador", meaning: "Autoridade, estrutura e liderança." },
  { name: "O Hierofante", meaning: "Tradição, ensino espiritual e conformidade." },
  { name: "Os Amantes", meaning: "Relacionamentos, escolhas e harmonia." },
  { name: "A Carruagem", meaning: "Determinação, controle e vitória." },
  { name: "A Força", meaning: "Coragem interior, paciência e compaixão." },
  { name: "O Eremita", meaning: "Busca interior, orientação e sabedoria." },
  { name: "A Roda da Fortuna", meaning: "Mudanças, ciclos e destino." },
  { name: "A Justiça", meaning: "Equilíbrio, verdade e responsabilidade." },
  { name: "O Enforcado", meaning: "Suspensão, sacrifício e nova perspectiva." },
  { name: "A Morte", meaning: "Transformação, renovação e novos começos." },
  { name: "A Temperança", meaning: "Moderação, paciência e cura." },
  { name: "O Diabo", meaning: "Tentação, materialismo e prisões internas." },
  { name: "A Torre", meaning: "Mudanças súbitas e revelações." },
  { name: "A Estrela", meaning: "Esperança, inspiração e orientação." },
  { name: "A Lua", meaning: "Ilusões, medos e subconsciente." },
  { name: "O Sol", meaning: "Sucesso, vitalidade e alegria." },
  { name: "O Julgamento", meaning: "Renovação, perdão e chamado superior." },
  { name: "O Mundo", meaning: "Realização, conclusão e totalidade." }
];

const TarotApp = () => {
  const [cards, setCards] = useState<TarotCardData[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [gamePhase, setGamePhase] = useState<'question' | 'shuffle' | 'select' | 'reading'>('question');
  const [reading, setReading] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState<string>('');

  useEffect(() => {
    initializeCards();
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

  const generateRandomPosition = () => ({
    x: Math.random() * 400 + 50,
    y: Math.random() * 300 + 50,
    rotation: Math.random() * 360 - 180
  });

  const handleCardPositionChange = (cardId: number, newPosition: { x: number; y: number; rotation: number }) => {
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === cardId
          ? { ...card, position: newPosition }
          : card
      )
    );
  };

  const handleQuestionSubmit = () => {
    if (question.trim()) {
      setGamePhase('shuffle');
      toast.success('Pergunta registrada! Agora embaralhe as cartas.');
    } else {
      toast.error('Por favor, digite sua pergunta antes de continuar.');
    }
  };

  const shuffleCards = () => {
    setIsShuffling(true);
    
    // Simula movimento do giroscópio
    const shuffleInterval = setInterval(() => {
      setCards(prevCards => 
        prevCards.map(card => ({
          ...card,
          position: generateRandomPosition()
        }))
      );
    }, 100);

    setTimeout(() => {
      clearInterval(shuffleInterval);
      setIsShuffling(false);
      setGamePhase('select');
      toast.success('Cartas embaralhadas! Agora selecione 3 cartas para sua leitura.');
    }, 3000);
  };

  const selectCard = (cardId: number) => {
    if (selectedCards.length >= 3 || selectedCards.includes(cardId)) return;

    const newSelectedCards = [...selectedCards, cardId];
    setSelectedCards(newSelectedCards);

    setCards(prevCards =>
      prevCards.map(card =>
        card.id === cardId
          ? { ...card, isSelected: true, isFlipped: true }
          : card
      )
    );

    if (newSelectedCards.length === 3) {
      setTimeout(() => {
        generateReading(newSelectedCards);
      }, 1000);
    }
  };

  const generateReading = async (selectedCardIds: number[]) => {
    setIsLoading(true);
    setGamePhase('reading');

    // Simula chamada para API de IA
    setTimeout(() => {
      const selectedCardData = selectedCardIds.map(id => cards[id]);
      const mockReading = `
        🔮 Resposta para sua pergunta: "${question}" 🔮
        
        Passado - ${selectedCardData[0]?.name}: ${selectedCardData[0]?.meaning}
        
        Presente - ${selectedCardData[1]?.name}: ${selectedCardData[1]?.meaning}
        
        Futuro - ${selectedCardData[2]?.name}: ${selectedCardData[2]?.meaning}
        
        Com base em sua pergunta "${question}", as cartas revelam um caminho de transformação. O passado mostra as bases que você construiu, o presente indica as oportunidades atuais, e o futuro promete a realização de seus objetivos. Mantenha-se focado em seus propósitos e confie na sua intuição para tomar as decisões certas.
      `;
      
      setReading(mockReading);
      setIsLoading(false);
    }, 2000);
  };

  const resetGame = () => {
    setSelectedCards([]);
    setGamePhase('question');
    setReading('');
    setIsLoading(false);
    setQuestion('');
    initializeCards();
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text mystical-gradient mb-2">
            ✦ Tarot Místico ✦
          </h1>
          <p className="text-muted-foreground">
            Faça sua pergunta, embaralhe as cartas e descubra o que o universo tem a revelar
          </p>
        </div>

        {gamePhase === 'question' && (
          <Card className="bg-card/80 backdrop-blur-sm border-gold-400 mb-8 max-w-md mx-auto">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="question" className="text-gold-400 font-semibold">
                    Qual é sua pergunta para o Tarot?
                  </Label>
                  <Input
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ex: O que devo saber sobre meu futuro profissional?"
                    className="mt-2 bg-background/50 border-gold-400/30 text-foreground"
                    onKeyPress={(e) => e.key === 'Enter' && handleQuestionSubmit()}
                  />
                </div>
                <Button 
                  onClick={handleQuestionSubmit}
                  className="w-full mystical-gradient text-white font-bold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  ✨ Continuar para o Embaralhamento
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {gamePhase === 'shuffle' && (
          <div className="text-center mb-8">
            <Button 
              onClick={shuffleCards}
              disabled={isShuffling}
              size="lg"
              className="mystical-gradient text-white font-bold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isShuffling ? '🌟 Embaralhando...' : '🎴 Embaralhar Cartas'}
            </Button>
          </div>
        )}

        {gamePhase === 'select' && (
          <div className="text-center mb-8">
            <p className="text-lg text-gold-400 font-semibold">
              Selecione 3 cartas ({selectedCards.length}/3)
            </p>
          </div>
        )}

        {(gamePhase === 'shuffle' || gamePhase === 'select') && (
          <div className="relative w-full h-96 border-2 border-dashed border-mystic-600 rounded-lg mb-8 overflow-hidden">
            {cards.map(card => (
              <TarotCard
                key={card.id}
                id={card.id}
                name={card.name}
                isFlipped={card.isFlipped}
                isSelected={card.isSelected}
                isShuffling={isShuffling}
                position={card.position}
                onSelect={selectCard}
                onPositionChange={handleCardPositionChange}
              />
            ))}
          </div>
        )}

        {gamePhase === 'reading' && (
          <Card className="bg-card/80 backdrop-blur-sm border-gold-400">
            <CardContent className="p-6">
              {isLoading ? (
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gold-400">A IA está interpretando suas cartas...</p>
                </div>
              ) : (
                <div>
                  <pre className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">
                    {reading}
                  </pre>
                  <div className="mt-6 text-center">
                    <Button 
                      onClick={resetGame}
                      variant="outline"
                      className="border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-black"
                    >
                      Nova Consulta
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TarotApp;
