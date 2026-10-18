import { Suspense, type ReactNode } from 'react';
import { carouselItems } from '@/content/carousel';
import { credits, site } from '@/content/site';
import { NavBar, NavBarFallback } from './NavBar';
import { LeftSidebar, RightSidebar } from './Sidebars';
import { Win7Window } from './Win7Window';
import styles from './Shell.module.css';

// Site pictures plus any credited carousel photos, each listed once
const allCredits = [...credits, ...carouselItems.flatMap((item) => (item.credit ? [item.credit] : []))].filter(
	(c, i, list) => list.findIndex((other) => other.page === c.page) === i,
);

export function Shell({ children }: { children: ReactNode }) {
	return (
		<div className={styles.desktop}>
			<a className={styles.skipLink} href="#main">
				Skip to content
			</a>
			<Win7Window
				title="Kwun Chen · Data Science"
				as="header"
				bright={false}
				padded={false}
				bodyClassName={styles.headerBody}
			>
				<div className={styles.brand}>
					<a
						href={site.linkedin}
						className={styles.siteName}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`${site.name} on LinkedIn`}
					>
						{site.name}
					</a>
				</div>
				<Suspense fallback={<NavBarFallback />}>
					<NavBar />
				</Suspense>
			</Win7Window>

			<div className={styles.columns}>
				<LeftSidebar />
				<main id="main" className={styles.main}>
					{children}
				</main>
				<RightSidebar />
			</div>

			<footer className={styles.footer}>
				<p>© 2026 {site.name}. UI built with 7.css.</p>
				<p>
					Pictures:{' '}
					{allCredits.map((c, i) => (
						<span key={c.page}>
							{c.file}:{' '}
							<a href={c.page} target="_blank" rel="noopener noreferrer">
								“{c.title}”
							</a>{' '}
							by {c.creator},{' '}
							{c.licenseUrl ? (
								<a href={c.licenseUrl} target="_blank" rel="noopener noreferrer">
									{c.license}
								</a>
							) : (
								c.license
							)}
							{i < allCredits.length - 1 ? '. ' : '.'}
						</span>
					))}
				</p>
			</footer>
		</div>
	);
}
