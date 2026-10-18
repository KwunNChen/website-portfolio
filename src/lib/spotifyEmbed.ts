/**
 * Thin wrapper around Spotify's official Embed iFrame API.
 * https://developer.spotify.com/documentation/embeds/references/iframe-api
 *
 * The script is only loaded when a visitor presses play, so the page makes no Spotify requests until then.
 */

export type PlaybackUpdate = {
	playingURI: string;
	isPaused: boolean;
	isBuffering: boolean;
	/** milliseconds */
	duration: number;
	/** milliseconds */
	position: number;
};

export type EmbedController = {
	loadUri(uri: string): void;
	play(): void;
	pause(): void;
	resume(): void;
	togglePlay(): void;
	seek(seconds: number): void;
	destroy(): void;
	addListener(event: 'ready', cb: () => void): void;
	addListener(event: 'playback_update', cb: (e: { data: PlaybackUpdate }) => void): void;
};

type IFrameApi = {
	createController(
		element: HTMLElement,
		options: { uri: string; width?: number | string; height?: number },
		callback: (controller: EmbedController) => void,
	): void;
};

declare global {
	interface Window {
		onSpotifyIframeApiReady?: (api: IFrameApi) => void;
	}
}

const SCRIPT_SRC = 'https://open.spotify.com/embed/iframe-api/v1';
let apiPromise: Promise<IFrameApi> | null = null;

/** Loads the iFrame API script once and resolves with the API object */
export function loadSpotifyIframeApi(): Promise<IFrameApi> {
	if (apiPromise) return apiPromise;
	apiPromise = new Promise((resolve, reject) => {
		window.onSpotifyIframeApiReady = (api) => resolve(api);
		const script = document.createElement('script');
		script.src = SCRIPT_SRC;
		script.async = true;
		script.onerror = () => {
			apiPromise = null;
			reject(new Error('Spotify embed failed to load'));
		};
		document.body.appendChild(script);
	});
	return apiPromise;
}

export const trackUri = (id: string) => `spotify:track:${id}`;
