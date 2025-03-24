# Forest Rabbit Adventure

A beautiful 3D game where you play as a rabbit exploring a magical forest, collecting items, and avoiding predators.

## Features

- **Beautiful 3D Environment**: Explore a lush forest environment with trees, bushes, and dynamic lighting
- **Multiple Rabbit Characters**: Choose from different rabbit types, each with unique stats:
  - Cottontail Rabbit: Fast and agile
  - Dutch Rabbit: Balanced stats
  - Lop Rabbit: High hunger resistance and strength
- **Item Collection**:
  - Carrots: Restore hunger
  - Golden Carrots: Temporary speed boost
  - Magic Clovers: Temporary strength boost
- **Survival Elements**:
  - Manage hunger levels
  - Avoid predatory hawks
  - Collect power-ups for temporary benefits
- **Score System**: Earn points by collecting items and surviving longer

## Controls

- **W**: Move forward
- **S**: Move backward
- **A**: Move left
- **D**: Move right
- **Mouse**: Control camera view

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Game Mechanics

### Hunger System
- Hunger decreases over time
- Collect food items to restore hunger
- If hunger reaches 0, game over

### Predator System
- Hawks circle the area looking for prey
- They will dive to attack when they spot you
- Use speed boosts and cover to escape

### Power-ups
- **Golden Carrot**: Increases speed for 10 seconds
- **Magic Clover**: Increases strength for 15 seconds
- **Regular Carrot**: Restores 20 hunger points

## Technical Stack

- React
- Three.js / React Three Fiber
- TypeScript
- Zustand for state management
- Vite for build tooling

## Development

The game is built with modern web technologies and follows a component-based architecture. Key components include:

- `Game.tsx`: Main game component and scene setup
- `Player.tsx`: Player character and movement controls
- `Items.tsx`: Item spawning and collection system
- `Predators.tsx`: Predator AI and behavior
- `Forest.tsx`: Environmental elements
- `HUD.tsx`: Game interface and stats display

## Future Enhancements

- More rabbit types with unique abilities
- Additional power-ups and items
- Different environments and weather conditions
- Multiplayer support
- Achievement system
- Day/night cycle

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
