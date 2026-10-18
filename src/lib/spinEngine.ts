/**
 * Physics for the "data is loud" carousel, kept outside React so the animation loop never waits on a render.
 * Angles are in degrees, time in seconds.
 *
 * loud     → spins up toward maxSpeed
 * calming  → while any calm source is active (held button, held ring, key, later the mic), friction slows it;
 *            let go and it drifts back up to loud
 * snapping → slow enough: a critically damped spring lands it on the next card
 * settled  → stopped on a card; the loop sleeps until something moves it again
 */

export type Mode = 'loud' | 'calming' | 'snapping' | 'settled';

/** The tunable parts; the site's values live in src/content/carousel.ts */
export type SpinSettings = {
	maxSpeed: number; // deg/s at full noise
	friction: number; // decay rate while calmed
	snapStiffness: number; // spring strength of the final snap
	maxBlur: number; // px of motion blur at full speed
};

const SPIN_UP = 1.2; // return to full speed from rest
const RE_LOUD = 0.6; // slower drift back up when released mid-calm
const SNAP_SPEED = 40; // below this, commit to a card
const UI_INTERVAL = 100; // ms between React updates

const mod = (n: number, m: number) => ((n % m) + m) % m;

export type EngineUi = { mode: Mode; noise: number; front: number };

export class SpinEngine {
	private angle = 0;
	private velocity = 0;
	private target = 0;
	private mode: Mode = 'settled';
	private calmSources = new Set<string>();
	private frame: number | null = null;
	private lastTime = 0;
	private lastUi = 0;
	private visible = true;
	private readonly step: number;
	private readonly damping: number;

	constructor(
		private readonly count: number,
		private readonly ring: HTMLElement,
		private readonly settings: SpinSettings,
		private readonly onUi: (ui: EngineUi) => void,
	) {
		this.step = 360 / count;
		// Critically damped, so the snap never overshoots
		this.damping = 2 * Math.sqrt(settings.snapStiffness);
	}

	/** Full speed immediately, as if the page had been noisy all along */
	startLoud() {
		this.velocity = this.settings.maxSpeed;
		this.setMode('loud');
		this.run();
	}

	/** Back to loud from wherever it is */
	makeLoud() {
		this.setMode('loud');
		this.run();
	}

	/** Stop dead on the nearest card, no animation (reduced motion) */
	settleNow() {
		this.stop();
		this.velocity = 0;
		this.angle = Math.round(this.angle / this.step) * this.step;
		this.setMode('settled');
		this.paint();
	}

	calm(source: string) {
		this.calmSources.add(source);
		this.run();
	}

	release(source: string) {
		this.calmSources.delete(source);
	}

	/** Move by whole cards; animated unless instant */
	goTo(offset: number, instant = false) {
		// Clicking again mid-move counts from where it was already heading
		const base = this.mode === 'snapping' ? this.target : Math.round(this.angle / this.step) * this.step;
		const next = base + offset * this.step;
		if (instant) {
			this.angle = next;
			this.velocity = 0;
			this.paint();
			this.emit(true);
			return;
		}
		this.target = next;
		this.setMode('snapping');
		this.run();
	}

	setVisible(visible: boolean) {
		this.visible = visible;
		if (visible) this.run();
	}

	destroy() {
		this.stop();
	}

	private setMode(mode: Mode) {
		this.mode = mode;
		// A held key or pointer can't keep calming once the controls it came from are gone
		if (mode === 'settled') this.calmSources.clear();
		this.emit(true);
	}

	private run() {
		if (this.frame !== null || this.mode === 'settled' || !this.visible) return;
		this.lastTime = performance.now();
		this.frame = requestAnimationFrame(this.tick);
	}

	private stop() {
		if (this.frame !== null) cancelAnimationFrame(this.frame);
		this.frame = null;
	}

	private tick = (now: number) => {
		const dt = Math.min(0.05, (now - this.lastTime) / 1000 || 0);
		this.lastTime = now;
		const calming = this.calmSources.size > 0;
		let v = this.velocity;

		switch (this.mode) {
			case 'loud':
				v += (this.settings.maxSpeed - v) * (1 - Math.exp(-SPIN_UP * dt));
				if (calming) this.setMode('calming');
				break;
			case 'calming':
				if (calming) {
					v *= Math.exp(-this.settings.friction * dt);
					if (Math.abs(v) < SNAP_SPEED) {
						// Land on the next card in the direction of travel
						this.target = Math.ceil(this.angle / this.step) * this.step;
						this.setMode('snapping');
					}
				} else {
					v += (this.settings.maxSpeed - v) * (1 - Math.exp(-RE_LOUD * dt));
					if (v > this.settings.maxSpeed * 0.9) this.setMode('loud');
				}
				break;
			case 'snapping': {
				const offset = this.target - this.angle;
				v += (this.settings.snapStiffness * offset - this.damping * v) * dt;
				if (Math.abs(offset) < 0.2 && Math.abs(v) < 2) {
					this.angle = this.target;
					this.velocity = 0;
					this.paint();
					this.frame = null;
					this.setMode('settled');
					return;
				}
				break;
			}
		}

		this.velocity = v;
		this.angle += v * dt;
		this.paint();
		this.emit(false);

		this.frame = this.mode !== 'settled' && this.visible ? requestAnimationFrame(this.tick) : null;
	};

	private paint() {
		this.ring.style.setProperty('--angle', `${-this.angle}deg`);
		const speed = Math.min(1, Math.abs(this.velocity) / this.settings.maxSpeed);
		this.ring.style.setProperty('--blur', `${(speed * this.settings.maxBlur).toFixed(2)}px`);
	}

	private emit(force: boolean) {
		const now = performance.now();
		if (!force && now - this.lastUi < UI_INTERVAL) return;
		this.lastUi = now;
		this.onUi({
			mode: this.mode,
			noise: Math.round(Math.min(1, Math.abs(this.velocity) / this.settings.maxSpeed) * 100),
			front: mod(Math.round(this.angle / this.step), this.count),
		});
	}
}
