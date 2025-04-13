"use strict";
// Select DOM elements
const counterElement = document.getElementById('counter');
const incrementButton = document.getElementById('increment');
const decrementButton = document.getElementById('decrement');
const resetButton = document.getElementById('reset');
// Error handling for DOM elements
if (!counterElement || !incrementButton || !decrementButton || !resetButton) {
    console.error('Required DOM elements not found');
    throw new Error('Required DOM elements not found');
}
// Counter state management class
class Counter {
    /**
     * Constructor initializes the counter with a DOM element and options
     * @param element - The DOM element that displays the counter value
     * @param options - Optional configuration for the counter behavior
     */
    constructor(element, incrementButton, decrementButton, resetButton, options = {}) {
        var _a, _b, _c, _d;
        this.element = element;
        this.incrementButton = incrementButton;
        this.decrementButton = decrementButton;
        this.resetButton = resetButton;
        this.STORAGE_KEY = 'counter_value';
        this.listeners = [];
        /**
         * Event handler for increment button click
         * @private
         */
        this.handleIncrement = () => {
            this.increment();
        };
        /**
         * Event handler for decrement button click
         * @private
         */
        this.handleDecrement = () => {
            this.decrement();
        };
        /**
         * Event handler for reset button click
         * @private
         */
        this.handleReset = () => {
            this.reset();
        };
        /**
         * Event handler for keyboard navigation
         * @private
         */
        this.handleKeyDown = (e) => {
            if (document.activeElement === this.incrementButton ||
                document.activeElement === this.decrementButton ||
                document.activeElement === this.resetButton) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    document.activeElement.click();
                }
            }
        };
        this.minValue = (_a = options.minValue) !== null && _a !== void 0 ? _a : Number.MIN_SAFE_INTEGER;
        this.maxValue = (_b = options.maxValue) !== null && _b !== void 0 ? _b : Number.MAX_SAFE_INTEGER;
        this.step = (_c = options.step) !== null && _c !== void 0 ? _c : 1;
        // Load saved count or use initial value from options
        const savedCount = localStorage.getItem(this.STORAGE_KEY);
        if (savedCount !== null) {
            this.count = parseInt(savedCount, 10);
        }
        else {
            this.count = (_d = options.initialValue) !== null && _d !== void 0 ? _d : 0;
        }
        this.updateDisplay();
        this.init();
    }
    /**
     * Initialize event listeners
     */
    init() {
        this.incrementButton.addEventListener('click', this.handleIncrement);
        this.decrementButton.addEventListener('click', this.handleDecrement);
        this.resetButton.addEventListener('click', this.handleReset);
        // Add keyboard event listener for accessibility
        document.addEventListener('keydown', this.handleKeyDown);
    }
    /**
     * Clean up event listeners when counter is no longer needed
     */
    destroy() {
        this.incrementButton.removeEventListener('click', this.handleIncrement);
        this.decrementButton.removeEventListener('click', this.handleDecrement);
        this.resetButton.removeEventListener('click', this.handleReset);
        document.removeEventListener('keydown', this.handleKeyDown);
    }
    /**
     * Add a listener that will be called when the counter value changes
     * @param callback - Function to call with the new counter value
     */
    addChangeListener(callback) {
        this.listeners.push(callback);
    }
    /**
     * Notify all registered listeners about the counter value change
     */
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.count));
    }
    /**
     * Increments the counter by the step value
     */
    increment() {
        const newCount = this.count + this.step;
        if (newCount <= this.maxValue) {
            this.count = newCount;
            this.updateDisplay();
            this.animateCounter();
            this.saveCountToStorage();
            this.notifyListeners();
        }
    }
    /**
     * Decrements the counter by the step value
     */
    decrement() {
        const newCount = this.count - this.step;
        if (newCount >= this.minValue) {
            this.count = newCount;
            this.updateDisplay();
            this.animateCounter();
            this.saveCountToStorage();
            this.notifyListeners();
        }
    }
    /**
     * Resets the counter to initial value (default: 0)
     */
    reset() {
        this.count = 0;
        this.updateDisplay();
        this.animateCounter();
        this.saveCountToStorage();
        this.notifyListeners();
    }
    /**
     * Updates the DOM element with the current count
     * @private
     */
    updateDisplay() {
        this.element.textContent = this.count.toString();
    }
    /**
     * Adds animation to the counter when it changes
     * @private
     */
    animateCounter() {
        this.element.classList.remove('counter-animation');
        // Trigger reflow to restart animation
        void this.element.offsetWidth;
        this.element.classList.add('counter-animation');
    }
    /**
     * Save current count to localStorage
     * @private
     */
    saveCountToStorage() {
        localStorage.setItem(this.STORAGE_KEY, this.count.toString());
    }
    /**
     * Load saved count from localStorage
     * @private
     */
    loadCountFromStorage() {
        const savedCount = localStorage.getItem(this.STORAGE_KEY);
        if (savedCount !== null) {
            this.count = parseInt(savedCount, 10);
        }
    }
}
// Create counter instance with options
const counter = new Counter(counterElement, incrementButton, decrementButton, resetButton, {
    initialValue: 0,
    minValue: -100,
    maxValue: 100,
    step: 1
});
// Example of using the change listener
counter.addChangeListener((newCount) => {
    console.log(`Counter value changed to: ${newCount}`);
    // You could use this for analytics, saving to server, etc.
});
