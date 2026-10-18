import type { Metadata } from 'next';
import Image from 'next/image';
import { Win7Window } from '@/components/Win7Window';
import { dateRange, jobs, openSource } from '@/content/experience';
import styles from '../pages.module.css';

export const metadata: Metadata = { title: 'Experience' };

export default function ExperiencePage() {
	return (
		<>
			<Win7Window title="experience.log">
				<div className="stack">
					<h1 className={styles.pageTitle}>Experience</h1>
					<p className={styles.lede}>
						Data engineering, analytics and research work, newest first. Open-source work is at the bottom.
					</p>
				</div>
			</Win7Window>

			{jobs.map((j) => (
				<Win7Window key={j.org} title={j.org} as="article">
					<div className="stack">
						{j.image && (
							<Image
								className={styles.banner}
								src={j.image.src}
								width={j.image.width}
								height={j.image.height}
								alt={j.image.alt}
								sizes="(max-width: 1080px) 100vw, 640px"
								style={{ objectPosition: j.image.position }}
							/>
						)}
						<div className={styles.cardHead}>
							<div>
								<h2 className={styles.cardTitle}>{j.org}</h2>
								<p className={styles.role}>{j.role}</p>
							</div>
							<p className={styles.dates}>{dateRange(j)}</p>
						</div>
						<ul className={styles.bullets}>
							{j.bullets.map((b) => (
								<li key={b}>{b}</li>
							))}
						</ul>
						<ul className="tags" aria-label={`${j.org} tools`}>
							{j.tags.map((t) => (
								<li key={t}>{t}</li>
							))}
						</ul>
					</div>
				</Win7Window>
			))}

			<Win7Window title="Open source">
				<div className="stack">
					{openSource.map((o) => (
						<article key={o.title} className="stack">
							{o.image && (
								<Image
									className={styles.banner}
									src={o.image.src}
									width={o.image.width}
									height={o.image.height}
									alt={o.image.alt}
									sizes="(max-width: 1080px) 100vw, 640px"
									style={{ objectPosition: o.image.position }}
								/>
							)}
							<h2 className={styles.cardTitle}>{o.title}</h2>
							<p className={styles.lede}>{o.summary}</p>
							<ul className="tags" aria-label={`${o.title} stack`}>
								{o.stack.map((s) => (
									<li key={s}>{s}</li>
								))}
							</ul>
							{o.link && (
								<div className="btn-row">
									<a className="btn" href={o.link} target="_blank" rel="noopener noreferrer">
										{o.linkLabel ?? 'View'}
									</a>
								</div>
							)}
						</article>
					))}
				</div>
			</Win7Window>
		</>
	);
}
