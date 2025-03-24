import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stage } from '@react-three/drei';
import { PlaceholderModel } from './PlaceholderModel';
import { RabbitCharacter } from '../types/game';
import '../styles/CharacterSelect.css';

const rabbitCharacters: RabbitCharacter[] = [
  {
    id: 1,
    name: "Cotton",
    color: "#F5F5F5",
    accessory: "Crystal Necklace",
    bio: "A gentle white rabbit with keen senses. Uses natural herbs to heal forest friends and knows all the best carrot patches.",
    stats: {
      speed: 70,
      agility: 85,
      stealth: 95,
      charm: 75
    }
  },
  {
    id: 2,
    name: "Zosia",
    color: "#9E9E9E",
    accessory: "Crown",
    bio: "A wise gray rabbit who rules with kindness. Known for her diplomatic skills and ability to bring peace to the forest.",
    stats: {
      speed: 65,
      agility: 75,
      stealth: 80,
      charm: 100
    }
  },
  {
    id: 3,
    name: "Pepper",
    color: "#363636",
    accessory: "Ninja Mask",
    bio: "A stealthy black rabbit who guards the warren at night. Masters the art of shadow-hopping and silent movement.",
    stats: {
      speed: 85,
      agility: 100,
      stealth: 100,
      charm: 60
    }
  },
  {
    id: 4,
    name: "Rusty",
    color: "#B87333",
    accessory: "Chef Hat",
    bio: "A clever copper-colored rabbit who grows the finest vegetables. Known for creating delicious forest feasts.",
    stats: {
      speed: 60,
      agility: 75,
      stealth: 80,
      charm: 95
    }
  },
  {
    id: 5,
    name: "Dusty",
    color: "#9E9E9E",
    accessory: "Tech Goggles",
    bio: "A resourceful grey rabbit who builds clever contraptions. Uses forest materials to create safe paths and shelters.",
    stats: {
      speed: 75,
      agility: 90,
      stealth: 85,
      charm: 80
    }
  },
  {
    id: 6,
    name: "Maple",
    color: "#8B4513",
    accessory: "Adventure Backpack",
    bio: "A brave brown rabbit who maps unexplored forest areas. Always prepared with supplies for any woodland adventure.",
    stats: {
      speed: 90,
      agility: 85,
      stealth: 75,
      charm: 85
    }
  }
];

const RabbitPreview: React.FC<{ color: string; accessory: string }> = ({ color, accessory }) => {
  return (
    <Canvas shadows>
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <Stage environment="forest" intensity={0.5}>
          <PlaceholderModel 
            color={color}
            accessory={accessory}
            scale={1.5}
            rotation={[0, Math.PI / 4, 0]}
          />
        </Stage>
        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={4}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
      </Suspense>
    </Canvas>
  );
};

export const CharacterSelect: React.FC<{ onSelect: (character: RabbitCharacter) => void }> = ({ onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const rabbitsToShow = 3; // Show 3 rabbits at a time

  const handleSelect = (character: RabbitCharacter) => {
    onSelect(character);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - rabbitsToShow));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(rabbitCharacters.length - rabbitsToShow, prev + rabbitsToShow));
  };

  const visibleRabbits = rabbitCharacters.slice(currentIndex, currentIndex + rabbitsToShow);

  return (
    <div className="character-select">
      <h1>Choose Your Furry Friend</h1>
      <div className="rabbits-container">
        {currentIndex > 0 && (
          <button className="navigation-arrow left" onClick={handlePrevious}>
            ←
          </button>
        )}
        
        {visibleRabbits.map((rabbit) => (
          <div 
            key={rabbit.id} 
            className="rabbit-option"
          >
            <div className="rabbit-preview">
              <Suspense fallback={
                <div className="loading-placeholder">
                  Loading...
                </div>
              }>
                <RabbitPreview color={rabbit.color} accessory={rabbit.accessory} />
              </Suspense>
            </div>
            <h2>{rabbit.name}</h2>
            <p className="rabbit-bio">{rabbit.bio}</p>
            <div className="rabbit-stats">
              {Object.entries(rabbit.stats).map(([stat, value]) => (
                <div key={stat} className="stat">
                  <span>{stat}</span>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill" 
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="select-button"
              onClick={() => handleSelect(rabbit)}
            >
              Choose {rabbit.name}
            </button>
          </div>
        ))}

        {currentIndex < rabbitCharacters.length - rabbitsToShow && (
          <button className="navigation-arrow right" onClick={handleNext}>
            →
          </button>
        )}
      </div>
    </div>
  );
}; 