export type RabbitType = {
  id: string;
  name: string;
  model: string;
  stats: {
    speed: number;
    hunger: number;
    strength: number;
  };
};

export type Item = {
  id: string;
  name: string;
  type: 'food' | 'powerup' | 'special';
  points: number;
  model: string;
  effect?: {
    type: 'speed' | 'strength' | 'hunger';
    value: number;
    duration: number;
  };
};

export const RABBIT_TYPES: RabbitType[] = [
  {
    id: 'cottontail',
    name: 'Cottontail Rabbit',
    model: '/models/cottontail.glb',
    stats: {
      speed: 8,
      hunger: 100,
      strength: 5,
    },
  },
  {
    id: 'dutch',
    name: 'Dutch Rabbit',
    model: '/models/dutch.glb',
    stats: {
      speed: 7,
      hunger: 120,
      strength: 6,
    },
  },
  {
    id: 'lop',
    name: 'Lop Rabbit',
    model: '/models/lop.glb',
    stats: {
      speed: 6,
      hunger: 150,
      strength: 8,
    },
  },
];

export const ITEMS: Item[] = [
  {
    id: 'carrot',
    name: 'Carrot',
    type: 'food',
    points: 10,
    model: '/models/carrot.glb',
    effect: {
      type: 'hunger',
      value: 20,
      duration: 0,
    },
  },
  {
    id: 'golden-carrot',
    name: 'Golden Carrot',
    type: 'powerup',
    points: 50,
    model: '/models/golden-carrot.glb',
    effect: {
      type: 'speed',
      value: 2,
      duration: 10000, // 10 seconds
    },
  },
  {
    id: 'magic-clover',
    name: 'Magic Clover',
    type: 'special',
    points: 100,
    model: '/models/clover.glb',
    effect: {
      type: 'strength',
      value: 3,
      duration: 15000, // 15 seconds
    },
  },
];

export const GAME_CONSTANTS = {
  HUNGER_DECREASE_RATE: 1, // points per second
  INITIAL_HEALTH: 100,
  HAWK_SPAWN_INTERVAL: 30000, // 30 seconds
  ITEM_SPAWN_INTERVAL: 5000, // 5 seconds
  WORLD_SIZE: 100, // size of the playable area
  FOREST_DENSITY: 50, // number of trees
}; 