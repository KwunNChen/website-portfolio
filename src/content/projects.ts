export type WriteUpBlock = { heading: string; paragraphs?: string[]; steps?: { label: string; text: string }[] };

export type Picture = { src: string; width: number; height: number; alt: string; position?: string };

export type Project = {
	slug: string;
	title: string;
	/** Window title, written like a file name */
	file: string;
	tagline: string;
	summary: string;
	stack: string[];
	status: 'in-progress' | 'complete';
	repo?: string;
	/** A found picture of the project's world (credited in the footer), not a screenshot of the project */
	image: Picture;
	writeUp: WriteUpBlock[];
};

export const projects: Project[] = [
	{
		slug: 'slack-the-tape',
		title: 'Slack the Tape',
		file: 'slack_the_tape.py',
		tagline: 'An LLM assistant that lets anyone ask questions about market data in Slack',
		summary:
			'A cron-scheduled ETL pipeline lands 1-minute equity bars in date-partitioned Parquet, and an MCP server lets a Slack chatbot query it in plain English.',
		stack: ['Python', 'DuckDB', 'SQL', 'MCP', 'Slack', 'Linux'],
		status: 'in-progress',
		image: {
			src: '/images/ticker.jpg',
			width: 1024,
			height: 768,
			alt: 'Electronic stock ticker boards showing bid, offer and last prices in red and green LEDs',
			position: 'center 35%',
		},
		writeUp: [
			{
				heading: 'The idea',
				paragraphs: [
					'Market data is a good example of loud data. There are thousands of 1-minute bars per ticker per day, and most people who want an answer from it can’t write the SQL to get one. Slack the Tape puts that data behind a Slack bot, so a question like "how did NVDA trade in the last hour?" gets a real answer instead of a guess.',
				],
			},
			{
				heading: 'How it works',
				steps: [
					{
						label: 'Ingest',
						text: 'A Python ETL job pulls 1-minute equity bars and writes them to date-partitioned Parquet files. Re-running a day is idempotent, so a failed run can be retried without creating duplicate rows.',
					},
					{ label: 'Validate', text: 'Each load goes through data checks before it’s written.' },
					{ label: 'Schedule', text: 'cron runs the pipeline on Linux (WSL).' },
					{
						label: 'Query',
						text: 'DuckDB reads the Parquet files directly, so there’s no separate database to keep alive.',
					},
					{
						label: 'Ask',
						text: 'An MCP server gives the LLM a small set of guarded query and reporting tools. The Slack bot can only touch the data through those tools, which keeps it from running arbitrary SQL.',
					},
				],
			},
			{
				heading: 'Status',
				paragraphs: ['The pipeline is being built now, and the MCP server and Slack bot are in design.'],
			},
		],
	},
	{
		slug: 'military-aircraft-pipeline',
		title: 'Military Aircraft Activity Pipeline',
		file: 'adsb_pipeline.py',
		tagline: 'Live ADS-B telemetry turned into clean, analysis-ready flight features',
		summary:
			'An end-to-end pipeline that pulls a live global ADS-B feed, validates every record with Pydantic, derives flight-activity features in Polars, and warehouses the results in DuckDB.',
		stack: ['Python', 'Polars', 'Pydantic', 'DuckDB', 'Prefect'],
		status: 'complete',
		image: {
			src: '/images/f15-formation.jpg',
			width: 1280,
			height: 631,
			alt: 'Three F-15 Eagles flying in formation against a pale sky',
			position: 'center',
		},
		writeUp: [
			{
				heading: 'The idea',
				paragraphs: [
					'ADS-B transponders broadcast an aircraft’s position, altitude and speed every few seconds. The raw feed is noisy and inconsistent. This pipeline turns it into a table you can actually analyze for military aircraft activity.',
				],
			},
			{
				heading: 'How it works',
				steps: [
					{
						label: 'Ingest',
						text: 'Each run pulls real-time telemetry from a live global ADS-B feed and processes 500+ aircraft per run.',
					},
					{
						label: 'Validate',
						text: 'Pydantic schemas check every record on ingest, so bad rows get caught before they reach the warehouse.',
					},
					{
						label: 'Transform',
						text: 'Polars computes flight-activity features from the raw telemetry: climb rate, acceleration, heading change, and a regional classification.',
					},
					{ label: 'Warehouse', text: 'The results are loaded into DuckDB.' },
					{
						label: 'Orchestrate',
						text: 'Prefect runs the validation, transformation and warehousing stages as one flow.',
					},
				],
			},
		],
	},
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
