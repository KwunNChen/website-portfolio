import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Win7Window } from '@/components/Win7Window';
import { StatusBadge } from '@/components/StatusBadge';
import { projects } from '@/content/projects';
import styles from '../pages.module.css';

export const metadata: Metadata = { title: 'Projects' };

export default function ProjectsPage() {
	return (
		<>
			<Win7Window title="C:\Users\Kwun\Projects">
				<div className="stack">
					<h1 className={styles.pageTitle}>Projects</h1>
					<p className={styles.lede}>
						Pipelines and tools I’ve built on my own time. Each one has a write-up on how it works.
					</p>
				</div>
			</Win7Window>

			{projects.map((p) => (
				<Win7Window key={p.slug} title={p.file} as="article">
					<div className="stack">
						<Image
							className={styles.banner}
							src={p.image.src}
							width={p.image.width}
							height={p.image.height}
							alt={p.image.alt}
							sizes="(max-width: 1080px) 100vw, 640px"
							style={{ objectPosition: p.image.position }}
						/>
						<div className={styles.cardHead}>
							<h2 className={styles.cardTitle}>{p.title}</h2>
							<StatusBadge status={p.status} />
						</div>
						<p className={styles.role}>{p.tagline}</p>
						<p>{p.summary}</p>
						<ul className="tags" aria-label={`${p.title} stack`}>
							{p.stack.map((s) => (
								<li key={s}>{s}</li>
							))}
						</ul>
						<div className="btn-row">
							<Link className="btn primary" href={`/projects/${p.slug}`}>
								Read the write-up
							</Link>
							{p.repo && (
								<a className="btn" href={p.repo} target="_blank" rel="noopener noreferrer">
									Code
								</a>
							)}
						</div>
					</div>
				</Win7Window>
			))}
		</>
	);
}
