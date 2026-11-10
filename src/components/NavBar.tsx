'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Shell.module.css';

const pages = [
	{ href: '/', label: 'Home' },
	{ href: '/projects', label: 'Projects' },
	{ href: '/experience', label: 'Experience' },
];

// A file, not a page, so a plain link that opens it in a new tab
const resume = (
	<a href="/Kwun_Resume.pdf" className={styles.navBtn} target="_blank" rel="noopener noreferrer">
		Resume
	</a>
);

export function NavBar() {
	const pathname = usePathname();
	const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

	return (
		<nav className={styles.navBar} aria-label="Pages">
			{pages.map((p) => (
				<Link key={p.href} href={p.href} className={styles.navBtn} aria-current={isActive(p.href) ? 'page' : undefined}>
					{p.label}
				</Link>
			))}
			{resume}
		</nav>
	);
}

/** Same bar with no active state, shown while the pathname is resolving */
export function NavBarFallback() {
	return (
		<nav className={styles.navBar} aria-label="Pages">
			{pages.map((p) => (
				<Link key={p.href} href={p.href} className={styles.navBtn}>
					{p.label}
				</Link>
			))}
			{resume}
		</nav>
	);
}
