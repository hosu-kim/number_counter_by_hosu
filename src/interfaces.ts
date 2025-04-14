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
	step?: number;
  }