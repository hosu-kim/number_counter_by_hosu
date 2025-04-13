// Interface definitions
interface CounterInterface {
	increment(): void;
	decrement(): void;
	reset(): void;
}

// Select DOM elements: ?
const counterElement = document.getElementById('counter') as HTMLDivElement;
const incrementButton = document.getElementById('increment') as HTMLButtonElement;
const decrementButton = document.getElementById('decrement') as HTMLButtonElement;
const resetButton = document.getElementById('reset') as HTMLButtonElement;

// Counter state management class
class Counter implements CounterInterface {
	private count: number = 0;

	/**
	 * Constructor initializes the counter with a DOM element
	 * @param element - The DOM element that displays the counter value
	 */
	constructor(private element: HTMLDivElement) {
		this.updateDisplay();
	}

	/**
	 * Increments the counter by one
	 */
	public increment(): void {
		this.count += 1;
		this.updateDisplay();
		this.animateCounter();
	}

	/**
	 * Decrements the counter by one
	 */
	public decrement(): void {
		this.count -= 1;
		this.updateDisplay();
		this.animateCounter();
	}

	/**
	 * Resets the counter to zero
	 */
	public reset(): void {
		this.count = 0;
		this.updateDisplay();
		this.animateCounter();
	}

	/**
	 * Updates the DOM element with the current count
	 * @private
	 */
	private updateDisplay(): void {
		this.element.textContent = this.count.toString();
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
}

// Create counter instance
const counter = new Counter(counterElement);

// Set up event listeners
incrementButton.addEventListener('click', () => counter.increment());
decrementButton.addEventListener('click', () => counter.decrement());
resetButton.addEventListener('click', () => counter.reset());