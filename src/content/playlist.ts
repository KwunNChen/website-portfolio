/*
 * ─── The media player in the right sidebar ───────────────────────────────────
 *
 * A snapshot of my Spotify playlist "Study but lyrics". The player shuffles these and plays them through
 * Spotify's official embed, so visitors logged in to Spotify hear full songs and everyone else hears previews.
 *
 * To add a song:    in Spotify, Share → Copy song link. The id is the part after /track/ and before any "?".
 *                   Add a line with that id, the title and the artist. durationMs and art are optional
 *                   (the time shows once it plays; without art the player shows the playlist cover).
 * To remove a song: delete its line.
 */

export type Track = {
	/** Spotify track id, from the song link: open.spotify.com/track/<id> */
	id: string;
	title: string;
	artist: string;
	durationMs?: number;
	/** Cover image URL (Spotify's image CDN) */
	art?: string;
};

export const playlist = {
	name: 'Study but lyrics',
	url: 'https://open.spotify.com/playlist/41gZByRiYjhkZxe7x7j2tC',
};

// One song per line, so the list stays easy to edit
// prettier-ignore
export const tracks: Track[] = [
	{ id: "5xA5MggKc3aQxuOzNzPUWB", title: "Apple Cider", artist: "beabadoobee", durationMs: 178918, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02ceca3ef39ab8f9b59acff394" },
	{ id: "06iuzVAiyOTXKJDZiVuPW4", title: "did i tell u that i miss u", artist: "adore", durationMs: 115921, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02016737c3bbd798365ba3ce0a" },
	{ id: "62KZRwymXq9Rgm8Cm5UCfx", title: "The World We Knew (Over And Over)", artist: "Frank Sinatra", durationMs: 167053, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e023e2331ff09f59ea3c87fe5d6" },
	{ id: "7I1kle4TNmkfednJDKo8GR", title: "If You Want To", artist: "beabadoobee", durationMs: 223638, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02fe11583497b2a332995b88ed" },
	{ id: "5UXJzLFdBn6u9FJTCnoHrH", title: "Memories", artist: "Conan Gray", durationMs: 248818, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0260a89b781c62ffe2136e4396" },
	{ id: "4S4QJfBGGrC8jRIjJHf1Ka", title: "Pain", artist: "PinkPantheress", durationMs: 98544, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e020348d174bc1253a02bcb4ca2" },
	{ id: "2X485T9Z5Ly0xyaghN73ed", title: "Let It Happen", artist: "Tame Impala", durationMs: 467586, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e029e1cfc756886ac782e363d79" },
	{ id: "751srcHf5tUqcEa9pRCQwP", title: "Tek It", artist: "Cafuné", durationMs: 191823, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02ecaf001a812bb1ecc6cc482d" },
	{ id: "43iIQbw5hx986dUEZbr3eN", title: "From The Start", artist: "Laufey", durationMs: 169573, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0274c732f8aa0e0ccbb3d17d96" },
	{ id: "3NM41PVVUr0ceootKAtkAj", title: "As the World Caves In", artist: "Matt Maltese", durationMs: 218754, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e020180c5f180f4d69298a02543" },
	{ id: "2R4AlwtrrkMaRKojcTIzmL", title: "For the First Time", artist: "Mac DeMarco", durationMs: 182306, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e029f1b21f21b13ff2d3e891f6b" },
	{ id: "7EAMXbLcL0qXmciM5SwMh2", title: "Heart To Heart", artist: "Mac DeMarco", durationMs: 211140, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02fa1323bb50728c7489980672" },
	{ id: "7H7NyZ3G075GqPx2evsfeb", title: "Chamber Of Reflection", artist: "Mac DeMarco", durationMs: 231723, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02ec6e9c13eeed14eedbd5f7c9" },
	{ id: "0WQiDwKJclirSYG9v5tayI", title: "There Is a Light That Never Goes Out - 2011 Remaster", artist: "The Smiths", durationMs: 244586, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e026236778a208a15eb71079601" },
	{ id: "3siwsiaEoU4Kuuc9WKMUy5", title: "No One Noticed", artist: "The Marías", durationMs: 236906, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e028aa339341a0b0c813909c831" },
	{ id: "2Co0IjcLTSHMtodwD4gzfg", title: "I Bet on Losing Dogs", artist: "Mitski", durationMs: 170240, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0242cb382726e956058bf73ed3" },
	{ id: "6RiiSy9GzSwiyDEJDiMuKe", title: "Something About You", artist: "Eyedress, Dent May", durationMs: 153312, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0216f48ac1e989d7acc028e9cf" },
	{ id: "58ge6dfP91o9oXMzq3XkIS", title: "505", artist: "Arctic Monkeys", durationMs: 253586, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e020c8ac83035e9588e8ad34b90" },
	{ id: "41P6Tnd8KIHqON0QIydx6a", title: "the perfect pair", artist: "beabadoobee", durationMs: 177533, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02384d10f967c2b914de7e2713" },
	{ id: "7KA4W4McWYRpgf0fWsJZWB", title: "See You Again (feat. Kali Uchis)", artist: "Tyler, The Creator, Kali Uchis", durationMs: 180386, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e028940ac99f49e44f59e6f7fb3" },
	{ id: "3HlK8txWAdtKMrbsqX40pl", title: "Freaking Out the Neighborhood", artist: "Mac DeMarco", durationMs: 173888, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e029d377496c6bc8724b521222d" },
	{ id: "4KGGeE7RJsgLNZmnxGFlOj", title: "Falling Behind", artist: "Laufey", durationMs: 173640, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0248341e864d4b4881f56f01b4" },
	{ id: "5hM5arv9KDbCHS0k9uqwjr", title: "Borderline", artist: "Tame Impala", durationMs: 237800, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0258267bd34420a00d5cf83a49" },
	{ id: "2KhrPRV0V1FS2l4eQMJUWt", title: "Sweet", artist: "Cigarettes After Sex", durationMs: 291640, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02dfed999f959177dfc4f33cdc" },
	{ id: "39sDitIeCMrVX2QyXHY46t", title: "Blue Hair", artist: "TV Girl", durationMs: 217000, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e021556d166d0ed059b34a00e1b" },
	{ id: "63Pi2NAx5yCgeLhCTOrEou", title: "Headlock", artist: "Imogen Heap", durationMs: 215338, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0296623f4784c88259592fb8a1" },
	{ id: "6ZaiqbV2GfUtrUlhsu58fN", title: "Step On Me", artist: "The Cardigans", durationMs: 230185, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e020aac8ca880151fda470e91af" },
	{ id: "2P5yIMu2DNeMXTyOANKS6k", title: "Nobody", artist: "Mitski", durationMs: 193429, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02c428f67b4a9b7e1114dfc117" },
	{ id: "3mwvKOyMmG77zZRunnxp9E", title: "Buddy Holly", artist: "Weezer", durationMs: 159226, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02345536847e60f622ee0eae96" },
	{ id: "3GCdLUSnKSMJhs4Tj6CV3s", title: "All The Stars (with SZA) - From \"Black Panther: The Album\"", artist: "Kendrick Lamar, SZA", durationMs: 232186, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02c027ad28821777b00dcaa888" },
	{ id: "4tf04WrZTy60CawyvueIdK", title: "Talk", artist: "beabadoobee", durationMs: 158293, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02384d10f967c2b914de7e2713" },
	{ id: "6dBUzqjtbnIa1TwYbyw5CM", title: "Lovers Rock", artist: "TV Girl", durationMs: 213920, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02e1bc1af856b42dd7fdba9f84" },
	{ id: "6jgkEbmQ2F2onEqsEhiliL", title: "My Kind of Woman", artist: "Mac DeMarco", durationMs: 190845, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e029d377496c6bc8724b521222d" },
	{ id: "68SSN8C0cJmUEXJkGyNYqe", title: "You’re here that’s the thing", artist: "beabadoobee", durationMs: 198600, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02384d10f967c2b914de7e2713" },
	{ id: "6GDd1lZ0zp5pB6JleN5Xzx", title: "California", artist: "beabadoobee", durationMs: 172293, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e027d9a2e7835a178df7b0153aa" },
	{ id: "1GClDyMiSLrpzjzwIfWRIa", title: "Take A Bite", artist: "beabadoobee", durationMs: 158866, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e027d9a2e7835a178df7b0153aa" },
	{ id: "2aaCNg42RA74s0EmHTBqS7", title: "No Other Heart", artist: "Mac DeMarco", durationMs: 173117, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02b395acedffa5fa8e7696aea2" },
	{ id: "57RA3JGafJm5zRtKJiKPIm", title: "Are You Bored Yet? (feat. Clairo)", artist: "Wallows, Clairo", durationMs: 178000, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e021df393f4cf29c80c04456f77" },
	{ id: "180AbZduI6bYQIzwCHRwu9", title: "A Night To Remember", artist: "beabadoobee, Laufey", durationMs: 233388, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0203ea1900840b8804f779f7b3" },
	{ id: "2rrq3SGYxk90xLx5fMmPhZ", title: "I Must Apologise", artist: "PinkPantheress", durationMs: 108373, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e020348d174bc1253a02bcb4ca2" },
	{ id: "7nzsY8vlnKdvGOEE0rjAXZ", title: "Arabella", artist: "Arctic Monkeys", durationMs: 207356, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e024ae1c4c5c45aabe565499163" },
	{ id: "1PtQJZVZIdWIYdARpZRDFO", title: "Running Up That Hill (A Deal With God)", artist: "Kate Bush", durationMs: 298933, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02ad08f4b38efbff0c0da0f252" },
	{ id: "78ul3D77noQsYjSwvwiPU1", title: "Break It Off - Bonus", artist: "PinkPantheress", durationMs: 96133, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e020348d174bc1253a02bcb4ca2" },
	{ id: "05od2qm2MTSKCHxy1GBp5W", title: "12 to 12", artist: "sombr", durationMs: 242903, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e024229702de91cb3d3a4383302" },
	{ id: "3jjsRKEsF42ccXf8kWR3nu", title: "Washing Machine Heart", artist: "Mitski", durationMs: 128198, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02c428f67b4a9b7e1114dfc117" },
	{ id: "0bhwnn2xqnBUcMZDcXNuII", title: "Hey Lover", artist: "The Daughters Of Eve", durationMs: 144000, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02c148a2f0d30a396bc2cc359f" },
	{ id: "4NUhcsz9E1LrBe8nXLZqzp", title: "It Almost Worked", artist: "TV Girl", durationMs: 152000, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02870138983fee24fe052d12af" },
	{ id: "086myS9r57YsLbJpU0TgK9", title: "Why'd You Only Call Me When You're High?", artist: "Arctic Monkeys", durationMs: 161123, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e024ae1c4c5c45aabe565499163" },
	{ id: "3IznIgmXtrUaoPWpQTy5jB", title: "Not Allowed", artist: "TV Girl", durationMs: 167864, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0232f5fec7a879ed6ef28f0dfd" },
	{ id: "0j3mqDTK4Z6lvrLzFCUUz6", title: "Good Looking", artist: "Suki Waterhouse", durationMs: 214800, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0243bff43a592efe047d2ab9ff" },
	{ id: "1aXV8GrmQLvgoFtBPERP7E", title: "Jealous", artist: "Eyedress", durationMs: 122338, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e024de4da55422167fcc47fba65" },
	{ id: "1xaTREM89RbIxkcjlpf4Uw", title: "Heaven Knows I'm Miserable Now - 2011 Remaster", artist: "The Smiths", durationMs: 215760, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0204480d4422fe67d383386660" },
	{ id: "7r6PigmGzlB3YPB7wvBBbi", title: "No Church In The Wild", artist: "JAŸ-Z, Kanye West, Frank Ocean, THE-DREAM", durationMs: 272506, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0252e61456aa4995ba48d94e30" },
	{ id: "2FAZskT9yRjp2Oow9szJD8", title: "The Days - NOTION Remix", artist: "Chrystal, NOTION", durationMs: 233229, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e029041b9965925059507fb44af" },
	{ id: "3dPQuX8Gs42Y7b454ybpMR", title: "Seven Nation Army", artist: "The White Stripes", durationMs: 232106, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e027028981d09d2e5833c9c78ad" },
	{ id: "7aQjPecQdIuNd1sz3KCDhD", title: "Lovefool", artist: "The Cardigans", durationMs: 193953, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e020aac8ca880151fda470e91af" },
	{ id: "6QeYSvYqYUsfBzsApbjDHO", title: "Cigarettes out the Window", artist: "TV Girl", durationMs: 198960, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0232f5fec7a879ed6ef28f0dfd" },
	{ id: "2fhOljbX79loRcdl47SFye", title: "Moonlight on the River", artist: "Mac DeMarco", durationMs: 422613, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e029f1b21f21b13ff2d3e891f6b" },
	{ id: "0mO6oS60RST2sWmN2FKknP", title: "One More Hour", artist: "Tame Impala", durationMs: 432560, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0258267bd34420a00d5cf83a49" },
	{ id: "3iBgrkexCzVuPy4O9vx7Mf", title: "Glue Song", artist: "beabadoobee", durationMs: 135066, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02e3862aeefcb2f0860ef017e4" },
	{ id: "6K4t31amVTZDgR3sKmwUJJ", title: "The Less I Know The Better", artist: "Tame Impala", durationMs: 216320, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e029e1cfc756886ac782e363d79" },
	{ id: "0y60itmpH0aPKsFiGxmtnh", title: "Wait a Minute!", artist: "WILLOW", durationMs: 196520, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0253b17b025865ae89bcb68062" },
	{ id: "2LGdO5MtFdyphi2EihANZG", title: "Knee Socks", artist: "Arctic Monkeys", durationMs: 257563, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e024ae1c4c5c45aabe565499163" },
	{ id: "2AT8iROs4FQueDv2c8q2KE", title: "R U Mine?", artist: "Arctic Monkeys", durationMs: 201726, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e024ae1c4c5c45aabe565499163" },
	{ id: "3zEN0ii6s4DHHBpnTp3RP7", title: "We Are The People", artist: "Empire Of The Sun", durationMs: 267373, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02f3aa0e6ca22a382007f61e4d" },
	{ id: "5TRPicyLGbAF2LGBFbHGvO", title: "Flashing Lights", artist: "Kanye West, Dwele", durationMs: 237506, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0226f7f19c7f0381e56156c94a" },
	{ id: "4ExwU40qYoWqamnyid9rXH", title: "smezir_2 - Slowed", artist: "ilyhiryu", durationMs: 239860, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e023e0e5b15b6a6a0d054277043" },
	{ id: "6IPwKM3fUUzlElbvKw2sKl", title: "we fell in love in october", artist: "girl in red", durationMs: 184153, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02deade9f354749841f09feca2" },
	{ id: "4nwjvcUjV7cexhwA40Bh5i", title: "Lover Girl", artist: "Laufey", durationMs: 164400, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e028f68f6e65c1cfd36bb21561c" },
	{ id: "4WFgvKVfEhb3IUAFGrutTR", title: "Love Me Not", artist: "Ravyn Lenae", durationMs: 213466, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e020e62daaea2c7b94053e1c142" },
	{ id: "5rc7178sa2YRDlBFBHY0e8", title: "Stephanie", artist: "Nafeesisboujee", durationMs: 126969, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e023bda019c02edcbacd8b22417" },
	{ id: "1WN4uNclrDuczTO3bCr8s1", title: "Be My Baby", artist: "The Ronettes", durationMs: 160906, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02b298efc29df3b69ec3f0d675" },
	{ id: "0laYHRpNTS6i8FXdupHkJ4", title: "Love You Like A Love Song", artist: "Selena Gomez & The Scene", durationMs: 188453, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e021c8193de8d62b2ffa49a09db" },
	{ id: "3EaJDYHA0KnX88JvDhL9oa", title: "Dark Red", artist: "Steve Lacy", durationMs: 173104, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e023d2dfa42f771cd458b194979" },
	{ id: "0uMZbmAAgOhdMrv25iPEH6", title: "Goth", artist: "Sidewalks and Skeletons", durationMs: 207120, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02bbaf9de6c418a0aa6cb7b938" },
	{ id: "4iRg9tHDgmRPvv56IC46Pl", title: "Группа крови", artist: "Kino", durationMs: 284002, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02d3aae2a0a35a0b4c89b2deca" },
	{ id: "2fuYa3Lx06QQJAm0MjztKr", title: "Let Down", artist: "Radiohead", durationMs: 299560, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02c8b444df094279e70d0ed856" },
	{ id: "70LcF31zb1H0PyJoS1Sx1r", title: "Creep", artist: "Radiohead", durationMs: 238640, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02ec548c00d3ac2f10be73366d" },
	{ id: "5FVd6KXrgO9B3JPmC8OPst", title: "Do I Wanna Know?", artist: "Arctic Monkeys", durationMs: 272394, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e024ae1c4c5c45aabe565499163" },
	{ id: "5XeFesFbtLpXzIVDNQP22n", title: "I Wanna Be Yours", artist: "Arctic Monkeys", durationMs: 183956, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e024ae1c4c5c45aabe565499163" },
	{ id: "0NdTUS4UiNYCNn5FgVqKQY", title: "Snap Out Of It", artist: "Arctic Monkeys", durationMs: 193030, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e024ae1c4c5c45aabe565499163" },
	{ id: "52ojopYMUzeNcudsoz7O9D", title: "New Person, Same Old Mistakes", artist: "Tame Impala", durationMs: 363240, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e029e1cfc756886ac782e363d79" },
	{ id: "42qNWdLKCI41S4uzfamhFM", title: "Duvet", artist: "bôa", durationMs: 203600, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e026173e498401502583046f42c" },
	{ id: "5tuBenbZ1Or9xENTyOKoGC", title: "Jonny", artist: "Faye Webster", durationMs: 226506, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02ac4ebd092fa2cf210e4c8023" },
	{ id: "33KU9huHP1Lv1UWWVkuTYd", title: "Impostor Syndrome", artist: "Sidney Gish", durationMs: 294260, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02f7832bb86831bdec9848acda" },
	{ id: "0IjdXwCEhZR7JIwq6Za8j5", title: "Jane!", artist: "The Long Faces", durationMs: 186986, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e026685599bd4bafe725e532e2f" },
	{ id: "3gZMXAlGUgPne1r8u14ViY", title: "漫步人生路", artist: "Teresa Teng", durationMs: 220840, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e028b172d4932cbcad83548c728" },
	{ id: "2igwFfvr1OAGX9SKDCPBwO", title: "Empire State Of Mind", artist: "JAŸ-Z, Alicia Keys", durationMs: 276920, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02fec1b815bb3c50a64a90fd10" },
	{ id: "2009X8GyWTqyxIdzAEYW6N", title: "The One That Got Away", artist: "Katy Perry", durationMs: 227333, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e021d955011a3ed477dc77865ad" },
	{ id: "4TCL0qqKyqsMZml0G3M9IM", title: "Telephone", artist: "Lady Gaga, Beyoncé", durationMs: 220640, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e025c9890c0456a3719eeecd8aa" },
	{ id: "4nBRJUeN5kdHXc51pbcn4o", title: "皇后大道東", artist: "羅大佑, 蔣志光", durationMs: 254640, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0248b392c088db35d6552fa366" },
	{ id: "7jFNX9aTdcQfhIgUVE02hi", title: "月半小夜曲", artist: "Hacken Lee", durationMs: 290973, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e020672b25f9419bded55fa3130" },
	{ id: "5l94Up12BJSjhH7Mhr2ji4", title: "紅豆", artist: "Faye Wong", durationMs: 256026, art: "https://i.scdn.co/image/a5ae73818e20b276de07d4f7e6b71092ae762003" },
	{ id: "2kOF946ACR2MPDsuhTtsuA", title: "償還 - \"紅豆\"廣東版", artist: "Faye Wong", durationMs: 257640, art: "https://i.scdn.co/image/a5ae73818e20b276de07d4f7e6b71092ae762003" },
	{ id: "0eAuGrXyGFYwur9ARUe7LJ", title: "Earrings", artist: "Malcolm Todd", durationMs: 151500, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e022c1f34ecc1929fb59908aad1" },
	{ id: "5v3Dv4UlDOGaXlvphFpkIX", title: "Hello Juliet", artist: "Clarion", durationMs: 208000, art: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e027c0a7f8d483d355d834e5cb1" },
	{ id: "0u6SJZRhC1KSguPxLACkt9", title: "Спокойная ночь", artist: "Kino", durationMs: 382803, art: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02fc64e59813286b87ec9276b8" },
];
