import type { Metadata } from 'next';
import { Jost, Noto_Sans } from 'next/font/google';
import '7.css/dist/7.css';
import './globals.css';
import { Shell } from '@/components/Shell';
import { site } from '@/content/site';

// Geometric sans standing in for Aharoni (installed-only; its licence doesn't allow web hosting)
const jost = Jost({ variable: '--font-jost', subsets: ['latin'], weight: ['500', '600'] });
// Body fallback for systems without Segoe UI (Win7's UI font)
// Not preloaded: most visitors have Segoe UI (Windows) and never need it
const noto = Noto_Sans({ variable: '--font-noto', subsets: ['latin'], weight: ['400', '600', '700'], preload: false });

// Absolute URLs for link previews: set NEXT_PUBLIC_SITE_URL once there's a custom domain
const siteUrl =
	process.env.NEXT_PUBLIC_SITE_URL ??
	(process.env.VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
		: 'http://localhost:3000');

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: { default: site.title, template: `%s | ${site.name}` },
	description: site.description,
	openGraph: {
		type: 'website',
		siteName: site.name,
		title: site.title,
		description: site.description,
	},
	twitter: { card: 'summary_large_image', title: site.title, description: site.description },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
	return (
		<html lang="en" className={`${jost.variable} ${noto.variable}`}>
			<body>
				<Shell>{children}</Shell>
			</body>
		</html>
	);
}
