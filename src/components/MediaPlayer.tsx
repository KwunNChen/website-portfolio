'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { playlist, tracks } from '@/content/playlist';
import { loadSpotifyIframeApi, trackUri, type EmbedController, type PlaybackUpdate } from '@/lib/spotifyEmbed';
import styles from './MediaPlayer.module.css';

type Status = 'idle' | 'loading' | 'ready' | 'error';

const UP_NEXT = 4;

function shuffled(indices: number[]) {
	const a = [...indices];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

const clock = (ms: number) => {
	const s = Math.max(0, Math.floor(ms / 1000));
	return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/** Windows 7 Media Player–style skin around Spotify's official embed, shuffling my playlist */
export function MediaPlayer() {
	// Same order on the server and first paint; shuffled once the page is in the browser
	const [order, setOrder] = useState<number[]>(() => tracks.map((_, i) => i));
	const [pos, setPos] = useState(0);
	const [status, setStatus] = useState<Status>('idle');
	const [playback, setPlayback] = useState({ isPaused: true, position: 0, duration: 0 });

	const embedHost = useRef<HTMLDivElement>(null);
	const controller = useRef<EmbedController | null>(null);
	// Mirrors of state for Spotify's callbacks, which outlive any one render
	const orderRef = useRef(order);
	const posRef = useRef(0);
	const advancedFrom = useRef<string | null>(null);
	const endTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		const next = shuffled(tracks.map((_, i) => i));
		orderRef.current = next;
		// Random order has to wait for the browser, or the server and client would disagree
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setOrder(next);
		return () => {
			if (endTimer.current) clearTimeout(endTimer.current);
			controller.current?.destroy();
		};
	}, []);

	const current = tracks[order[pos]];
	const duration = playback.duration || current.durationMs || 0;
	const upNext = Array.from({ length: Math.min(UP_NEXT, order.length - 1) }, (_, k) => (pos + 1 + k) % order.length);

	function advance(fromUri: string) {
		if (advancedFrom.current === fromUri) return;
		advancedFrom.current = fromUri;
		playAt((posRef.current + 1) % orderRef.current.length);
	}

	function onUpdate(data: PlaybackUpdate) {
		setPlayback({ isPaused: data.isPaused, position: data.position, duration: data.duration });
		if (endTimer.current) clearTimeout(endTimer.current);
		endTimer.current = null;

		// When a song (or a logged-out visitor's preview) runs out, Spotify sends one last update near the end and
		// then goes quiet; it doesn't always report a pause. So: near the end, wait for the remaining time plus a
		// moment, and if nothing new arrives (a seek or a pause would), start the next shuffled song.
		const remaining = data.duration - data.position;
		if (data.duration <= 0 || remaining > 1500) return;
		if (data.isPaused) {
			if (remaining <= 600) advance(data.playingURI);
			return;
		}
		endTimer.current = setTimeout(() => advance(data.playingURI), Math.max(0, remaining) + 700);
	}

	async function start(uri: string) {
		const host = embedHost.current;
		if (!host) return;
		setStatus('loading');
		try {
			const api = await loadSpotifyIframeApi();
			// Spotify replaces this element with its iframe, so give it one React doesn't own
			const slot = document.createElement('div');
			host.replaceChildren(slot);
			api.createController(slot, { uri, width: '100%', height: 80 }, (ctrl) => {
				controller.current = ctrl;
				ctrl.addListener('ready', () => {
					setStatus('ready');
					ctrl.play();
				});
				ctrl.addListener('playback_update', (e) => onUpdate(e.data));
			});
		} catch {
			setStatus('error');
		}
	}

	function playAt(nextPos: number) {
		posRef.current = nextPos;
		setPos(nextPos);
		const track = tracks[orderRef.current[nextPos]];
		advancedFrom.current = null;
		setPlayback({ isPaused: false, position: 0, duration: track.durationMs ?? 0 });
		const ctrl = controller.current;
		if (ctrl) {
			ctrl.loadUri(trackUri(track.id));
			ctrl.play();
		} else {
			void start(trackUri(track.id));
		}
	}

	function togglePlay() {
		if (controller.current) controller.current.togglePlay();
		else if (status !== 'loading') void start(trackUri(current.id));
	}

	function previous() {
		if (playback.position > 3000 && controller.current) controller.current.seek(0);
		else playAt((pos - 1 + order.length) % order.length);
	}

	// Re-deal everything after the current song
	function reshuffle() {
		const rest = shuffled(order.filter((_, i) => i !== pos));
		const next = [order[pos], ...rest];
		orderRef.current = next;
		posRef.current = 0;
		setOrder(next);
		setPos(0);
	}

	const playing = status === 'ready' && !playback.isPaused;
	// Spotify gives logged-out visitors a ~30s clip; the song itself is longer
	const onPreview =
		status === 'ready' && playback.duration > 0 && playback.duration <= 31000 && (current.durationMs ?? 0) > 35000;

	return (
		<div className={styles.player}>
			<p className={styles.mode}>
				<span>Now Playing</span>
				<a href={playlist.url} target="_blank" rel="noopener noreferrer">
					{playlist.name}
				</a>
			</p>

			<div className={styles.screen}>
				{current.art ? (
					<Image
						src={current.art}
						alt={`Cover of ${current.title}`}
						fill
						sizes="220px"
						unoptimized
						className={styles.art}
					/>
				) : (
					<div className={styles.noArt}>♪</div>
				)}
			</div>

			<div className={styles.info} aria-live="polite">
				<p className={styles.title}>{current.title}</p>
				<p className={styles.artist}>{current.artist}</p>
			</div>

			<div className={styles.seek}>
				<input
					type="range"
					aria-label="Seek"
					min={0}
					max={Math.max(1, duration)}
					step={1000}
					value={Math.min(playback.position, duration)}
					disabled={status !== 'ready'}
					onChange={(e) => controller.current?.seek(Math.round(Number(e.target.value) / 1000))}
					style={
						{ '--fill': `${duration ? (Math.min(playback.position, duration) / duration) * 100 : 0}%` } as CSSProperties
					}
				/>
				<span className={styles.times}>
					{clock(playback.position)} / {clock(duration)}
				</span>
			</div>

			<div className={styles.transport}>
				<button
					type="button"
					className={styles.small}
					onClick={reshuffle}
					aria-label="Shuffle again"
					title="Shuffle again"
				>
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M3 7h3.5c2 0 3.2 1 4.3 2.6l2.4 3.8C14.3 15 15.5 16 17.5 16H20m0 0-2.5-2.5M20 16l-2.5 2.5M3 16h3.5c1.2 0 2.1-.4 2.9-1.1M20 7h-2.5c-1.2 0-2.1.4-2.9 1.1M20 7l-2.5-2.5M20 7l-2.5 2.5" />
					</svg>
				</button>
				<button type="button" className={styles.skip} onClick={previous} aria-label="Previous track">
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M6 5v14M19 5 9 12l10 7z" />
					</svg>
				</button>
				<button
					type="button"
					className={styles.orb}
					onClick={togglePlay}
					aria-label={playing ? 'Pause' : 'Play'}
					aria-busy={status === 'loading'}
				>
					{playing ? (
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path d="M8 5v14M16 5v14" />
						</svg>
					) : (
						<svg viewBox="0 0 24 24" aria-hidden="true">
							<path d="M8 5v14l11-7z" />
						</svg>
					)}
				</button>
				<button
					type="button"
					className={styles.skip}
					onClick={() => playAt((pos + 1) % order.length)}
					aria-label="Next track"
				>
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M18 5v14M5 5l10 7-10 7z" />
					</svg>
				</button>
				<span className={styles.small} aria-hidden="true" />
			</div>

			{/* Spotify's own player does the playing; it appears here after the first press of play */}
			<div ref={embedHost} className={styles.embed} data-status={status} />
			{status === 'error' && (
				<p className={styles.note}>
					Spotify didn’t load.{' '}
					<a href={playlist.url} target="_blank" rel="noopener noreferrer">
						Open the playlist on Spotify
					</a>
					.
				</p>
			)}
			{status === 'idle' && <p className={styles.note}>Press play to load the Spotify player. Shuffled every visit.</p>}
			{onPreview && (
				<p className={styles.note}>
					Hearing 30-second previews?{' '}
					<a href="https://accounts.spotify.com/login" target="_blank" rel="noopener noreferrer">
						Log in to Spotify
					</a>{' '}
					in this browser for full songs (Chrome works best), then press play again.
				</p>
			)}

			<div className={styles.queue}>
				<p className={styles.queueHead}>Up next</p>
				<ol>
					{upNext.map((p) => {
						const t = tracks[order[p]];
						return (
							<li key={t.id}>
								<button type="button" onClick={() => playAt(p)}>
									<span className={styles.queueTitle}>{t.title}</span>
									<span className={styles.queueArtist}>{t.artist}</span>
								</button>
							</li>
						);
					})}
				</ol>
			</div>
		</div>
	);
}
