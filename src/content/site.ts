export const site = {
	name: 'Kwun Chen',
	title: 'Kwun Chen | Data Science',
	description:
		'Kwun Chen studies Data Science and Statistics at UC Berkeley and builds data pipelines, models and dashboards.',
	email: 'datasciduud@berkeley.edu',
	github: 'https://github.com/KwunNChen',
	linkedin: 'https://www.linkedin.com/in/kwunchen/',
	location: 'Berkeley, CA',
};

export const status = [
	{ label: 'Doing', value: 'Data engineering at Anyscale' },
	{ label: 'Studying', value: 'Data Science + Statistics, UC Berkeley ’29' },
	{ label: 'Building', value: 'Slack the Tape' },
	{ label: 'Open to', value: 'Data science internships' },
];

export type Credit = {
	file: string;
	title: string;
	creator: string;
	license: string;
	licenseUrl?: string;
	page: string;
};

export const credits: Credit[] = [
	{
		file: 'Wallpaper',
		title: 'White Cumulus Clouds against Blue Sky (2)',
		creator: 'Lance Vanlewen',
		license: 'CC BY-SA 4.0',
		licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
		page: 'https://commons.wikimedia.org/w/index.php?curid=127243049',
	},
	{
		file: 'Sather Tower',
		title: 'Sather Tower from Memorial Glade',
		creator: 'Coolcaesar',
		license: 'CC BY-SA 4.0',
		licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
		page: 'https://commons.wikimedia.org/wiki/File:Sather_Tower_from_Memorial_Glade.jpg',
	},
	{
		file: 'Ticker',
		title: 'E-ticker',
		creator: 'klip game',
		license: 'Public domain',
		page: 'https://commons.wikimedia.org/wiki/File:E-ticker.jpg',
	},
	{
		file: 'F-15s',
		title: '20200311 F-15 Eagle formation-Kadena AB-15',
		creator: 'Balon Greyjoy',
		license: 'CC0',
		licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
		page: 'https://commons.wikimedia.org/wiki/File:20200311_F-15_Eagle_formation-Kadena_AB-15.jpg',
	},
];
