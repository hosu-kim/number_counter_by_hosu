import { Counter } from './Counter';
import { CounterOptions } from './interfaces';

// Select DOM elements
const counterElement = document.getElementById('counter') as HTMLDivElement;
const incrementButton = document.getElementById('increment') as HTMLButtonElement;
const decrementButton = document.getElementById('decrement') as HTMLButtonElement;
const resetButton = document.getElementById('reset') as HTMLButtonElement;

// Error handling for DOM elements
if (!counterElement || !incrementButton || !decrementButton || !resetButton) {
  console.error('Required DOM elements not found');
  throw new Error('Required DOM elements not found');
}

// Create counter instance with options
const counterOptions: CounterOptions = {
  initialValue: 0,
  minValue: -100,
  maxValue: 100,
  step: 1
};

const counter = new Counter(
  counterElement,
  incrementButton,
  decrementButton,
  resetButton,
  counterOptions
);

// Example of using the change listener
counter.addChangeListener((newCount) => {
  console.log(`Counter value changed to: ${newCount}`);
  // You could use this for analytics, saving to server, etc.
});