import { CounterInterface, CounterOptions } from './interfaces';

// Counter state management class
export class Counter implements CounterInterface {
  private count: number;
  private minValue: number;
  private maxValue: number;
  private step: number;
  private readonly STORAGE_KEY = 'counter_value';
  private listeners: ((count: number) => void)[] = [];

  /**
   * Constructor initializes the counter with a DOM element and options
   * @param element - The DOM element that displays the counter value
   * @param options - Optional configuration for the counter behavior
   */
  constructor(
    private element: HTMLDivElement,
    private incrementButton: HTMLButtonElement,
    private decrementButton: HTMLButtonElement,
    private resetButton: HTMLButtonElement,
    options: CounterOptions = {}
  ) {
    this.minValue = options.minValue ?? Number.MIN_SAFE_INTEGER;
    this.maxValue = options.maxValue ?? Number.MAX_SAFE_INTEGER;
    this.step = options.step ?? 1;

    // Load saved count or use initial value from options
    const savedCount = localStorage.getItem(this.STORAGE_KEY);
    if (savedCount !== null) {
      this.count = parseInt(savedCount, 10);
    } else {
      this.count = options.initialValue ?? 0;
    }

    this.updateDisplay();
    this.init();
  }

  /**
   * Initialize event listeners
   */
  public init(): void {
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
    this.listeners.forEach(listener => listener(this.count));
  }

  /**
   * Increments the counter by the step value
   */
  public increment(): void {
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
  public decrement(): void {
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
  public reset(): void {
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

  /**
   * Save current count to localStorage
   * @private
   */
  private saveCountToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, this.count.toString());
  }
  
  /**
   * Load saved count from localStorage
   * @private
   */
  private loadCountFromStorage(): void {
    const savedCount = localStorage.getItem(this.STORAGE_KEY);
    if (savedCount !== null) {
      this.count = parseInt(savedCount, 10);
    }
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