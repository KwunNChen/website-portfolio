'use client';

import { memo, useEffect, useRef, useState, type FormEvent } from 'react';
import { tracks } from '@/content/playlist';
import { songStats, type SongStats } from '@/content/songStats';
import { fitLine, pearson, shuffle } from '@/lib/correlation';
import styles from './CorrelationGame.module.css';

/** Songs per round. A fresh sample each round, so the same two measures can give a different r. */
const SAMPLE = 30;
/** A guess this close to the real r keeps the streak going */
const HIT = 0.1;
const BEST_KEY = 'correlation-best-streak';

type Song = { title: string; artist: string; durationMs?: number; stats: SongStats };

type Measure = {
	label: string;
	/** How a song with more of this is described, and with less */
	more: string;
	less: string;
	get: (s: Song) => number | undefined;
	format: (n: number) => string;
};

const fixed = (n: number) => n.toFixed(2);

const measures: Measure[] = [
	{ label: 'Energy', more: 'more energetic', less: 'calmer', get: (s) => s.stats.energy, format: fixed },
	{
		label: 'Danceability',
		more: 'more danceable',
		less: 'less danceable',
		get: (s) => s.stats.danceability,
		format: fixed,
	},
	{ label: 'Happiness', more: 'happier', less: 'sadder', get: (s) => s.stats.valence, format: fixed },
	{
		label: 'Acousticness',
		more: 'more acoustic',
		less: 'less acoustic',
		get: (s) => s.stats.acousticness,
		format: fixed,
	},
	{
		label: 'Tempo (BPM)',
		more: 'faster',
		less: 'slower',
		get: (s) => s.stats.tempo,
		format: (n) => `${Math.round(n)}`,
	},
	{
		label: 'Loudness (dB)',
		more: 'louder',
		less: 'quieter',
		get: (s) => s.stats.loudness,
		format: (n) => `${Math.round(n)}`,
	},
	{
		label: 'Length (min)',
		more: 'longer',
		less: 'shorter',
		get: (s) => (s.durationMs ? s.durationMs / 60000 : undefined),
		format: (n) => {
			const secs = Math.round(n * 60);
			return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
		},
	},
	{ label: 'Release year', more: 'newer', less: 'older', get: (s) => s.stats.year, format: (n) => `${Math.round(n)}` },
	{
		label: 'Popularity',
		more: 'more popular',
		less: 'less popular',
		get: (s) => s.stats.rank,
		format: (n) => `${Math.round(n / 1000)}k`,
	},
];

const songs: Song[] = tracks.flatMap((t) =>
	songStats[t.id] ? [{ title: t.title, artist: t.artist, durationMs: t.durationMs, stats: songStats[t.id] }] : [],
);

type Point = { x: number; y: number; song: Song };
/** `seen` is every measure shown so far this game, this round's included */
type Round = { xi: number; yi: number; points: Point[]; r: number; number: number; seen: number[] };

/** A game shows every measure at least once: two new ones a round, so it lasts this many rounds */
const ROUNDS = Math.ceil(measures.length / 2);

function dealRound(previous?: Round): Round {
	const seen = previous?.seen ?? [];
	const all = measures.map((_, i) => i);
	const fresh = shuffle(all.filter((i) => !seen.includes(i)));
	// With one new measure left, pair it with one already seen
	const pair = fresh.length >= 2 ? fresh.slice(0, 2) : [fresh[0], shuffle(seen)[0]];
	const [xi, yi] = shuffle(pair);
	const usable = songs.flatMap((song) => {
		const x = measures[xi].get(song);
		const y = measures[yi].get(song);
		return x === undefined || y === undefined ? [] : [{ x, y, song }];
	});
	const points = shuffle(usable).slice(0, SAMPLE);
	return {
		xi,
		yi,
		points,
		r: pearson(
			points.map((p) => p.x),
			points.map((p) => p.y),
		),
		number: (previous?.number ?? 0) + 1,
		seen: [...seen, ...pair.filter((i) => !seen.includes(i))],
	};
}

function describe(r: number, x: Measure, y: Measure) {
	const size = Math.abs(r);
	if (size < 0.1) return `${x.label} and ${y.label.toLowerCase()} barely move together in these songs.`;
	const strength = size < 0.3 ? 'a little' : size < 0.5 ? 'somewhat' : 'clearly';
	const lead = x.more[0].toUpperCase() + x.more.slice(1);
	return `${lead} songs tend to be ${strength} ${r > 0 ? y.more : y.less}.`;
}

// Chart geometry, in SVG units
const W = 210;
const H = 196;
const PAD = { left: 42, right: 8, top: 8, bottom: 34 };

/** Maps data to the chart, with a little room past the dots. Ticks sit on the real lowest, middle and highest values. */
function scale(values: number[], from: number, to: number) {
	const min = Math.min(...values);
	const max = Math.max(...values);
	const margin = (max - min || 2) * 0.06;
	const lo = min - margin;
	const hi = max + margin;
	return { lo, hi, ticks: [min, (min + max) / 2, max], at: (v: number) => from + ((v - lo) / (hi - lo)) * (to - from) };
}

type ScatterProps = { round: Round; revealed: boolean; picked: number | null; onPick: (i: number) => void };

/** The chart and its caption. Memoized so dragging the guess slider doesn't redraw every dot. */
const Scatter = memo(function Scatter({ round, revealed, picked, onPick }: ScatterProps) {
	const x = measures[round.xi];
	const y = measures[round.yi];
	const sx = scale(
		round.points.map((p) => p.x),
		PAD.left,
		W - PAD.right,
	);
	const sy = scale(
		round.points.map((p) => p.y),
		H - PAD.bottom,
		PAD.top,
	);
	const line = fitLine(
		round.points.map((p) => p.x),
		round.points.map((p) => p.y),
	);
	const song = picked === null ? null : round.points[picked];

	return (
		<figure className={styles.figure}>
			<svg
				className={styles.chart}
				viewBox={`0 0 ${W} ${H}`}
				role="img"
				aria-label={`Scatter plot of ${round.points.length} songs: ${x.label} across, ${y.label} up.`}
			>
				<defs>
					<clipPath id="correlation-plot-area">
						<rect x={PAD.left} y={PAD.top} width={W - PAD.left - PAD.right} height={H - PAD.top - PAD.bottom} />
					</clipPath>
				</defs>
				<rect
					className={styles.plotBg}
					x={PAD.left}
					y={PAD.top}
					width={W - PAD.left - PAD.right}
					height={H - PAD.top - PAD.bottom}
				/>
				{sx.ticks.map((v, i) => (
					<g key={`x${i}`}>
						<line className={styles.grid} x1={sx.at(v)} x2={sx.at(v)} y1={PAD.top} y2={H - PAD.bottom} />
						<text
							className={styles.tick}
							x={sx.at(v)}
							y={H - PAD.bottom + 12}
							textAnchor={i === 0 ? 'start' : i === 2 ? 'end' : 'middle'}
						>
							{x.format(v)}
						</text>
					</g>
				))}
				{sy.ticks.map((v, i) => (
					<g key={`y${i}`}>
						<line className={styles.grid} x1={PAD.left} x2={W - PAD.right} y1={sy.at(v)} y2={sy.at(v)} />
						<text className={styles.tick} x={PAD.left - 4} y={sy.at(v)} textAnchor="end" dominantBaseline="middle">
							{y.format(v)}
						</text>
					</g>
				))}
				<text className={styles.axisLabel} x={(PAD.left + W - PAD.right) / 2} y={H - 5} textAnchor="middle">
					{x.label} →
				</text>
				<text
					className={styles.axisLabel}
					transform={`translate(10 ${(PAD.top + H - PAD.bottom) / 2}) rotate(-90)`}
					textAnchor="middle"
				>
					{y.label} →
				</text>

				{revealed && (
					<line
						className={styles.fit}
						clipPath="url(#correlation-plot-area)"
						x1={sx.at(sx.lo)}
						y1={sy.at(line.slope * sx.lo + line.intercept)}
						x2={sx.at(sx.hi)}
						y2={sy.at(line.slope * sx.hi + line.intercept)}
					/>
				)}

				{round.points.map((p, i) => (
					<g
						key={`${p.song.title}-${p.song.artist}`}
						className={styles.dot}
						data-picked={picked === i ? '' : undefined}
						onPointerEnter={() => onPick(i)}
						onClick={() => onPick(i)}
					>
						<circle className={styles.hit} cx={sx.at(p.x)} cy={sy.at(p.y)} r={8} />
						<circle cx={sx.at(p.x)} cy={sy.at(p.y)} r={3.5} />
					</g>
				))}
			</svg>
			<figcaption className={styles.caption} aria-live="polite">
				{song ? (
					<>
						<b>{song.song.title}</b> · {song.song.artist} · {x.label} {x.format(song.x)}, {y.label} {y.format(song.y)}
					</>
				) : (
					'Tap a dot to see the song.'
				)}
			</figcaption>
		</figure>
	);
});

export function CorrelationGame() {
	const [round, setRound] = useState<Round | null>(null);
	const [guess, setGuess] = useState(0);
	const [revealed, setRevealed] = useState(false);
	const [picked, setPicked] = useState<number | null>(null);
	const [finished, setFinished] = useState(false);
	const [score, setScore] = useState({ points: 0, totalOff: 0, streak: 0, best: 0 });
	const sliderRef = useRef<HTMLInputElement>(null);
	const nextRef = useRef<HTMLButtonElement>(null);
	const againRef = useRef<HTMLButtonElement>(null);
	const focusSlider = useRef(false);

	useEffect(() => {
		let best = 0;
		try {
			best = Number(localStorage.getItem(BEST_KEY)) || 0;
		} catch {}
		// Random songs have to wait for the browser, or the server and client would disagree
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setRound(dealRound());
		setScore((s) => ({ ...s, best }));
	}, []);

	// Keyboard focus follows the game: "Next round" after a guess, the slider on a new round, "Play again" at the end
	useEffect(() => {
		if (finished) againRef.current?.focus();
		else if (revealed) nextRef.current?.focus();
		else if (focusSlider.current) {
			focusSlider.current = false;
			sliderRef.current?.focus();
		}
	}, [revealed, finished, round]);

	if (!round) {
		return (
			<div className={styles.game}>
				<p className={styles.intro}>Dealing songs from my playlist…</p>
				<div className={styles.chartLoading} />
			</div>
		);
	}

	const x = measures[round.xi];
	const y = measures[round.yi];
	const off = Math.abs(guess - round.r);
	const earned = Math.max(0, Math.round(100 * (1 - off)));
	const lastRound = round.number >= ROUNDS;

	function lockIn(e: FormEvent) {
		e.preventDefault();
		if (!round || revealed) return;
		const hit = Math.abs(guess - round.r) <= HIT;
		const streak = hit ? score.streak + 1 : 0;
		const best = Math.max(score.best, streak);
		if (best > score.best) {
			try {
				localStorage.setItem(BEST_KEY, String(best));
			} catch {}
		}
		setScore({ points: score.points + earned, totalOff: score.totalOff + off, streak, best });
		setRevealed(true);
	}

	function next() {
		if (!round) return;
		if (lastRound) {
			setFinished(true);
			return;
		}
		focusSlider.current = true;
		setRound(dealRound(round));
		setGuess(0);
		setRevealed(false);
		setPicked(null);
	}

	function playAgain() {
		focusSlider.current = true;
		setRound(dealRound());
		setScore((s) => ({ points: 0, totalOff: 0, streak: 0, best: s.best }));
		setGuess(0);
		setRevealed(false);
		setFinished(false);
		setPicked(null);
	}

	return (
		<div className={styles.game}>
			<p className={styles.intro}>
				Each dot is a song in the random playlist on the top right. Guess the correlation: <b>1</b> proportional, <b>−1</b> inversely proportional, <b>0</b> no
				correlation.
			</p>

			<Scatter round={round} revealed={revealed} picked={picked} onPick={setPicked} />

			<form className={styles.controls} onSubmit={lockIn}>
				<label className={styles.guessLabel} htmlFor="correlation-guess">
					Your guess: <output htmlFor="correlation-guess">{guess.toFixed(2)}</output>
				</label>
				<div className={styles.sliderRow}>
					<span aria-hidden="true">−1</span>
					<input
						ref={sliderRef}
						id="correlation-guess"
						type="range"
						min={-1}
						max={1}
						step={0.01}
						value={guess}
						disabled={revealed}
						onChange={(e) => setGuess(Number(e.target.value))}
					/>
					<span aria-hidden="true">1</span>
				</div>
				{finished ? (
					<button key="again" ref={againRef} type="button" onClick={playAgain}>
						Play again
					</button>
				) : revealed ? (
					// Keys keep these separate buttons; reusing one would let the click on "Next round" submit a guess
					<button key="next" ref={nextRef} type="button" onClick={next}>
						{lastRound ? 'See my score' : 'Next round'}
					</button>
				) : (
					<button key="lock" type="submit">
						Lock in guess
					</button>
				)}
			</form>

			<div className={styles.result} aria-live="polite">
				{finished ? (
					<>
						<p className={styles.resultHead}>
							Game over: {score.points} of {ROUNDS * 100} points
						</p>
						<p>
							You&apos;ve seen all {measures.length} measures. Your guesses were off by{' '}
							{(score.totalOff / ROUNDS).toFixed(2)} on average, and your best streak is {score.best}.
						</p>
					</>
				) : revealed ? (
					<>
						<p className={styles.resultHead}>
							Real r = {(Math.abs(round.r) < 0.005 ? 0 : round.r).toFixed(2)} · off by {off.toFixed(2)} · +{earned}
							{off <= HIT ? ' · nailed it' : ''}
						</p>
						<p>{describe(round.r, x, y)}</p>
					</>
				) : (
					<p className={styles.waiting}>Within {HIT} of the real r builds a streak.</p>
				)}
			</div>

			<p className={styles.score}>
				Round {round.number}/{ROUNDS} · {score.points} pts · Streak {score.streak} (best {score.best})
			</p>
			<p className={styles.source}>Song data: ReccoBeats and Deezer.</p>
		</div>
	);
}
