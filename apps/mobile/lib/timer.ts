export interface TimerState {
  timeRemaining: number;
  isActive: boolean;
  isPaused: boolean;
}

export class Timer {
  private intervalId: NodeJS.Timeout | null = null;
  private startTime: number = 0;
  private pausedTime: number = 0;
  private totalPausedTime: number = 0;
  private duration: number;
  private onTick: (timeRemaining: number) => void;
  private onComplete: () => void;

  constructor(
    duration: number,
    onTick: (timeRemaining: number) => void,
    onComplete: () => void
  ) {
    this.duration = duration;
    this.onTick = onTick;
    this.onComplete = onComplete;
  }

  start(): void {
    if (this.intervalId) return;

    if (this.pausedTime > 0) {
      // Resuming from pause
      this.startTime = Date.now() - (this.duration - this.pausedTime) * 1000 - this.totalPausedTime;
    } else {
      // Starting fresh
      this.startTime = Date.now();
    }

    this.intervalId = setInterval(() => {
      const elapsed = Date.now() - this.startTime - this.totalPausedTime;
      const remaining = Math.max(0, this.duration - Math.floor(elapsed / 1000));

      this.onTick(remaining);

      if (remaining === 0) {
        this.stop();
        this.onComplete();
      }
    }, 1000);
  }

  pause(): void {
    if (!this.intervalId) return;

    clearInterval(this.intervalId);
    this.intervalId = null;

    const elapsed = Date.now() - this.startTime - this.totalPausedTime;
    this.pausedTime = Math.max(0, this.duration - Math.floor(elapsed / 1000));

    const pauseStart = Date.now();
    this.totalPausedTime += pauseStart - (Date.now() - elapsed * 1000);
  }

  resume(): void {
    if (this.intervalId) return;
    this.start();
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.startTime = 0;
    this.pausedTime = 0;
    this.totalPausedTime = 0;
  }

  getTimeRemaining(): number {
    if (!this.startTime) return this.duration;

    const elapsed = Date.now() - this.startTime - this.totalPausedTime;
    return Math.max(0, this.duration - Math.floor(elapsed / 1000));
  }
}

