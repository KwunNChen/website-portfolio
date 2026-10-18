import Image from 'next/image';
import Link from 'next/link';
import { site, stats, status } from '@/content/site';
import { skillGroups } from '@/content/experience';
import { Win7Window } from './Win7Window';
import styles from './Shell.module.css';

export function LeftSidebar() {
	return (
		<aside className={styles.side} aria-label="Status and contact">
			<Win7Window title="Status" as="div">
				<figure className={styles.photo}>
					<Image
						src="/images/sather-tower.jpg"
						width={1280}
						height={826}
						alt="Sather Tower and Doe Library at UC Berkeley under a blue sky"
						sizes="240px"
						priority
					/>
					<figcaption>UC Berkeley, where I study</figcaption>
				</figure>
				<dl className={styles.statusList}>
					{status.map((s) => (
						<div key={s.label}>
							<dt>{s.label}</dt>
							<dd>{s.value}</dd>
						</div>
					))}
				</dl>
			</Win7Window>
			<Win7Window title="Contact" as="div">
				<div className={styles.contact}>
					<a className="btn primary" href={`mailto:${site.email}`}>
						Email me
					</a>
					<a className="btn" href={site.linkedin} target="_blank" rel="noopener noreferrer">
						LinkedIn
					</a>
					<a className="btn" href={site.github} target="_blank" rel="noopener noreferrer">
						GitHub
					</a>
					<p className={styles.small}>{site.email}</p>
				</div>
			</Win7Window>
		</aside>
	);
}

export function RightSidebar() {
	return (
		<aside className={styles.side} aria-label="Numbers and toolbox">
			<Win7Window title="By the numbers" as="div">
				<dl className={styles.stats}>
					{stats.map((s) => (
						<div key={s.label}>
							<dd>{s.value}</dd>
							<dt>{s.label}</dt>
						</div>
					))}
				</dl>
			</Win7Window>
			<Win7Window title="Toolbox" as="div">
				<div className={styles.toolbox}>
					{skillGroups.map((g) => (
						<div key={g.name}>
							<p className={styles.toolHead}>{g.name}</p>
							<ul className="tags">
								{g.items.map((i) => (
									<li key={i}>{i}</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</Win7Window>
			<Win7Window title="Now building" as="div">
				<p>
					<Link href="/projects/slack-the-tape">Slack the Tape</Link>: a Slack bot that answers plain-English questions
					about market data.
				</p>
			</Win7Window>
		</aside>
	);
}
