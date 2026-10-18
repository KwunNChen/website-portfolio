import Image from 'next/image';
import Link from 'next/link';
import { DataCarousel } from '@/components/DataCarousel';
import { Win7Window } from '@/components/Win7Window';
import { StatusBadge } from '@/components/StatusBadge';
import { projects } from '@/content/projects';
import { carouselItems } from '@/content/carousel';
import { dateRange, jobs } from '@/content/experience';
import styles from './pages.module.css';

export default function Home() {
	return (
		<>
			<Win7Window title="welcome.txt">
				<div className="stack">
					<h1 className={styles.hello}>Hi hi! I'm Kwun/Eric Chen.</h1>
					<p className={styles.pitch}>
						Data usually shows up loud and messy. My job is calming it down until someone can make a decision with it.
					</p>
					<p className={styles.lede}>
						I study Data Science and Statistics at UC Berkeley (Public Policy minor, class of 2029). This past summer I
						was at Air Combat Command building data pipelines for Air Force leadership, and these days I do data
						engineering for Anyscale.
					</p>
					<div className="btn-row">
						<Link className="btn primary" href="/projects">
							See my projects
						</Link>
						<Link className="btn" href="/experience">
							Experience
						</Link>
					</div>
				</div>
			</Win7Window>

			<Win7Window title="data_is_loud.exe">
				<DataCarousel items={carouselItems} />
			</Win7Window>

			<Win7Window title="Projects">
				<ul className={styles.projectList}>
					{projects.map((p) => (
						<li key={p.slug} className={styles.projectRow}>
							<Image
								className={styles.thumb}
								src={p.image.src}
								width={p.image.width}
								height={p.image.height}
								alt={p.image.alt}
								sizes="(max-width: 640px) 100vw, 200px"
								style={{ objectPosition: p.image.position }}
							/>
							<div className={styles.rowText}>
								<div className={styles.rowHead}>
									<h2>
										<Link href={`/projects/${p.slug}`}>{p.title}</Link>
									</h2>
									<StatusBadge status={p.status} />
								</div>
								<p>{p.tagline}</p>
								<ul className="tags" aria-label={`${p.title} stack`}>
									{p.stack.map((s) => (
										<li key={s}>{s}</li>
									))}
								</ul>
							</div>
						</li>
					))}
				</ul>
			</Win7Window>

			<Win7Window title="experience.log">
				<div className="stack">
					<ul className={styles.jobList}>
						{jobs.map((j) => (
							<li key={j.org}>
								<span className={styles.jobOrg}>{j.org}</span>
								<span>{j.role}</span>
								<span className={styles.jobWhen}>{dateRange(j)}</span>
							</li>
						))}
					</ul>
					<div className="btn-row">
						<Link className="btn" href="/experience">
							Read the details
						</Link>
					</div>
				</div>
			</Win7Window>
		</>
	);
}
