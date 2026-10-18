export type Job = {
	org: string;
	role: string;
	/** ISO month, e.g. 2026-09 */
	start: string;
	/** Omit for a current role */
	end?: string;
	bullets: string[];
	tags: string[];
};

// Newest first
export const jobs: Job[] = [
	{
		org: 'Anyscale',
		role: 'Data Engineering Consultant',
		start: '2026-09',
		bullets: [
			'Building a config-driven Polars pipeline for an autonomous RC car platform. It logs multi-sensor data, cleans it, and loads it as analysis-ready data for GPU-based model training.',
		],
		tags: ['Polars', 'Python', 'Data pipelines'],
	},
	{
		org: 'Air Combat Command (U.S. Air Force)',
		role: 'Data Science & Automation Intern',
		start: '2026-05',
		end: '2026-08',
		bullets: [
			'Built an ELT pipeline and star schema that connected Palantir Envision with 500+ shared-drive folders and fed a weekly-refreshed Power BI dashboard. ACC’s colonels and brigadier generals used it for readiness insights.',
			'Built an ingestion and validation pipeline that ran 4,000+ personnel records through a multi-criteria decision-tree eligibility engine. Checked against manual review, it reached 90% automated accuracy and saved 5+ hours of manual work a week.',
			'Designed a unified data model for senior enlisted personnel and proposed a talent-identification dashboard that combines readiness, PME and performance data.',
		],
		tags: ['ELT', 'Star schema', 'Power BI', 'Palantir'],
	},
	{
		org: 'Sawyer',
		role: 'Product & Research Consultant',
		start: '2026-02',
		end: '2026-05',
		bullets: [
			'Collected and analyzed 500+ customer reviews from 100+ websites in one week, coding the ergonomics feedback into a structured dataset for a consumer product prototype.',
			'Turned the analysis into findings that non-technical product stakeholders could act on. It showed which features customers responded to most and shaped the prototype’s direction.',
			'Took part in a cross-functional review that narrowed 4 candidate prototype designs down to 1, using feedback from stakeholders outside the product team.',
		],
		tags: ['Research', 'Qualitative coding', 'Product'],
	},
	{
		org: 'Air Force ROTC Detachment 085',
		role: 'Lead Engineer',
		start: '2025-10',
		bullets: [
			'Trained scikit-learn models on cadet performance data to find training gaps, and used the results to inform the detachment’s training decisions.',
			'Leading a team that deployed an LLM-powered chatbot on Cloudflare Workers, which gives 100+ cadets real-time answers.',
		],
		tags: ['scikit-learn', 'LLMs', 'Cloudflare Workers'],
	},
];

const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const month = (iso: string) => monthFmt.format(new Date(`${iso}-01T00:00:00Z`));

export const dateRange = (job: Job) => `${month(job.start)} – ${job.end ? month(job.end) : 'Present'}`;

export type OpenSourceEntry = {
	title: string;
	summary: string;
	stack: string[];
	link?: string;
	linkLabel?: string;
};

// Online open source only for now; volunteering (IRL) gets its own list once there's content.
export const openSource: OpenSourceEntry[] = [
	{
		title: 'Open-source Roblox systems',
		summary:
			'Seven server-authoritative Luau packages built on a modular client-server architecture. They share a state-management service that settles conflicting writes when packages are installed independently of each other.',
		stack: ['Luau', 'Roblox'],
		link: 'https://github.com/KwunNChen',
		linkLabel: 'See them on GitHub',
	},
];

export const skillGroups = [
	{ name: 'Languages', items: ['Python', 'SQL', 'MATLAB', 'Java', 'JavaScript'] },
	{
		name: 'Data science & stats',
		items: [
			'Machine learning',
			'Classification',
			'Decision trees',
			'Linear regression',
			'Hypothesis testing',
			'A/B testing',
			'EDA',
			'Time series',
			'scikit-learn',
			'pandas',
			'NumPy',
			'Jupyter',
		],
	},
	{
		name: 'Data engineering',
		items: [
			'ETL/ELT',
			'Data modeling',
			'Star schema',
			'Parquet',
			'DuckDB',
			'PostgreSQL',
			'Polars',
			'Pydantic',
			'Prefect',
			'cron',
			'Git',
		],
	},
	{ name: 'AI & tooling', items: ['MCP servers', 'LLM chatbots (Gemini API)', 'Slack integrations', 'Linux'] },
];
