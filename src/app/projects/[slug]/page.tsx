import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Win7Window } from '@/components/Win7Window';
import { StatusBadge } from '@/components/StatusBadge';
import { getProject, projects } from '@/content/projects';
import styles from '../../pages.module.css';

// Every project is prerendered; unknown slugs hit notFound() below
export function generateStaticParams() {
	return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<'/projects/[slug]'>): Promise<Metadata> {
	const project = getProject((await params).slug);
	return project ? { title: project.title, description: project.tagline } : {};
}

export default async function ProjectPage({ params }: PageProps<'/projects/[slug]'>) {
	const project = getProject((await params).slug);
	if (!project) notFound();

	return (
		<>
			<Win7Window title={project.file} as="article">
				<div className="stack">
					<Image
						className={styles.banner}
						src={project.image.src}
						width={project.image.width}
						height={project.image.height}
						alt={project.image.alt}
						sizes="(max-width: 1080px) 100vw, 640px"
						style={{ objectPosition: project.image.position }}
					/>
					<div className={styles.cardHead}>
						<h1 className={styles.pageTitle}>{project.title}</h1>
						<StatusBadge status={project.status} />
					</div>
					<p className={styles.pitch}>{project.tagline}</p>
					<ul className="tags" aria-label="Stack">
						{project.stack.map((s) => (
							<li key={s}>{s}</li>
						))}
					</ul>
					<div className={`stack ${styles.writeUp}`}>
						{project.writeUp.map((block) => (
							<section key={block.heading} className="stack">
								<h2>{block.heading}</h2>
								{block.paragraphs?.map((t) => (
									<p key={t} className={styles.lede}>
										{t}
									</p>
								))}
								{block.steps && (
									<ul className={styles.steps}>
										{block.steps.map((s) => (
											<li key={s.label}>
												<strong>{s.label}.</strong> {s.text}
											</li>
										))}
									</ul>
								)}
							</section>
						))}
					</div>
					<div className="btn-row">
						<Link className="btn" href="/projects">
							← All projects
						</Link>
						{project.repo && (
							<a className="btn primary" href={project.repo} target="_blank" rel="noopener noreferrer">
								View the code
							</a>
						)}
					</div>
				</div>
			</Win7Window>
		</>
	);
}
