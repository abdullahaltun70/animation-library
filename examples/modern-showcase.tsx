// Modern animation examples showcasing the enhanced library features
import React, { useState } from 'react';
import {
  ModernAnimate,
  SequenceAnimate,
  StaggeredAnimate,
  InteractiveAnimate,
  useModernAnimation,
  useAnimationSequence,
  useStaggeredAnimation,
  ModernAnimationConfig,
  AnimationSequence,
} from '@abdullah-altun/react-animation-library/client';

// Import the CSS
import '@abdullah-altun/react-animation-library/styles.css';

// Example 1: Modern Animation with State Management
const ModernAnimationExample = () => {
  const [isVisible, setIsVisible] = useState(false);

  const fadeInConfig: ModernAnimationConfig = {
    type: 'fade',
    duration: 0.6,
    trigger: 'visible',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    respectReducedMotion: true,
    reduceMotionFallback: {
      type: 'fade',
      duration: 0.1,
    },
  };

  return (
    <div className="space-y-4">
      <h2>Modern Animation with State Management</h2>
      
      <ModernAnimate config={fadeInConfig}>
        <div className="p-6 bg-blue-100 rounded-lg">
          <h3>Fade in when visible</h3>
          <p>This element uses Intersection Observer to trigger when scrolled into view.</p>
        </div>
      </ModernAnimate>

      <button 
        onClick={() => setIsVisible(!isVisible)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Toggle Visibility
      </button>

      {isVisible && (
        <ModernAnimate 
          config={{
            type: ['fade', 'slide'],
            duration: 0.4,
            axis: 'y',
            distance: 30,
            trigger: 'mount',
          }}
        >
          <div className="p-4 bg-green-100 rounded">
            Conditionally rendered with combined fade + slide animation
          </div>
        </ModernAnimate>
      )}
    </div>
  );
};

// Example 2: Animation Sequences
const SequenceAnimationExample = () => {
  const complexSequence: AnimationSequence = {
    name: 'hero-entrance',
    steps: [
      {
        animations: [
          { type: 'fade', duration: 0.3 },
          { type: 'slide', axis: 'y', distance: 40, duration: 0.3 }
        ],
        parallel: true,
      },
      {
        animations: [
          { type: 'scale', scale: { start: 1, end: 1.05 }, duration: 0.2 }
        ],
        delay: 0.1,
      },
      {
        animations: [
          { type: 'scale', scale: { start: 1.05, end: 1 }, duration: 0.2 }
        ],
      }
    ],
    onComplete: () => console.log('Hero entrance complete!'),
  };

  return (
    <div className="space-y-4">
      <h2>Complex Animation Sequence</h2>
      
      <SequenceAnimate 
        sequence={complexSequence}
        autoStart
        className="p-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg text-white"
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Hero Section</h3>
          <p>Watch this complex sequence: fade + slide → scale up → scale back</p>
        </div>
      </SequenceAnimate>
    </div>
  );
};

// Example 3: Staggered Animations
const StaggeredAnimationExample = () => {
  const cards = [
    { title: 'Card 1', content: 'First card content' },
    { title: 'Card 2', content: 'Second card content' },
    { title: 'Card 3', content: 'Third card content' },
    { title: 'Card 4', content: 'Fourth card content' },
    { title: 'Card 5', content: 'Fifth card content' },
  ];

  return (
    <div className="space-y-4">
      <h2>Staggered Grid Animation</h2>
      
      <StaggeredAnimate
        config={{
          animations: [
            { 
              type: 'fade', 
              duration: 0.4,
              opacity: { start: 0, end: 1 }
            },
            { 
              type: 'slide', 
              axis: 'y', 
              distance: 30, 
              duration: 0.4 
            }
          ],
          delay: 0.1,
          direction: 'forward',
        }}
        autoStart
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {cards.map((card, index) => (
          <div 
            key={index}
            className="p-4 bg-white rounded-lg shadow-md border"
          >
            <h4 className="font-semibold mb-2">{card.title}</h4>
            <p className="text-gray-600">{card.content}</p>
          </div>
        ))}
      </StaggeredAnimate>
    </div>
  );
};

// Example 4: Interactive Micro-animations
const InteractiveAnimationExample = () => {
  return (
    <div className="space-y-6">
      <h2>Interactive Micro-animations</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Button with hover and click animations */}
        <InteractiveAnimate
          hoverConfig={{ 
            type: 'scale', 
            scale: { start: 1, end: 1.05 }, 
            duration: 0.2 
          }}
          clickConfig={{ 
            type: 'scale', 
            scale: { start: 1, end: 0.95 }, 
            duration: 0.1 
          }}
          className="interactive-button"
        >
          <button className="w-full px-6 py-3 bg-indigo-500 text-white rounded-lg font-medium">
            Interactive Button
          </button>
        </InteractiveAnimate>

        {/* Card with compound hover effect */}
        <InteractiveAnimate
          hoverConfig={{
            type: ['scale', 'slide'],
            scale: { start: 1, end: 1.02 },
            distance: 4,
            duration: 0.3,
          }}
          className="interactive-card"
        >
          <div className="p-4 bg-white rounded-lg shadow border cursor-pointer">
            <h4 className="font-semibold mb-2">Hover Card</h4>
            <p className="text-gray-600">Hover me for a smooth lift effect</p>
          </div>
        </InteractiveAnimate>
      </div>

      {/* Focus-aware input */}
      <InteractiveAnimate
        focusConfig={{
          type: 'scale',
          scale: { start: 1, end: 1.02 },
          duration: 0.2,
        }}
      >
        <input
          type="text"
          placeholder="Focus me for animation"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none"
        />
      </InteractiveAnimate>
    </div>
  );
};

// Example 5: CSS State Management
const StateManagementExample = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    setError(false);
    setSuccess(false);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    if (Math.random() > 0.5) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="space-y-4">
      <h2>CSS State Management</h2>
      
      <div 
        className="p-4 border rounded-lg transition-all duration-300"
        data-loading={loading}
        data-error={error}
        data-success={success}
      >
        <p>Status indicator with CSS state management</p>
        <button 
          onClick={handleAction}
          disabled={loading}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Trigger Action'}
        </button>
      </div>

      <style jsx>{`
        [data-loading="true"] {
          background: linear-gradient(90deg, #f3f4f6, #e5e7eb, #f3f4f6);
          background-size: 200% 100%;
          animation: loading-shimmer 1.5s infinite;
        }
        
        [data-error="true"] {
          border-color: #ef4444;
          background-color: #fef2f2;
          animation: error-shake 0.5s ease-in-out;
        }
        
        [data-success="true"] {
          border-color: #10b981;
          background-color: #f0fdf4;
          animation: success-pulse 0.6s ease-out;
        }
        
        @keyframes loading-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        @keyframes error-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes success-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

// Main App Component
const ModernAnimationShowcase = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Modern Animation Library Showcase</h1>
        <p className="text-xl text-gray-600">
          Advanced React animation patterns with CSS-based state management
        </p>
      </header>

      <ModernAnimationExample />
      <SequenceAnimationExample />
      <StaggeredAnimationExample />
      <InteractiveAnimationExample />
      <StateManagementExample />

      <footer className="text-center pt-12 border-t">
        <p className="text-gray-500">
          All animations respect <code>prefers-reduced-motion</code> settings
        </p>
      </footer>
    </div>
  );
};

export default ModernAnimationShowcase;
