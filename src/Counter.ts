/*
file: src/Counter.ts
description: Defines the Counter class for managing a numeric counter state
			 And synchronizing it with the UI.
author: hosu-kim
created: 2025-04-20
*/

import { CounterInterface, CounterOptions } from './interfaces';

/**
 * @summary Counter state management class
 * @description
 * - Including methods
 * 		1. initEventListeners()		8. updateDisplay()
 * 		2. destroy()				9. animateCounter()
 * 		3. addChangeListener()		10. saveCountToStorage()
 * 		4. notifyListeners()		11. handleIncrement()
 * 		5. increment()				12. handleDecrement()
 * 		6. decrement()				13. handleReset()
 * 		7. reset()					14. handleKeyDown()
 * */
export class Counter implements CounterInterface {
	/* Class attribute declarations */
	private current_count: number;
	private minValue: number;
	private maxValue: number;
	private incrementStep: number;
	// 'readonly' is used for class attributes in a similar way to 'const' for variables.
	private readonly STORAGE_KEY = 'counter_value';
	// Stores an array of functions that take 'count' as a param and return void.
	private listeners: ((count: number) => void)[] = [];

	/**
	 * Initializes the counter with a DOM element and options
	 * @param element - The DOM element(HTML element) that displays the counter value
	 * @param paramOptions - Optional configuration for the counter behavior
	 */
	// 'constructor' is used to receive paramaters and initialize a class instance.
	constructor(
		private element: HTMLDivElement,
		private incrementButton: HTMLButtonElement,
		private decrementButton: HTMLButtonElement,
		private resetButton: HTMLButtonElement,
		paramOptions: CounterOptions = {}
	)

	/* Class attributes setup:
		1. minValue 2. maxValue 3. incrementStep 4. savedCount
	*/
	{
		// '??' operator returns the right-hand value
		// only if the left-hand value is 'null' or 'undefined'.
		this.minValue = paramOptions.minValue ?? Number.MIN_SAFE_INTEGER;
		this.maxValue = paramOptions.maxValue ?? Number.MAX_SAFE_INTEGER;
		this.incrementStep = paramOptions.incrementStep ?? 1;

		// Load saved count in the web browser or use initial value from paramOptions
		const savedCount = localStorage.getItem(this.STORAGE_KEY);
		if (savedCount !== null) {
			// Converts the saved string value to an integer 
			// based on the provided radix (second param)
			this.current_count = parseInt(savedCount, 10);
		}
		else {
			this.current_count = paramOptions.initialValue ?? 0;
		}

		// When the instance is created, these functions update the UI
		// and initialize event listeners
		this.updateDisplay();
		this.initEventListeners();
	}

	/**
	 * Initialize event listeners
	 */
	public initEventListeners(): void {
		this.incrementButton.addEventListener('click', this.handleIncrement);
		this.decrementButton.addEventListener('click', this.handleDecrement);
		this.resetButton.addEventListener('click', this.handleReset);

		// Add keyboard event listener for accessibility
		document.addEventListener('keydown', this.handleKeyDown);
	}

	/**
	 * Clean up event listeners when counter is no longer needed
	 */
	public destroy(): void {
		this.incrementButton.removeEventListener('click', this.handleIncrement);
		this.decrementButton.removeEventListener('click', this.handleDecrement);
		this.resetButton.removeEventListener('click', this.handleReset);
		document.removeEventListener('keydown', this.handleKeyDown);
	}

	/**
	 * Add a listener that will be called when the counter value changes
	 * @param callback - Function to call with the new counter value
	 */
	public addChangeListener(callback: (count: number) => void): void {
		this.listeners.push(callback);
	}

	/**
	 * Notify all registered listeners about the counter value change
	 */
	private notifyListeners(): void {
		this.listeners.forEach(listener => listener(this.current_count));
	}

	/**
	 * Increments the counter by the step value
	 */
	public increment(): void {
		const newCount = this.current_count + this.incrementStep;
		if (newCount <= this.maxValue) {
			this.current_count = newCount;
			this.updateDisplay();
			this.animateCounter();
			this.saveCountToStorage();
			this.notifyListeners();
		}
	}

	/**
	 * Decrements the counter by the step value
	 */
	public decrement(): void {
		const newCount = this.current_count - this.incrementStep;
		if (newCount >= this.minValue) {
			this.current_count = newCount;
			this.updateDisplay();
			this.animateCounter();
			this.saveCountToStorage();
			this.notifyListeners();
		}
	}

	/**
	 * Resets the counter to initial value (default: 0)
	 */
	public reset(): void {
		this.current_count = 0;
		this.updateDisplay();
		this.animateCounter();
		this.saveCountToStorage();
		this.notifyListeners();
	}

	/**
	 * Updates the DOM element with the current count
	 * @private
	 */
	private updateDisplay(): void {
		this.element.textContent = this.current_count.toString();
	}

	/**
	 * Adds animation to the counter when it changes
	 * @private
	 */
	private animateCounter(): void {
		this.element.classList.remove('counter-animation');
		// Trigger reflow to restart animation
		void this.element.offsetWidth;
		this.element.classList.add('counter-animation');
	}

	/**
	 * Save current count to localStorage
	 * @private
	 */
	private saveCountToStorage(): void {
		localStorage.setItem(this.STORAGE_KEY, this.current_count.toString());
	}
	
	/**
	 * Event handler for increment button click
	 * @private
	 */
	private handleIncrement = (): void => {
		this.increment();
	}
	
	/**
	 * Event handler for decrement button click
	 * @private
	 */
	private handleDecrement = (): void => {
		this.decrement();
	}
	
	/**
	 * Event handler for reset button click
	 * @private
	 */
	private handleReset = (): void => {
		this.reset();
	}
	
	/**
	 * Event handler for keyboard navigation
	 * @private
	 */
	private handleKeyDown = (e: KeyboardEvent): void => {
		if (document.activeElement === this.incrementButton || 
				document.activeElement === this.decrementButton || 
				document.activeElement === this.resetButton) {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				(document.activeElement as HTMLButtonElement).click();
			}
		}
	}
}