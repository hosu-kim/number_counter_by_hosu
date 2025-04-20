/*
file: src/interfaces.ts
description: Declarations of interfaces
author: hosu-kim
created: 2025-04-20
*/

// Interface defining counter behavior
export interface CounterInterface {
	increment(): void;
	decrement(): void;
	reset(): void;
}

  // Configuration options for the counter
export interface CounterOptions {
	initialValue?: number;
	minValue?: number;
	maxValue?: number;
	incrementStep?: number;
}