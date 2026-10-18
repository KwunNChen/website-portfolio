/**
 * Listens to the microphone for a sustained "shhh" (or a blow into the mic) and reports when one is happening.
 * Everything runs locally in the Web Audio graph: nothing is recorded, stored or sent anywhere.
 *
 * A "shhh" is broadband hiss: loud enough, most of its energy above ~2 kHz, and a flat (noise-like) spectrum.
 * Speech and music are tonal, so their spectra are peaky and they don't qualify.
 */

export type ShushFeatures = {
	/** RMS of the waveform, 0..1 */
	rms: number;
	/** Share of 100 Hz–8 kHz energy that sits in 2–8 kHz */
	highRatio: number;
	/** Spectral flatness over 1–8 kHz: 1 = white noise, near 0 = pure tone */
	flatness: number;
};

const MIN_RMS = 0.02;
const SHUSH_HIGH_RATIO = 0.45;
const SHUSH_FLATNESS = 0.22;
const BLOW_RMS = 0.15;
const BLOW_FLATNESS = 0.18;

/** Pure decision for one frame, exported so it can be checked without a microphone */
export function soundsLikeShush({ rms, highRatio, flatness }: ShushFeatures) {
	if (rms < MIN_RMS) return false;
	const shush = highRatio > SHUSH_HIGH_RATIO && flatness > SHUSH_FLATNESS;
	const blow = rms > BLOW_RMS && flatness > BLOW_FLATNESS;
	return shush || blow;
}

const FRAME_MS = 40;
const ON_AFTER_MS = 240; // a "shhh" has to last this long before it counts
const OFF_AFTER_MS = 320; // and stops counting after this much quiet

export type ShushReport = { level: number; hearing: boolean; active: boolean };

export class ShushDetector {
	private stream: MediaStream | null = null;
	private context: AudioContext | null = null;
	private analyser: AnalyserNode | null = null;
	private timer: ReturnType<typeof setInterval> | null = null;
	private active = false;
	private shushFor = 0;
	private quietFor = 0;

	constructor(private readonly onReport: (report: ShushReport) => void) {}

	static supported() {
		return (
			typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof AudioContext !== 'undefined'
		);
	}

	/** Asks for the mic. Rejects if the visitor says no or there's no mic. */
	async start() {
		// Browser noise suppression would scrub out exactly the hiss we're listening for
		this.stream = await navigator.mediaDevices.getUserMedia({
			audio: { noiseSuppression: false, echoCancellation: false, autoGainControl: false },
		});
		this.context = new AudioContext();
		const source = this.context.createMediaStreamSource(this.stream);
		this.analyser = this.context.createAnalyser();
		this.analyser.fftSize = 2048;
		this.analyser.smoothingTimeConstant = 0.3;
		source.connect(this.analyser);
		this.timer = setInterval(this.sample, FRAME_MS);
	}

	stop() {
		if (this.timer !== null) clearInterval(this.timer);
		this.timer = null;
		this.stream?.getTracks().forEach((t) => t.stop());
		this.stream = null;
		void this.context?.close();
		this.context = null;
		this.analyser = null;
		this.active = false;
		this.shushFor = 0;
		this.quietFor = 0;
	}

	private sample = () => {
		const analyser = this.analyser;
		const context = this.context;
		if (!analyser || !context) return;

		const wave = new Float32Array(analyser.fftSize);
		analyser.getFloatTimeDomainData(wave);
		let sum = 0;
		for (const x of wave) sum += x * x;
		const rms = Math.sqrt(sum / wave.length);

		const spectrum = new Float32Array(analyser.frequencyBinCount);
		analyser.getFloatFrequencyData(spectrum);
		const hzPerBin = context.sampleRate / analyser.fftSize;
		const bin = (hz: number) => Math.min(spectrum.length - 1, Math.round(hz / hzPerBin));
		const power = (i: number) => 10 ** (spectrum[i] / 10);

		let all = 0;
		let high = 0;
		for (let i = bin(100); i <= bin(8000); i++) {
			const p = power(i);
			all += p;
			if (i >= bin(2000)) high += p;
		}

		// Flatness = geometric mean / arithmetic mean of power, over 1–8 kHz
		let logSum = 0;
		let linSum = 0;
		let n = 0;
		for (let i = bin(1000); i <= bin(8000); i++) {
			const p = Math.max(power(i), 1e-20);
			logSum += Math.log(p);
			linSum += p;
			n++;
		}
		const flatness = n && linSum > 0 ? Math.exp(logSum / n) / (linSum / n) : 0;

		const hearing = soundsLikeShush({ rms, highRatio: all > 0 ? high / all : 0, flatness });
		if (hearing) {
			this.shushFor += FRAME_MS;
			this.quietFor = 0;
			if (!this.active && this.shushFor >= ON_AFTER_MS) this.active = true;
		} else {
			this.quietFor += FRAME_MS;
			this.shushFor = 0;
			if (this.active && this.quietFor >= OFF_AFTER_MS) this.active = false;
		}

		// Speech-level RMS is roughly 0.05–0.2; scale so a normal "shhh" fills most of the meter
		this.onReport({ level: Math.min(1, rms * 6), hearing, active: this.active });
	};
}
