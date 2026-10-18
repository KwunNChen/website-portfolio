/** Pearson correlation of two equal-length lists. 0 when either list doesn't vary. */
export function pearson(xs: number[], ys: number[]) {
	const n = xs.length;
	const mx = xs.reduce((a, b) => a + b, 0) / n;
	const my = ys.reduce((a, b) => a + b, 0) / n;
	let sxy = 0;
	let sxx = 0;
	let syy = 0;
	for (let i = 0; i < n; i++) {
		const dx = xs[i] - mx;
		const dy = ys[i] - my;
		sxy += dx * dy;
		sxx += dx * dx;
		syy += dy * dy;
	}
	return sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0;
}

/** Least-squares line y = slope * x + intercept */
export function fitLine(xs: number[], ys: number[]) {
	const n = xs.length;
	const mx = xs.reduce((a, b) => a + b, 0) / n;
	const my = ys.reduce((a, b) => a + b, 0) / n;
	let sxy = 0;
	let sxx = 0;
	for (let i = 0; i < n; i++) {
		sxy += (xs[i] - mx) * (ys[i] - my);
		sxx += (xs[i] - mx) ** 2;
	}
	const slope = sxx ? sxy / sxx : 0;
	return { slope, intercept: my - slope * mx };
}

export function shuffle<T>(items: T[]) {
	const a = [...items];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
