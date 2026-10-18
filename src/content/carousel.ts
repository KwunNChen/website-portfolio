/*
 * ─── The "data is loud" carousel on the home page ───────────────────────────
 *
 * Everything the ring spins through is in `carouselItems` below, in order around the ring.
 *
 * To add a card:     copy one entry, change the text, and set `image` (or leave it out for a plain colour band).
 * To remove a card:  delete its entry. The ring resizes itself; 5 to 10 cards looks best.
 * To change a photo: drop the file in public/images/carousel/ and point `image.src` at it.
 *                    Any size or shape works; it's cropped to fit. `image.position` picks which part shows,
 *                    e.g. 'center 30%' to show more of the top.
 * Photo credits:     if a picture isn't yours, fill in `credit` and it's listed in the site footer automatically.
 *
 * `carouselSettings` at the bottom controls how fast it spins and how it calms down.
 */

import type { Credit } from './site';

export type CarouselItem = {
	/** Small label above the title, e.g. 'Project' or 'Experience' */
	kind: string;
	title: string;
	/** One short line on the card face */
	line: string;
	/** A sentence or two shown once the carousel settles on this card */
	detail: string;
	/** Where the button under the result goes */
	href: string;
	/** Button text; defaults to "Open" */
	linkLabel?: string;
	image?: { src: string; position?: string };
	credit?: Credit;
};

export const carouselItems: CarouselItem[] = [
	{
		kind: 'Project',
		title: 'Slack the Tape',
		line: 'Python · DuckDB · MCP',
		detail:
			'A cron-scheduled ETL pipeline lands 1-minute equity bars in date-partitioned Parquet, and an MCP server lets a Slack chatbot query it in plain English.',
		href: '/projects/slack-the-tape',
		linkLabel: 'Open the write-up',
		image: { src: '/images/ticker.jpg', position: 'center 35%' },
		// Credited with the project in site.ts
	},
	{
		kind: 'Experience',
		title: 'Anyscale',
		line: 'Data Engineering Consultant, Sep 2026 – Present',
		detail:
			'Building a config-driven Polars pipeline for an autonomous RC car platform. It logs multi-sensor data, cleans it, and loads it as analysis-ready data for GPU-based model training.',
		href: '/experience',
		linkLabel: 'Go to Experience',
		image: { src: '/images/carousel/anyscale-rc-car.jpg', position: 'center 60%' },
		credit: {
			file: 'RC car',
			title: 'Autonomous Vehicle Competition 2010',
			creator: 'SparkFun Electronics',
			license: 'CC BY 2.0',
			licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
			page: 'https://www.flickr.com/photos/41898857@N04/4536388950',
		},
	},
	{
		kind: 'Project',
		title: 'Military Aircraft Activity Pipeline',
		line: 'Python · Polars · Pydantic',
		detail:
			'An end-to-end pipeline that pulls a live global ADS-B feed, validates every record with Pydantic, derives flight-activity features in Polars, and warehouses the results in DuckDB.',
		href: '/projects/military-aircraft-pipeline',
		linkLabel: 'Open the write-up',
		image: { src: '/images/f15-formation.jpg' },
		// Credited with the project in site.ts
	},
	{
		kind: 'Experience',
		title: 'Air Combat Command (U.S. Air Force)',
		line: 'Data Science & Automation Intern, May – Aug 2026',
		detail:
			'Built an ELT pipeline and star schema that fed a weekly Power BI readiness dashboard for ACC’s colonels and brigadier generals, plus an eligibility engine that reached 90% automated accuracy on 4,000+ records.',
		href: '/experience',
		linkLabel: 'Go to Experience',
		image: { src: '/images/carousel/acc-headquarters.jpg', position: 'center 70%' },
		credit: {
			file: 'ACC headquarters',
			title: 'Air Combat Command HQ',
			creator: 'U.S. Air Force',
			license: 'Public domain',
			page: 'https://commons.wikimedia.org/wiki/File:Air_Combat_Command_HQ.jpg',
		},
	},
	{
		kind: 'Experience',
		title: 'Sawyer',
		line: 'Product & Research Consultant, Feb – May 2026',
		detail:
			'Collected and coded 500+ customer reviews from 100+ websites in one week, then turned them into findings that shaped a consumer product prototype.',
		href: '/experience',
		linkLabel: 'Go to Experience',
		image: { src: '/images/carousel/sawyer-sticky-notes.jpg', position: 'center 55%' },
		credit: {
			file: 'Sticky notes',
			title: 'Brainstorming Customer Feedback (1)',
			creator: 'Steveonmz',
			license: 'CC BY-SA 4.0',
			licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
			page: 'https://commons.wikimedia.org/w/index.php?curid=61093066',
		},
	},
	{
		kind: 'Experience',
		title: 'Air Force ROTC Detachment 085',
		line: 'Lead Engineer, Oct 2025 – Present',
		detail:
			'Trained scikit-learn models on cadet performance data to find training gaps, and leading a team that deployed an LLM chatbot on Cloudflare Workers for 100+ cadets.',
		href: '/experience',
		linkLabel: 'Go to Experience',
		image: { src: '/images/carousel/afrotc-cadets.jpg', position: 'center 40%' },
		credit: {
			file: 'ROTC cadets',
			title: 'Senior NCOs from Los Angeles Air Force Base instruct Loyola Marymount ROTC cadets',
			creator: 'Tech. Sgt. Sarah Corrice, U.S. Air Force',
			license: 'Public domain',
			page: 'https://commons.wikimedia.org/wiki/File:Senior_NCOs_from_Los_Angeles_Air_Force_Base_instruct_Loyola_Marymount_ROTC_cadets_(1826992).jpg',
		},
	},
	{
		kind: 'Open source',
		title: 'Open-source Roblox systems',
		line: 'Luau · Roblox',
		detail:
			'Seven server-authoritative Luau packages that share a state-management service, so they can be installed independently without fighting over the same data.',
		href: '/experience',
		linkLabel: 'Go to Experience',
		image: { src: '/images/carousel/roblox-building-blocks.jpg' },
		credit: {
			file: 'Building blocks',
			title: 'Building Blocks',
			creator: 'Holger Zscheyge',
			license: 'CC BY 2.0',
			licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
			page: 'https://www.flickr.com/photos/49741083@N00/49012397',
		},
	},
];

export const carouselSettings = {
	/** Top spin speed in degrees per second (720 = two full turns a second) */
	maxSpeed: 720,
	/** How hard holding (or shushing) slows it; higher stops sooner */
	friction: 2.2,
	/** How springy the final snap onto a card is; higher snaps faster */
	snapStiffness: 110,
	/** Motion blur at full speed, in pixels (0 turns it off) */
	maxBlur: 6,
};
