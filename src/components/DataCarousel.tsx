'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { carouselSettings, type CarouselItem } from '@/content/carousel';
import { ShushDetector, type ShushReport } from '@/lib/shushDetector';
import { SpinEngine, type EngineUi } from '@/lib/spinEngine';
import styles from './DataCarousel.module.css';

export function DataCarousel({ items }: { items: CarouselItem[] }) {
	const count = items.length;
	const step = 360 / count;

	const stageRef = useRef<HTMLDivElement>(null);
	const ringRef = useRef<HTMLDivElement>(null);
	const engine = useRef<SpinEngine | null>(null);
	const holdHadFocus = useRef(false);
	const openRef = useRef<HTMLAnchorElement>(null);
	const detector = useRef<ShushDetector | null>(null);

	// Server render and first paint: loud, before the engine takes over
	const [{ mode, noise, front }, setUi] = useState<EngineUi>({ mode: 'loud', noise: 100, front: 0 });
	const [reducedMotion, setReducedMotion] = useState(false);
	// Stepping with Previous/Next: keep those controls and the result up while the ring moves
	const [browsing, setBrowsing] = useState(false);
	// Mic shush: offered only once we know this browser can do it
	const [micAvailable, setMicAvailable] = useState(false);
	const [mic, setMic] = useState<'off' | 'starting' | 'on' | 'blocked'>('off');
	const [micReport, setMicReport] = useState<ShushReport>({ level: 0, hearing: false, active: false });

	// Engine lifetime, reduced-motion preference and pausing while scrolled out of view
	useEffect(() => {
		const stage = stageRef.current;
		const ring = ringRef.current;
		if (!stage || !ring) return;
		const spin = new SpinEngine(count, ring, carouselSettings, setUi);
		engine.current = spin;

		const query = window.matchMedia('(prefers-reduced-motion: reduce)');
		const applyMotion = () => {
			setReducedMotion(query.matches);
			if (query.matches) spin.settleNow();
			else spin.startLoud();
		};
		applyMotion();
		query.addEventListener('change', applyMotion);

		const io = new IntersectionObserver(([entry]) => spin.setVisible(entry.isIntersecting));
		io.observe(stage);

		// Ring radius follows the card width, which follows the window width
		const resize = () => {
			const card = ring.querySelector<HTMLElement>('[data-card]');
			if (!card) return;
			const radius = card.offsetWidth / 2 / Math.tan(Math.PI / count) + 14;
			ring.style.setProperty('--radius', `${radius.toFixed(1)}px`);
		};
		resize();
		const ro = new ResizeObserver(resize);
		ro.observe(stage);

		return () => {
			query.removeEventListener('change', applyMotion);
			io.disconnect();
			ro.disconnect();
			spin.destroy();
			engine.current = null;
		};
	}, [count]);

	// Keyboard users who calmed it land on the result instead of losing focus with the hold button
	useEffect(() => {
		if (mode === 'settled' && holdHadFocus.current) {
			holdHadFocus.current = false;
			openRef.current?.focus();
		}
	}, [mode]);

	// The mic is only on while there's something to calm: it switches off once a clean data is found
	useEffect(() => {
		if (mode === 'settled') stopMic();
	}, [mode]);

	useEffect(() => {
		// Feature detection has to wait for the browser; the server can't know
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setMicAvailable(ShushDetector.supported());
		return () => detector.current?.stop();
	}, []);

	function stopMic() {
		detector.current?.stop();
		detector.current = null;
		engine.current?.release('mic');
		setMic((m) => (m === 'blocked' ? m : 'off'));
		setMicReport({ level: 0, hearing: false, active: false });
	}

	async function startMic() {
		setMic('starting');
		const listener = new ShushDetector((report) => {
			setMicReport(report);
			if (report.active) engine.current?.calm('mic');
			else engine.current?.release('mic');
		});
		try {
			await listener.start();
			// The carousel unmounted while the permission prompt was open
			if (!engine.current) {
				listener.stop();
				return;
			}
			detector.current = listener;
			setMic('on');
		} catch {
			listener.stop();
			setMic('blocked');
		}
	}

	const startCalm = (source: string) => engine.current?.calm(source);
	const stopCalm = (source: string) => engine.current?.release(source);
	const goTo = (offset: number) => {
		setBrowsing(true);
		engine.current?.goTo(offset, reducedMotion);
	};
	const makeLoud = () => {
		setBrowsing(false);
		engine.current?.makeLoud();
	};

	const settled = mode === 'settled' || browsing;
	const current = items[front];
	const meterClass = mode === 'loud' ? 'error' : settled ? '' : 'paused';
	const holdDown = (source: string, e: PointerEvent<HTMLElement>) => {
		e.currentTarget.setPointerCapture(e.pointerId);
		holdHadFocus.current = false;
		startCalm(source);
	};
	const canHoldRing = !settled && !reducedMotion;

	return (
		<div className={styles.carousel} aria-roledescription="carousel" aria-label="Data is loud">
			<p className={styles.hint}>
				{reducedMotion
					? 'Motion is reduced on your device, so the data starts calm. Use Previous and Next to look around.'
					: settled
						? 'Data is clean and steady. Pick another with Previous and Next, or let it get loud again.'
						: micAvailable
							? 'Data is loud. Hold the button, press and hold the ring, or shush it with your mic to slow down the carousel and transform the data.'
							: 'Data is loud. Hold the button (or press and hold the ring) to slow down the carousel and transform the data.'}
			</p>

			<div
				ref={stageRef}
				className={styles.stage}
				data-mode={mode}
				aria-hidden="true"
				onPointerDown={canHoldRing ? (e) => holdDown('ring', e) : undefined}
				onPointerUp={() => stopCalm('ring')}
				onPointerCancel={() => stopCalm('ring')}
				onLostPointerCapture={() => stopCalm('ring')}
			>
				<div ref={ringRef} className={styles.ring} style={{ '--step': `${step}deg` } as CSSProperties}>
					{items.map((s, i) => (
						<div
							key={s.title}
							data-card
							className={styles.card}
							data-front={settled && i === front ? '' : undefined}
							style={{ '--i': i } as CSSProperties}
						>
							{s.image ? (
								<div className={styles.cardMedia}>
									<Image
										src={s.image.src}
										alt=""
										fill
										sizes="180px"
										style={{ objectFit: 'cover', objectPosition: s.image.position ?? 'center' }}
									/>
								</div>
							) : (
								<div className={styles.cardBand} data-kind={s.kind} />
							)}
							<div className={styles.cardText}>
								<span className={styles.cardKind}>{s.kind}</span>
								<span className={styles.cardTitle}>{s.title}</span>
								<span className={styles.cardLine}>{s.line}</span>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className={styles.controls}>
				{!reducedMotion && !settled && (
					<button
						type="button"
						className={styles.hold}
						onPointerDown={(e) => holdDown('button', e)}
						onPointerUp={() => stopCalm('button')}
						onPointerCancel={() => stopCalm('button')}
						onLostPointerCapture={() => stopCalm('button')}
						onKeyDown={(e) => {
							if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
								e.preventDefault();
								// Calmed from the keyboard: move focus to the result once it settles
								holdHadFocus.current = true;
								startCalm('key');
							}
						}}
						onKeyUp={(e) => {
							if (e.key === ' ' || e.key === 'Enter') stopCalm('key');
						}}
						onBlur={() => stopCalm('key')}
					>
						{mode === 'calming' || mode === 'snapping'
							? micReport.active
								? 'Calming…'
								: 'Keep holding…'
							: 'Hold to calm the data'}
					</button>
				)}
				{settled && (
					<>
						<button type="button" onClick={() => goTo(-1)}>
							◀ Previous
						</button>
						<button type="button" onClick={() => goTo(1)}>
							Next ▶
						</button>
						{!reducedMotion && (
							<button type="button" onClick={makeLoud}>
								Let it get loud again
							</button>
						)}
					</>
				)}
				<div className={styles.meter}>
					<span className={styles.meterLabel}>Noise {noise}%</span>
					<div
						role="progressbar"
						className={meterClass}
						aria-label="Noise"
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={noise}
					>
						<div style={{ width: `${noise}%` }} />
					</div>
				</div>
			</div>

			{micAvailable && !reducedMotion && !settled && (
				<div className={styles.micRow}>
					<button
						type="button"
						aria-pressed={mic === 'on'}
						disabled={mic === 'starting'}
						onClick={() => (mic === 'on' ? stopMic() : startMic())}
					>
						{mic === 'on' ? 'Turn mic off' : mic === 'starting' ? 'Asking for mic…' : 'Shush it with your mic'}
					</button>
					{mic === 'on' ? (
						<div className={styles.meter}>
							<span className={styles.meterLabel} aria-live="polite">
								{micReport.active ? 'Mic: shhh heard, calming…' : 'Mic: listening for a long “shhh”'}
							</span>
							<div
								role="progressbar"
								className={micReport.hearing ? '' : 'paused'}
								aria-label="Microphone level"
								aria-valuemin={0}
								aria-valuemax={100}
								aria-valuenow={Math.round(micReport.level * 100)}
							>
								<div style={{ width: `${Math.round(micReport.level * 100)}%` }} />
							</div>
						</div>
					) : (
						<p className={styles.micNote}>
							{mic === 'blocked'
								? 'The mic is blocked or missing. Holding the button works too.'
								: 'Your audio stays in your browser. Nothing is recorded or sent.'}
						</p>
					)}
				</div>
			)}

			<div className={styles.result} aria-live="polite">
				{settled && current ? (
					<>
						<p className={styles.resultKind}>Data cleaned and stable: {current.kind}</p>
						<p className={styles.resultTitle}>{current.title}</p>
						<p>{current.detail}</p>
						<Link ref={openRef} className="btn primary" href={current.href}>
							{current.kind === 'Project' ? 'Open the write-up' : 'Go to Experience'}
						</Link>
					</>
				) : (
					<p className={styles.resultWaiting}>Data is still unclean and loud.</p>
				)}
			</div>

			{/* The ring is decorative motion; this is the same content for screen readers and no-JS visitors */}
			<ul className="sr-only">
				{items.map((s) => (
					<li key={s.title}>
						<Link href={s.href}>
							{s.kind}: {s.title}. {s.line}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
