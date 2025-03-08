import React, { useState } from 'react';
import { Send } from 'lucide-react';

function App() {
  const [roastLevel, setRoastLevel] = useState(0);
  const [input, setInput] = useState('');
  const [verified, setVerified] = useState(false);
  const [characterState, setCharacterState] = useState<'normal' | 'annoyed' | 'angry' | 'crying'>('normal');
  const [message, setMessage] = useState('');

  const roastThreshold = 75;
  
  const complimentWords = ['nice', 'good', 'great', 'awesome', 'beautiful', 'amazing', 'love', 'sweet', 'kind', 'wonderful'];
  const roastWords = [
    // Basic insults
    'bad', 'ugly', 'stupid', 'dumb', 'worst', 'hate', 'terrible', 'awful', 'horrible', 'loser',
    // Appearance-based
    'hideous', 'disgusting', 'gross', 'pathetic', 'weak', 'lame',
    // Intelligence-based
    'idiot', 'moron', 'fool', 'brainless', 'dimwit', 'dense', 'clueless',
    // Personality-based
    'annoying', 'useless', 'worthless', 'failure', 'joke', 'waste',
    // Common roast phrases
    'trash', 'garbage', 'suck', 'cringe', 'noob', 'loser', 'clown',
    // Emotional impact
    'disappointment', 'embarrassing', 'laughingstock', 'reject',
    // Phrases (checked differently)
    'your mom', 'yo mama', 'look like', 'even a', 'better than you'
  ];

  const isCompliment = (text: string) => {
    const lowercaseText = text.toLowerCase();
    return complimentWords.some(word => lowercaseText.includes(word));
  };

  const isRoast = (text: string) => {
    const lowercaseText = text.toLowerCase();
    
    // Check for individual roast words
    if (roastWords.some(word => lowercaseText.includes(word))) {
      return true;
    }

    // Check for common roast patterns
    const roastPatterns = [
      /you(?:'re|r| are).*(?:so|such|really|just)/i,  // "you're so/such/really X"
      /can't even/i,                                   // "can't even X"
      /looks? like/i,                                  // "looks like X"
      /worse than/i,                                   // "worse than X"
      /\bwhat a\b/i,                                   // "what a X"
      /\bi've seen better\b/i,                         // "I've seen better X"
      /\bmy (?:grandma|dog)\b/i                        // "my grandma/dog X"
    ];

    return roastPatterns.some(pattern => pattern.test(lowercaseText));
  };

  const getCharacterEmoji = () => {
    switch(characterState) {
      case 'normal':
        return "😊";
      case 'annoyed':
        return "😤";
      case 'angry':
        return "😠";
      case 'crying':
        return "😭";
      default:
        return "😊";
    }
  };

  const handleRoast = () => {
    if (input.trim() === '') return;

    if (isCompliment(input)) {
      setMessage("Hey, that's too nice! You need to roast me! 😊");
      setCharacterState('normal');
      const newLevel = Math.max(0, roastLevel - 10);
      setRoastLevel(newLevel);
    } else if (isRoast(input)) {
      const impact = Math.min(25, Math.max(5, input.length * 2));
      const newLevel = Math.min(100, roastLevel + impact);
      setRoastLevel(newLevel);

      if (newLevel >= roastThreshold) {
        setCharacterState('crying');
        setVerified(true);
        setMessage("You broke me! Verification complete! 😭");
      } else if (newLevel >= 50) {
        setCharacterState('angry');
        setMessage("Now you're getting personal! 😠");
      } else if (newLevel >= 25) {
        setCharacterState('annoyed');
        setMessage("Oh yeah? Keep trying! 😤");
      } else {
        const responses = [
          "Is that all you've got? 😏",
          "My grandma roasts better! 😤",
          "You call that a roast? Amateur! 🙄",
          "I've heard worse from a toddler! 😝"
        ];
        setMessage(responses[Math.floor(Math.random() * responses.length)]);
      }
    } else {
      setMessage("That wasn't even a roast... Try harder! 😏");
    }
    
    setInput('');
  };

  const getProgressColor = () => {
    if (roastLevel < 30) return 'bg-green-500';
    if (roastLevel < 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Roast to Verify</h1>
          <p className="text-gray-600">Make me cry to prove you're human!</p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className={`character-container text-8xl transition-all duration-500 transform hover:scale-105 
            ${characterState === 'crying' ? 'animate-wobble' : 'animate-bounce-slow'}`}>
            {getCharacterEmoji()}
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${getProgressColor()}`}
              style={{ 
                width: `${roastLevel}%`,
                transition: 'width 0.5s ease-in-out'
              }}
            />
          </div>
          <div className="text-sm text-gray-600">
            Roast Level: {roastLevel}% {roastLevel >= roastThreshold ? '🔓' : '🔒'}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleRoast()}
              placeholder="Type your roast here..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={verified}
            />
            <button
              onClick={handleRoast}
              disabled={verified}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>

          {message && (
            <div className={`text-center p-2 rounded ${verified ? 'text-green-600' : 'text-purple-600'} animate-fade-in`}>
              {message}
            </div>
          )}

          {verified && (
            <div className="flex items-center justify-center space-x-2 text-green-600 animate-bounce">
              <span>✓ Verification Complete!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;