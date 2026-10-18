# Kwun Chen · Portfolio

**Live at [kwunchen.com](https://kwunchen.com/)**

My data science portfolio, built as a Windows 7 desktop: a real sky photo for wallpaper, Aero glass windows from [7.css](https://khang-nd.github.io/7.css/), and three pages you move between with buttons instead of one long scroll.

The home page has `data_is_loud.exe`, a carousel of my projects and jobs that spins too fast to read. Hold the button, press and hold the ring, or say a long "shhh" into your mic, and it calms down onto one card.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. `npm run build` makes a production build, and `npm run lint` checks the code.

## Where things live

| What | Where |
| --- | --- |
| Projects, write-ups and their pictures | `src/content/projects.ts` |
| Jobs, open source and skills | `src/content/experience.ts` |
| Name, status, links and picture credits | `src/content/site.ts` |
| The carousel's cards, photos and spin settings | `src/content/carousel.ts` |
| The media player's songs (a snapshot of my Spotify playlist) | `src/content/playlist.ts` |
| Carousel spin physics | `src/lib/spinEngine.ts` |
| Mic "shhh" detection (runs in the browser; audio is never recorded or sent) | `src/lib/shushDetector.ts` |
| Windows 7 window wrapper | `src/components/Win7Window.tsx` |
| Page layout, nav and sidebars | `src/components/Shell.tsx`, `Sidebars.tsx`, `NavBar.tsx` |
| Favicon and link-preview image | `src/app/icon.png`, `apple-icon.png`, `opengraph-image.jpg` |

To add a project, add an entry to `src/content/projects.ts`. It shows up on the home page and the Projects page, and gets its own write-up page.

## Customizing the carousel

Everything about `data_is_loud.exe` is in `src/content/carousel.ts`:

- **Cards:** `carouselItems` is a plain list in ring order. Copy an entry to add a card, delete one to remove it. 5 to 10 cards looks best.
- **Photos:** put the file in `public/images/carousel/` and set `image.src`. Any size works because it's cropped to fit. Use `image.position` (for example `'center 30%'`) to choose which part shows. Leave `image` out for a plain colour band.
- **Credits:** if a photo isn't yours, fill in `credit` and it's listed in the footer automatically.
- **Feel:** `carouselSettings` sets the top speed, how quickly holding or shushing slows it, how snappy the landing is, and how much motion blur it has.

## The media player

The right sidebar has a Windows 7 Media Player–style window that shuffles my Spotify playlist "Study but lyrics". The songs are a snapshot in `src/content/playlist.ts`, one per line, so there are no API keys to manage. To add a song, copy its Spotify link (Share → Copy song link) and add a line with the id from the link, the title and the artist.

Playback goes through Spotify's official embed, which loads only after a visitor presses play. Visitors logged in to Spotify hear full songs; everyone else hears 30-second previews, and the player moves on to the next shuffled song when one ends.

## Deploying

The site is a standard Next.js app hosted on Vercel at [kwunchen.com](https://kwunchen.com/). Every push to `main` deploys it, and other branches get preview links. Link previews use the production domain automatically; set `NEXT_PUBLIC_SITE_URL` only to override it.

## Picture credits

All pictures come from Wikimedia Commons or Flickr under open licences, and are credited in the site footer.

- Wallpaper: "White Cumulus Clouds against Blue Sky (2)" by Lance Vanlewen, CC BY-SA 4.0
- "Sather Tower from Memorial Glade" by Coolcaesar, CC BY-SA 4.0
- "E-ticker" by klip game, public domain
- "20200311 F-15 Eagle formation-Kadena AB-15" by Balon Greyjoy, CC0
- "Autonomous Vehicle Competition 2010" by SparkFun Electronics, CC BY 2.0 (Flickr)
- "Air Combat Command HQ" by the U.S. Air Force, public domain
- "Brainstorming Customer Feedback (1)" by Steveonmz, CC BY-SA 4.0
- "Senior NCOs from Los Angeles Air Force Base instruct Loyola Marymount ROTC cadets" by Tech. Sgt. Sarah Corrice, U.S. Air Force, public domain
- "Building Blocks" by Holger Zscheyge, CC BY 2.0 (Flickr)

Windows 7 styling by [7.css](https://github.com/khang-nd/7.css) (MIT).
