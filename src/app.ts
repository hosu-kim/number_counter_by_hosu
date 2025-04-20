/*
file: src/app.ts
description: Entry point for initializing and configuring the counter application.
author: hosu-kim
created: 2025-04-20
*/

import { Counter } from './Counter.js';
import { CounterOptions } from './interfaces.js';

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

// Create an object with counter configuration
const counterOptions: CounterOptions = {
	initialValue: 0,
	minValue: -1000,
	maxValue: 1000,
	incrementStep: 1
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
