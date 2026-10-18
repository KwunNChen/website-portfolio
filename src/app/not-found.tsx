import type { Metadata } from 'next';
import Link from 'next/link';
import { Win7Window } from '@/components/Win7Window';
import styles from './pages.module.css';

export const metadata: Metadata = { title: 'Page not found' };

// Styled after the Windows "cannot find" error dialog
export default function NotFound() {
	return (
		<Win7Window title="Error">
			<div className="stack">
				<h1 className={styles.pageTitle}>Page not found</h1>
				<p className={styles.lede}>
					Windows cannot find this page. Check the spelling, or start again from one of these.
				</p>
				<div className="btn-row">
					<Link className="btn primary" href="/">
						Home
					</Link>
					<Link className="btn" href="/projects">
						Projects
					</Link>
					<Link className="btn" href="/experience">
						Experience
					</Link>
				</div>
			</div>
		</Win7Window>
	);
}
