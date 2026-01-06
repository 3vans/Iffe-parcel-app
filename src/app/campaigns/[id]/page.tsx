
import { notFound } from 'next/navigation';
import CampaignDetailClientPage from './client-page';
import placeholderImages from '@/app/lib/placeholder-images.json';

interface Campaign {
  id: string;
  title: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  dataAiHint?: string;
  description: string;
  storyline: string[];
  budget: number;
  goal: number;
  currentAmount: number;
  organizer: string;
  tags: string[];
  startDate: string;
  endDate: string;
  volunteersNeeded: number;
  volunteersSignedUp: number;
  activities: { title: string; description: string; image: keyof typeof placeholderImages }[];
  accommodation: { title: string; description: string; image: keyof typeof placeholderImages }[];
  meals: { title: string; description: string; image: keyof typeof placeholderImages }[];
  shortDescription?: string;
  bookingTips?: string[];
}

export interface RelatedTour {
  id: string;
  title: string;
  imageUrl: string;
  dataAiHint?: string;
}

const mockCampaignsData: Campaign[] = [
    // Existing detailed campaigns
    {
        id: '1',
        title: 'Bwindi Gorilla Trekking',
        shortDescription: 'World-famous gorilla trekking in a UNESCO World Heritage site.',
        imageUrl: placeholderImages.campaignBwindi.src,
        imageWidth: placeholderImages.campaignBwindi.width,
        imageHeight: placeholderImages.campaignBwindi.height,
        dataAiHint: placeholderImages.campaignBwindi.hint,
        description: 'The Bwindi Gorilla Trekking Tour offers an exceptional opportunity to encounter endangered mountain gorillas in their natural rainforest habitat. Set within the world-renowned Bwindi Impenetrable National Park, this carefully curated 3-day experience combines expert guidance, comfortable eco-lodging, and responsible tourism practices to deliver one of Africa’s most meaningful wildlife encounters. This is not simply a trek—it is an immersive conservation experience that allows you to witness one of the planet’s rarest species while directly supporting their protection and the communities that coexist with them.',
        storyline: [
            "Gorilla trekking in Bwindi is one of the world's most powerful wildlife experiences. With strictly limited daily permits, each trek is exclusive, intimate, and carefully managed to protect the gorillas and their fragile rainforest habitat.",
            "Guided by expert local trackers and park rangers, you’ll journey deep into the forest with the assurance of guaranteed permits and ethical, low-impact tourism. Every step supports conservation efforts and the communities dedicated to protecting these endangered primates.",
            "From thoughtfully selected lodges near the park to the unforgettable moment spent face-to-face with a gorilla family, this experience offers a rare connection with nature—one that leaves a lasting impression long after your journey ends.",
        ],
        budget: 20000, goal: 100, currentAmount: 98, organizer: 'iffe-travels', tags: ['#Gorilla', '#UNESCO', '#Uganda'], startDate: '2024-09-01', endDate: '2024-09-04', volunteersNeeded: 8, volunteersSignedUp: 6,
        activities: [
            { title: 'Gorilla Trekking (Permit Included)', description: 'A fully guided trek with official permits, ensuring a safe, ethical, and regulated encounter.', image: 'fifaCardGorilla' },
            { title: 'Community Walk', description: 'A guided visit to nearby communities to learn how conservation tourism supports local livelihoods, culture, and education.', image: 'ideaFamilySafari' },
            { title: 'Bird Watching Experience', description: 'Bwindi is home to over 350 bird species, making it a rewarding destination for bird enthusiasts and nature lovers alike.', image: 'blogShoebill' }
        ],
        accommodation: [
            { title: 'Eco-Lodges', description: 'These are ideal if you want comfort near the park with budget cost:', image: 'pkgAdventurer' },
            { title: 'Mid-Range Comfort', description: 'Perfect if you want comfort, great views, and good service without luxury pricing:', image: 'pkgUltimate' },
            { title: 'Luxury & Premium Safari Lodges', description: 'All lodges are selected for their commitment to sustainability and guest comfort.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Full Board', description: 'Full board included: breakfast, packed lunch for the trek, and dinner.', image: 'videoThumbTestimonial' },
            { title: 'Local Ingredients', description: 'Meals are prepared with locally sourced ingredients, offering a taste of Uganda.', image: 'sipiCoffee' },
            { title: 'Dietary Needs', description: 'Special dietary requirements can be accommodated upon request.', image: 'ideaFamilySafari' }
        ],
    },
    {
        id: '2',
        title: 'Queen Elizabeth National Park',
        shortDescription: 'Spot tree-climbing lions and enjoy Kazinga Channel boat safaris.',
        imageUrl: placeholderImages.campaignQueenElizabeth.src,
        imageWidth: placeholderImages.campaignQueenElizabeth.width,
        imageHeight: placeholderImages.campaignQueenElizabeth.height,
        dataAiHint: placeholderImages.campaignQueenElizabeth.hint,
        description: 'Discover the remarkable diversity of Queen Elizabeth National Park, Uganda’s most visited and most varied safari destination. Stretching from open savannah plains to dense wetlands and volcanic crater lakes, this park offers a classic African safari experience enriched by breathtaking scenery and abundant wildlife.  Renowned for its tree-climbing lions in the Ishasha sector and the iconic Kazinga Channel boat safari, this tour delivers exceptional wildlife viewing both on land and water. From elephants and buffalo to hippos, crocodiles, and over 600 bird species, every moment in Queen Elizabeth National Park is a new encounter with nature.',
        storyline: [
            'From sweeping savannahs to lush papyrus swamps, each game drive and boat cruise reveals a different side of the park’s extraordinary ecosystems.',
            'This is African safari at its finest—expertly guided game drives offer excellent chances to spot lions, leopards, elephants, buffalo, antelope, and more in their natural habitat.',
            'With dramatic landscapes, volcanic crater lakes, and stunning viewpoints, the park is a photographer\'s paradise.'
        ],
        budget: 15000, goal: 100, currentAmount: 92, organizer: 'iffe-travels', tags: ['#Wildlife', '#Lions', '#Uganda'], startDate: '2024-07-15', endDate: '2024-07-22', volunteersNeeded: 12, volunteersSignedUp: 8,
        activities: [
            { title: 'Game Drives (Ishasha & Kasenyi)', description: 'Search for tree-climbing lions, large herds of elephants and buffalo, Uganda kob, warthogs, and other plains game across open savannahs.', image: 'galleryLioness' },
            { title: 'Kazinga Channel Boat Cruise', description: 'One of Africa’s best boat safaris. Cruise along the channel and get remarkably close to hippos, Nile crocodiles, elephants, and countless water birds.', image: 'galleryElephant' },
            { title: 'Crater Lake Drive', description: 'Explore the park’s stunning volcanic crater lakes, offering panoramic views and insight into the region’s geological history.', image: 'campaignFortPortal' }
        ],
        accommodation: [
            { title: 'Safari Lodges & Camps', description: 'Choose from a selection of carefully chosen safari lodges and camps overlooking the savannah or the Kazinga Channel.', image: 'pkgAdventurer' },
            { title: 'Unique Views', description: 'Each accommodation offers a unique setting—sunsets over open plains, wildlife sightings from your veranda, or serene water views.', image: 'pkgUltimate' },
            { title: 'Sounds of the Wild', description: 'Fall asleep to the natural sounds of the African wilderness while enjoying comfort, safety, and warm hospitality.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'All-Inclusive Options', description: 'Most accommodations offer full-board or all-inclusive meal plans for a seamless safari experience.', image: 'videoThumbTestimonial' },
            { title: 'Dining with a View', description: 'Enjoy freshly prepared meals while overlooking the park, channel, or savannah.', image: 'sipiCoffee' },
            { title: 'Bush Dining Experiences', description: 'Special bush breakfasts or dinners can be arranged for a memorable and intimate safari moment.', image: 'ideaFamilySafari' }
        ],
    },
    {
        id: '3',
        title: 'Murchison Falls Safari – Uganda',
        shortDescription: 'See the powerful falls and diverse wildlife of Murchison.',
        imageUrl: placeholderImages.campaignMurchison.src,
        imageWidth: placeholderImages.campaignMurchison.width,
        imageHeight: placeholderImages.campaignMurchison.height,
        dataAiHint: placeholderImages.campaignMurchison.hint,
        description: "The Murchison Falls Safari takes you into the heart of Uganda’s largest and most dramatic national park, where powerful natural forces and rich wildlife coexist along the course of the legendary Nile River. This safari experience is defined by contrast—wide open savannahs, dense riverine forests, and the thunderous spectacle of the Nile squeezing through a narrow gorge before plunging into the Devil’s Cauldron below.\n\nThis tour is ideal for travelers seeking a classic African safari enriched by unforgettable scenery, abundant wildlife, and one of the most iconic waterfalls on the continent. It combines expertly guided game drives with a scenic boat safari, offering exceptional wildlife viewing both on land and water.",
        storyline: [
            "Stand in awe at the top of Murchison Falls, where the Nile River narrows to just a few meters before crashing through the gorge with immense force—a humbling display of nature’s raw power.",
            "Enjoy classic game drives across the northern plains, where rolling savannahs provide excellent visibility for spotting lions, giraffes, elephants, hartebeest, and large herds of buffalo.",
            "Cruise upstream along the Nile beneath towering riverbanks, encountering hippos, Nile crocodiles, elephants, and a remarkable variety of birdlife in a calm, immersive setting."
        ],
        budget: 8000, goal: 100, currentAmount: 88, organizer: 'iffe-travels', tags: ['#Wildlife', '#Waterfalls', '#Uganda'], startDate: '2024-10-05', endDate: '2024-10-10', volunteersNeeded: 10, volunteersSignedUp: 10,
        activities: [
            { title: 'Game Drives', description: 'Morning and afternoon game drives in the park’s prime wildlife areas, guided by experienced safari guides who understand animal behavior and tracking techniques.', image: 'galleryGiraffe' },
            { title: 'Nile Boat Safari', description: 'A highlight of the tour, the boat cruise takes you along the Nile to the base of the falls, offering unmatched wildlife viewing and photography opportunities.', image: 'fifaCardNile' },
            { title: 'Murchison Falls Hike (Optional)', description: 'A guided hike from the base to the top of the falls for travelers who wish to experience the landscape up close and capture panoramic views.', image: 'campaignMurchison' }
        ],
        accommodation: [
            { title: 'Safari Lodges & Tented Camps', description: 'Accommodation options range from comfortable safari lodges to well-appointed tented camps, all strategically located near wildlife areas or along the Nile.', image: 'pkgAdventurer' },
            { title: 'Unique Views', description: 'Many lodges offer river views, savannah outlooks, and frequent wildlife sightings directly from the property.', image: 'pkgUltimate' },
            { title: 'Sounds of the Wild', description: 'Evenings are accompanied by the natural sounds of the African bush, creating an authentic safari atmosphere without compromising comfort or safety.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Full-Board Dining', description: 'Most accommodations operate on a full-board basis, including breakfast, lunch, and dinner.', image: 'videoThumbTestimonial' },
            { title: 'Dining with a View', description: 'Enjoy freshly prepared meals served with views of the Nile River or open plains, enhancing the overall safari experience.', image: 'sipiCoffee' },
            { title: 'Bush Dining', description: 'Options for bush breakfasts and dinners can be arranged for a special experience.', image: 'ideaFamilySafari' }
        ],
        bookingTips: [
          "Book wildlife permits early, especially when combining this safari with gorilla or chimpanzee trekking.",
          "The best wildlife viewing seasons are June–August and December–February.",
          "Pack light layers for early mornings and evenings.",
          "Bring sunscreen, insect repellent, a hat, and comfortable walking shoes.",
          "Share your interests with us—we can tailor this safari to match your travel goals."
        ]
    },
    {
        id: '4', 
        title: 'Kibale Forest Chimpanzee Trekking – Uganda',
        shortDescription: 'Trek chimpanzees in the primate capital of East Africa.',
        imageUrl: placeholderImages.campaignKibale.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'chimpanzee forest',
        description: 'Immerse yourself in the lush tropical rainforest of Kibale Forest National Park, widely regarded as the primate capital of Africa. This exceptional tour offers a rare opportunity to trek through dense forest in search of wild chimpanzees, our closest relatives in the animal kingdom, and observe them in their natural habitat.\n\nKibale Forest is home to the highest concentration of primates in Africa, with over 13 primate species recorded. The highlight of this experience is a guided chimpanzee trek led by expert trackers and park rangers, providing an intimate and educational encounter that combines adventure, conservation, and deep connection with nature.\n\nThis tour is ideal for travelers seeking a meaningful wildlife experience rooted in research, sustainability, and authentic forest exploration.',
        storyline: [
            'Come face-to-face with wild chimpanzees as they move through the forest canopy—feeding, calling, grooming, and interacting in complex social groups. Observing their intelligence and behavior at close range is both thrilling and humbling.',
            'Kibale Forest is a living soundscape. As you trek beneath towering trees, the forest comes alive with the calls of primates, birds, and insects, creating a truly immersive rainforest atmosphere.',
            'Throughout the experience, guides share insights into ongoing conservation and research efforts aimed at protecting chimpanzees and preserving Kibale’s rich biodiversity for future generations.'
        ],
        budget: 12000, goal: 100, currentAmount: 85, organizer: 'iffe-travels', tags: ['#Chimpanzee', '#Primates', '#Uganda'], startDate: '2024-08-10', endDate: '2024-08-13', volunteersNeeded: 6, volunteersSignedUp: 4,
        activities: [
            { title: 'Chimpanzee Trekking', description: 'Led by expert guides and Uganda Wildlife Authority rangers, this guided trek takes you deep into the forest to locate and observe chimpanzees in the wild. Permits ensure ethical, controlled encounters.', image: 'campaignKibale' },
            { title: 'Bigodi Wetland Sanctuary Walk', description: 'A guided community-run walk through Bigodi Wetland, renowned for birdlife, monkeys, and cultural interaction. Proceeds directly support local conservation and development projects.', image: 'blogShoebill' },
            { title: 'Bird Watching', description: 'With over 370 recorded bird species, Kibale is one of Africa’s premier birding destinations, ideal for both casual bird lovers and serious birders.', image: 'blogShoebill' }
        ],
        accommodation: [
            { title: 'Carefully Selected Forest Lodges', description: 'Accommodation for this tour is arranged at well-established lodges and eco-retreats located near Kibale Forest National Park, ensuring easy access to trekking starting points while maintaining comfort and privacy. Lodges are chosen based on location, service quality, and responsible environmental practices.', image: 'pkgAdventurer' },
            { title: 'Comfort in a Natural Setting', description: 'Rooms are designed to offer a balance between comfort and immersion, with spacious interiors, private facilities, and views of surrounding forest or gardens. After a day of trekking, guests can relax in a quiet, natural setting without sacrificing essential amenities.', image: 'pkgUltimate' },
            { title: 'Sustainable & Responsible Stays', description: 'Where possible, we prioritize lodges that support sustainable operations, local employment, and community partnerships, aligning your stay with conservation goals and responsible tourism standards.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'All Meals Included', description: 'Tour packages typically include breakfast, lunch, and dinner for a seamless and relaxed stay.', image: 'videoThumbTestimonial' },
            { title: 'Local Food', description: 'Enjoy freshly prepared meals using locally sourced ingredients, supporting nearby farmers and communities.', image: 'sipiCoffee' },
            { title: 'Forest Dining', description: 'Dine in a tranquil forest setting that enhances the immersive nature experience.', image: 'ideaFamilySafari' }
        ],
        bookingTips: [
            "Book chimpanzee trekking permits early, especially during peak seasons.",
            "The best trekking periods are June–August and December–February.",
            "Pack light layers for cool mornings and humid forest conditions.",
            "Bring insect repellent, sunscreen, a hat, and comfortable walking shoes.",
            "Share your interests with us — we can tailor this tour to match your travel goals."
        ]
    },
    {
        id: '5',
        title: 'Hiking the Legendary “Mountains of the Moon”',
        shortDescription: 'Hike the snow-capped "Mountains of the Moon".',
        imageUrl: placeholderImages.campaignRwenzori.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'rwenzori mountains',
        description: 'The Rwenzori Mountains offer one of Africa’s most dramatic and rewarding hiking experiences. Rising along Uganda’s western border, this UNESCO World Heritage Site is defined by mist-covered peaks, alpine valleys, glacial rivers, and rare high-altitude vegetation found nowhere else on Earth.\n\nThis multi-day hiking adventure takes you deep into the heart of the Rwenzoris, following established trails through tropical rainforest, bamboo zones, heather moorlands, and Afro-alpine ecosystems. Whether you are aiming for scenic lower-altitude treks or challenging summit attempts, this experience is designed for travelers seeking adventure, achievement, and raw natural beauty.\n\nUnlike typical mountain hikes, the Rwenzoris offer a constantly changing landscape, making every day on the trail distinct and unforgettable.',
        storyline: [
            'Hike through ancient rainforests alive with birds, primates, and waterfalls as your journey begins at the mountain’s lower elevations.',
            'Ascend into dramatic alpine terrain where giant lobelias, deep valleys, and cloud-covered ridges define the landscape.',
            'Reach high-altitude zones shaped by glaciers and rugged peaks, rewarded with panoramic views and a powerful sense of accomplishment.'
        ],
        budget: 25000, goal: 100, currentAmount: 75, organizer: 'iffe-travels', tags: ['#Hiking', '#Mountains', '#Uganda'], startDate: '2025-01-10', endDate: '2025-01-20', volunteersNeeded: 8, volunteersSignedUp: 2,
        activities: [
            { title: 'Guided Mountain Hiking', description: 'Professionally guided hikes tailored to your fitness level, ranging from shorter scenic routes to demanding multi-day climbs.', image: 'campaignRwenzori' },
            { title: 'Summit Attempts (Optional)', description: 'For experienced hikers, extended itineraries can include summit goals such as Margherita Peak, weather and conditions permitting.', image: 'fifaCardKili' },
            { title: 'Nature & Landscape Photography', description: 'The Rwenzoris offer exceptional opportunities for photography, from misty valleys to alpine plant life and glacial terrain.', image: 'sipiHiking' }
        ],
        accommodation: [
            { title: 'Mountain Huts & Trail Lodges', description: 'Accommodation is arranged at official Rwenzori Mountain Services huts or carefully selected trail lodges, strategically located along hiking routes to support safe altitude progression.', image: 'pkgAdventurer' },
            { title: 'Functional Comfort for High-Altitude Hiking', description: 'Facilities are simple, clean, and purpose-built for mountain conditions, offering warm meals, sheltered sleeping arrangements, and essential rest after long hiking days.', image: 'pkgUltimate' },
            { title: 'Logistics-Focused & Safety-Oriented', description: 'Stays are selected based on proximity to trails, safety standards, and weather protection, ensuring a practical and well-supported mountain experience.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Full Board on the Mountain', description: 'All hiking packages include meals prepared by trained support teams, designed to provide energy and recovery during strenuous activity.', image: 'videoThumbTestimonial' },
            { title: 'Nutritious & Practical Menus', description: 'Meals focus on balanced nutrition, hydration support, and dietary needs, adapted for high-altitude conditions.', image: 'sipiCoffee' },
            { title: 'Hot Drinks', description: 'Hot drinks and snacks are provided throughout the day.', image: 'ideaFamilySafari' }
        ],
        bookingTips: [
            "The best hiking seasons are June–August and December–February, when trail conditions are most stable.",
            "Physical preparation is strongly recommended; this is a demanding hike.",
            "Proper hiking boots, waterproof gear, and layered clothing are essential.",
            "Porters and guides are mandatory and included for safety and environmental protection.",
            "Let us know your experience level — routes and durations can be tailored accordingly."
        ]
    },
    {
        id: '6',
        title: 'A Tranquil Escape on One of Africa’s Most Scenic Lakes',
        shortDescription: 'Relax by one of Africa’s deepest and most scenic lakes.',
        imageUrl: placeholderImages.campaignBunyonyi.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'lake bunyonyi',
        description: 'Lake Bunyonyi is one of Uganda’s most peaceful and visually captivating destinations, set among rolling terraced hills near the border of Bwindi Impenetrable Forest. With over 20 small islands scattered across its calm waters, the lake offers a rare combination of natural beauty, cultural depth, and safe, relaxed exploration.\n\nOften described as one of Africa’s most scenic lakes, Lake Bunyonyi is free from dangerous wildlife, making it ideal for swimming, canoeing, and extended lakeside stays. This tour is designed for travelers seeking rest, reflection, light adventure, and authentic local experiences, either as a standalone retreat or as a perfect complement to gorilla trekking.\n\nThe pace here is intentionally slow, allowing visitors to disconnect from routine and fully appreciate Uganda’s quieter, more intimate landscapes.',
        storyline: [
            'Drift across mirror-calm waters by canoe or boat, passing mist-covered hills and island silhouettes as the lake reveals its serene rhythm.',
            'Spend unhurried time at the lakeshore, enjoying panoramic views, warm afternoons, and dramatic sunsets that reflect across the water.',
            'Discover the cultural stories of the lake through guided island visits and village walks that reveal traditions shaped by generations of lakeside living.'
        ],
        budget: 5000, goal: 100, currentAmount: 95, organizer: 'iffe-travels', tags: ['#Relaxation', '#Scenery', '#Uganda'], startDate: '2024-09-05', endDate: '2024-09-08', volunteersNeeded: 15, volunteersSignedUp: 15,
        activities: [
            { title: 'Island Boat & Canoe Excursions', description: 'Explore Lake Bunyonyi’s islands by traditional canoe or guided boat tour. Visit culturally significant sites such as Punishment Island, or enjoy quiet, scenic islands ideal for photography and nature walks.', image: 'campaignBunyonyi' },
            { title: 'Canoeing & Kayaking', description: 'Paddle across the lake at your own pace, discovering hidden bays and enjoying uninterrupted views of the surrounding highlands. Early mornings and sunset sessions are especially rewarding.', image: 'fifaCardOkavango' },
            { title: 'Bird Watching', description: 'Home to more than 200 bird species, Lake Bunyonyi is a premier birding destination. Look out for African Fish Eagles, Malachite Kingfishers, Grey-Crowned Cranes, and many water-associated species.', image: 'blogShoebill' },
            { title: 'Cultural & Village Walks', description: 'Guided walks introduce you to local Bakiga communities, showcasing terraced farming practices, daily life, and cultural traditions deeply connected to the lake environment.', image: 'ideaFamilySafari' },
            { title: 'Zip-Lining Over the Lake', description: 'For travelers seeking light adventure, zip-lining offers a unique aerial perspective of the lake and surrounding hills, combining scenic views with an adrenaline rush.', image: 'campaignMabira' },
            { title: 'Swimming & Lakeside Leisure', description: 'Lake Bunyonyi is one of the few lakes in East Africa safe for swimming. Enjoy refreshing dips, floating relaxation, or quiet lakeside afternoons.', image: 'campaignBunyonyi' },
            { title: 'Scenic Hiking & Nature Walks', description: 'Walk along ridges and village paths that offer sweeping views of the lake, terraced hills, and islands below. Routes range from gentle strolls to more energetic hikes.', image: 'sipiHiking' },
            { title: 'Fishing & Sunset Experiences', description: 'Join local fishermen or enjoy peaceful fishing sessions from the shore. Sunset picnics by the lake can be arranged for a memorable evening experience.', image: 'videoThumbTestimonial' }
        ],
        accommodation: [
            { title: 'Lakeside Lodges & Island Retreats', description: 'Accommodation is arranged at carefully selected lakeside lodges and island retreats, chosen for their location, comfort standards, and views over the water.', image: 'pkgAdventurer' },
            { title: 'Comfort, Privacy & Scenic Design', description: 'Rooms range from comfortable to high-end, offering private balconies, spacious interiors, and peaceful surroundings designed for rest and uninterrupted lake views.', image: 'pkgUltimate' },
            { title: 'Sustainable & Community-Focused Stays', description: 'Many lodges emphasize sustainability, local sourcing, and community employment, ensuring your stay contributes positively to the region.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Fresh Crayfish', description: 'Freshly prepared meals, including local crayfish, a specialty of the lake.', image: 'videoThumbTestimonial' },
            { title: 'Dining with a View', description: 'Enjoy a meal with a view of the lake.', image: 'sipiCoffee' },
            { title: 'All Diets', description: 'Options for all dietary needs.', image: 'ideaFamilySafari' }
        ],
        bookingTips: [
            "Lake Bunyonyi is ideal after Bwindi gorilla trekking for recovery and relaxation.",
            "Longer stays (2–3 nights) allow you to fully experience the lake’s calm pace.",
            "Evenings can be cool — light layers are recommended.",
            "Swimming, canoeing, and walking are suitable for all fitness levels.",
            "Let us know if you prefer mainland lodges or island stays — each offers a different atmosphere."
        ]
    },
     {
        id: '7',
        title: 'Explore Uganda’s Savannah on Two Wheels',
        shortDescription: 'The closest park to Kampala, perfect for cycling among zebras.',
        imageUrl: placeholderImages.campaignMburo.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'zebra safari',
        description: 'Lake Mburo National Park offers one of the most unique safari experiences in East Africa — a guided cycling safari through open savannah landscapes, where wildlife moves freely and encounters happen at ground level.\n\nAs Uganda’s closest national park to Kampala, Lake Mburo is ideal for travelers seeking an active, immersive safari without long travel times. The park is home to zebras, impalas, buffalo, eland, warthogs, giraffes, and a rich variety of birdlife, all set within rolling hills, acacia woodland, and seasonal lakes.\n\nThis cycling safari allows you to experience wildlife without vehicles, creating a more intimate and environmentally friendly way to explore the park. It is suitable for travelers with moderate fitness levels and a sense of adventure.',
        storyline: [
            'Cycle along open park tracks as zebras and antelope graze nearby, offering close but respectful wildlife encounters.',
            'Enjoy the freedom of moving silently through the savannah, guided by experienced rangers who interpret animal behavior and landscapes.',
            'Pause at scenic viewpoints and waterholes to observe wildlife activity and capture expansive views of Lake Mburo’s rolling terrain.'
        ],
        budget: 6000, goal: 100, currentAmount: 82, organizer: 'iffe-travels', 
        tags: ['#CyclingSafari', '#WalkingSafari', '#Zebras', '#LakeMburo', '#Uganda'], 
        startDate: '2024-11-01', endDate: '2024-11-03', volunteersNeeded: 20, volunteersSignedUp: 18,
        activities: [
            { title: 'Guided Cycling Safari', description: 'Cycle through designated park routes accompanied by armed park rangers and professional guides, ensuring safety while allowing close wildlife observation.', image: 'campaignMburo' },
            { title: 'Walking Safari', description: 'Lake Mburo is one of the few Ugandan parks that permits walking safaris, offering a deeper understanding of tracks, plants, and animal behavior.', image: 'ideaWalkingSafari' },
            { title: 'Game Drives (Optional)', description: 'Morning or evening game drives can be added for broader wildlife coverage, especially for predators and nocturnal species.', image: 'galleryElephant' },
            { title: 'Boat Cruise on Lake Mburo', description: 'A relaxed boat trip offers sightings of hippos, crocodiles, waterbirds, and lakeside wildlife.', image: 'galleryElephant' },
            { title: 'Bird Watching', description: 'With over 300 bird species recorded, Lake Mburo is a rewarding destination for bird enthusiasts, particularly acacia-dwelling and wetland species.', image: 'blogShoebill' }
        ],
        accommodation: [
            { title: 'Safari Lodges & Tented Camps', description: 'Accommodation is arranged at carefully selected lodges and tented camps within or near the park, offering convenient access to cycling and safari activities.', image: 'pkgAdventurer' },
            { title: 'Comfort with a Wilderness Feel', description: 'Rooms are designed for comfort while maintaining a close connection to nature, with private facilities, shaded verandas, and savannah views.', image: 'pkgUltimate' },
            { title: 'Sustainability-Focused Stays', description: 'Many properties support conservation initiatives and local communities through eco-friendly operations and responsible tourism practices.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Full Board Options Available', description: 'Most safari packages include breakfast, lunch, and dinner, allowing guests to focus fully on activities and relaxation.', image: 'videoThumbTestimonial' },
            { title: 'Fresh & Safari-Style Dining', description: 'Meals feature a mix of local and international cuisine, served in lodge dining areas or outdoor settings overlooking the park.', image: 'sipiCoffee' },
            { title: 'Bush Dinners', description: 'Bush dinners can be arranged for a special experience.', image: 'ideaFamilySafari' }
        ],
        bookingTips: [
            "Cycling safaris are suitable for travelers with moderate fitness levels.",
            "Helmets, bicycles, and safety gear are provided.",
            "Early morning and late afternoon rides offer the best wildlife encounters.",
            "Combine cycling with a boat cruise or walking safari for a well-rounded experience.",
            "Lake Mburo is ideal as a short safari or stopover between Kampala and southwestern Uganda."
        ]
    },
    {
        id: '8',
        title: 'Jinja – Source of the Nile',
        shortDescription: 'Discover the legendary source of the world\'s longest river.',
        imageUrl: placeholderImages.campaignSourceNile.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'source of nile',
        description: 'Jinja holds a unique place in global geography and African history as the official source of the River Nile. Located on the northern shores of Lake Victoria, this riverside town marks the beginning of a journey that carries the Nile through eleven countries to the Mediterranean Sea.\n\nThis tour offers a guided exploration of the source itself, combined with scenic river experiences and cultural discovery. Jinja’s calm river stretches, historic landmarks, and vibrant local life make it a destination that balances meaning, scenery, and optional adventure.\n\nIdeal for travelers seeking insight rather than intensity, the experience can be enjoyed as a relaxed day tour or expanded into a multi-day stay with added activities.',
        storyline: [
            'Visit the exact point where the Nile emerges from Lake Victoria, guided by local experts who explain its historical and geographical significance.',
            'Enjoy scenic river views from boats and riverbanks, where birdlife, flowing water, and open skies define the landscape.',
            'Explore Jinja’s cultural character through its streets, markets, and landmarks shaped by colonial history and modern Ugandan life.'
        ],
        budget: 3000, goal: 100, currentAmount: 90, organizer: 'iffe-travels',
        tags: ['#SourceOfTheNile', '#ScenicBoatCruises', '#CulturalExploration', '#Jinja', '#Uganda'],
        startDate: '2024-12-01', endDate: '2024-12-02', volunteersNeeded: 30, volunteersSignedUp: 25,
        activities: [
            { title: 'Source of the Nile Boat Visit', description: 'A guided boat ride leads you to the official source marker, accompanied by storytelling on exploration history, local beliefs, and the Nile’s global importance.', image: 'campaignSourceNile' },
            { title: 'Nile River Cruises', description: 'Relaxing boat cruises allow you to enjoy calm stretches of the river, ideal for photography, bird watching, and reflection.', image: 'fifaCardNile' },
            { title: 'Cultural & Historical Walks', description: 'Guided walks through Jinja reveal colonial architecture, local markets, and community life along the river.', image: 'campaignBusoga' },
            { title: 'Optional Adventure Add-Ons', description: 'For those interested, Jinja offers world-class white-water rafting, kayaking, tubing, and cycling excursions that can be added seamlessly to this tour.', image: 'campaignRafting' }
        ],
        accommodation: [
            { title: 'Riverside Lodges & Quality Hotels', description: 'Accommodation is arranged at carefully selected riverside lodges and boutique hotels, chosen for comfort, location, and consistent service standards.', image: 'pkgAdventurer' },
            { title: 'Comfort & Accessibility', description: 'Rooms offer modern amenities, private facilities, and easy access to river activities and town attractions.', image: 'pkgUltimate' },
            { title: 'Community-Aware Hospitality', description: 'Many properties support local employment and sustainable practices, aligning with responsible tourism principles.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Riverside Dining Experiences', description: 'Enjoy meals in carefully selected restaurants and lodges set along the River Nile, where open-air dining and river views turn every meal into part of the experience. The relaxed setting allows you to unwind while taking in the sights and sounds of the water.', image: 'videoThumbTestimonial' },
            { title: 'Authentic Local Flavours', description: 'Sample Uganda’s culinary heritage through dishes such as fresh Nile fish, matoke, luwombo, and seasonal local produce. These meals reflect the region’s fishing traditions and agricultural roots, offering a genuine taste of eastern Uganda.', image: 'sipiCoffee' },
            { title: 'Flexible & Refined Options', description: 'From casual lunches after visiting the source to more refined evening dining, meal options range from traditional Ugandan cuisine to well-prepared international dishes, ensuring comfort, variety, and quality throughout your stay.', image: 'ideaFamilySafari' }
        ],
        bookingTips: [
            "This tour works well as a day trip or 1–2 night stay.",
            "Morning visits offer the best light and quieter river conditions.",
            "Combine with adventure activities for a more dynamic itinerary.",
            "Comfortable clothing and sun protection are recommended.",
            "Let us know your priorities — Jinja is highly flexible."
        ]
    },
    {
        id: '9', 
        title: 'White-Water Rafting in Jinja',
        shortDescription: 'Experience the thrill of Grade 5 rapids on the Nile.',
        imageUrl: placeholderImages.campaignRafting.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'white water rafting',
        description: 'White-water rafting in Jinja is one of Africa’s most celebrated adventure experiences and ranks among the best Grade 5 rafting trips in the world. Set on the powerful yet scenic stretches of the River Nile, this tour offers an adrenaline-filled journey through thundering rapids, calm interludes, and dramatic river landscapes.\n\nGuided by internationally certified rafting professionals, the experience balances high-intensity adventure with strict safety standards, making it suitable for both first-time rafters and seasoned thrill-seekers. Between rapids, the river slows, allowing moments to float, swim, and appreciate the beauty of the Nile’s riverbanks.\n\nThis tour can be enjoyed as a full-day adventure or combined with other Jinja experiences for a complete river-based itinerary.',
        storyline: [
            'Launch into powerful Grade 5 rapids that challenge your limits and deliver pure adrenaline on Africa’s most iconic river.',
            'Float through calm stretches between rapids, surrounded by lush riverbanks, birdlife, and wide open skies.',
            'Celebrate each successful rapid with your team, guided by expert rafters who prioritize safety, teamwork, and enjoyment.'
        ],
        budget: 4000, goal: 100, currentAmount: 95, organizer: 'iffe-travels',
        tags: ['#Grade5Rafting', '#RiverNile', '#ProfessionalGuides', '#Jinja', '#Uganda'],
        startDate: '2024-12-03', endDate: '2024-12-03', volunteersNeeded: 40, volunteersSignedUp: 40,
        activities: [
            { title: 'Grade 5 White-Water Rafting', description: 'Tackle some of the Nile’s most famous rapids, including powerful drops and technical sections that define world-class rafting.', image: 'campaignRafting' },
            { title: 'Milder Rafting Options', description: 'For those seeking less intensity, alternative routes with Grade 3–4 rapids are available, offering excitement with a more relaxed pace.', image: 'campaignRafting' },
            { title: 'River Floating & Swimming', description: 'Enjoy safe swimming and floating sections between rapids, providing moments of recovery and scenic appreciation.', image: 'campaignRafting' },
            { title: 'Optional Add-Ons', description: 'Combine rafting with kayaking, tubing, or a visit to the Source of the Nile for a full Jinja adventure experience.', image: 'fifaCardOkavango' }
        ],
        accommodation: [
            { title: 'Riverside Lodges & Adventure Camps', description: 'Accommodation is arranged at carefully selected lodges and camps near the Nile, offering easy access to rafting departure points.', image: 'pkgAdventurer' },
            { title: 'Comfort After the Rapids', description: 'Rooms provide clean, comfortable spaces to rest and recover after a physically demanding day, with options ranging from simple adventure lodges to more refined riverside stays.', image: 'pkgUltimate' },
            { title: 'Sustainable & Community-Driven Stays', description: 'Many properties support local employment and environmental conservation initiatives along the river.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Post-Raft Recovery Dining', description: 'Meals are arranged to support energy recovery after rafting, often served in relaxed riverside settings.', image: 'videoThumbTestimonial' },
            { title: 'Local & International Cuisine', description: 'Enjoy fresh Nile fish, Ugandan specialties, and international dishes, with vegetarian options available.', image: 'sipiCoffee' },
            { title: 'Scenic & Social Atmosphere', description: 'Dining often becomes part of the adventure — sharing stories with fellow rafters over meals overlooking the river.', image: 'ideaFamilySafari' }
        ],
        bookingTips: [
            "No prior rafting experience is required — professional instruction is provided.",
            "Participants should be comfortable in water and in good general health.",
            "Secure footwear and quick-dry clothing are recommended.",
            "Dry seasons (June–August, December–February) offer ideal river conditions.",
            "This tour pairs perfectly with Source of the Nile or Jinja town experiences."
        ]
    },
    {
        id: '10',
        title: 'Mount Elgon National Park',
        shortDescription: 'Hike a volcanic mountain and explore caves near Sipi Falls.',
        imageUrl: placeholderImages.campaignElgon.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'mount elgon',
        description: 'Mount Elgon National Park is home to one of the oldest volcanic mountains in East Africa, offering a distinctive hiking experience defined by vast calderas, dramatic cliffs, waterfalls, and extensive cave systems. Located on Uganda’s eastern border, the park provides a quieter, less crowded alternative to other mountain destinations.\n\nThis tour combines guided hiking on Mount Elgon’s lower and mid-altitude trails with exploration of nearby volcanic caves and landscapes around Sipi Falls. The terrain is varied but accessible, making it suitable for travelers seeking adventure without extreme altitude demands.\n\nMount Elgon’s ecological diversity, geological significance, and cultural connections make it a rewarding destination for hikers, nature lovers, and photographers alike.',
        storyline: [
            'Hike through montane forest and open ridgelines shaped by ancient volcanic activity, with sweeping views across eastern Uganda.',
            'Explore vast volcanic caves carved by lava flows and human use over centuries, guided by local experts who share their history.',
            'Discover the dramatic scenery of Sipi Falls, where water cascades down sheer cliffs framed by green highland landscapes.'
        ],
        budget: 9000, goal: 100, currentAmount: 78, organizer: 'iffe-travels',
        tags: ['#MountElgon', '#VolcanicCaves', '#SipiFalls', '#ScenicHiking', '#EasternUganda'],
        startDate: '2025-02-01', endDate: '2025-02-05', volunteersNeeded: 12, volunteersSignedUp: 7,
        activities: [
            { title: 'Guided Mountain Hiking', description: 'Follow well-established trails through forest, moorland, and volcanic terrain, suitable for both day hikes and extended treks.', image: 'campaignElgon' },
            { title: 'Volcanic Cave Exploration', description: 'Visit impressive cave systems such as Kapkwai and Chepnyali, shaped by lava flows and used historically by local communities.', image: 'campaignFortPortal' },
            { title: 'Sipi Falls Exploration', description: 'Enjoy guided walks around Sipi Falls, including viewpoints, photography stops, and optional village interactions.', image: 'campaignSipi' },
            { title: 'Bird Watching', description: 'Mount Elgon hosts a rich variety of birdlife, including endemic and highland species, making it a rewarding destination for bird enthusiasts.', image: 'blogShoebill' }
        ],
        accommodation: [
            { title: 'Highland Lodges & Nature Camps', description: 'Accommodation is arranged at carefully selected lodges and camps near Mount Elgon and Sipi Falls, offering convenient access to hiking trails.', image: 'pkgAdventurer' },
            { title: 'Comfort with Scenic Surroundings', description: 'Rooms provide comfortable facilities, peaceful settings, and views of the surrounding highlands or forested slopes.', image: 'pkgUltimate' },
            { title: 'Sustainability-Oriented Stays', description: 'Many properties support local employment, environmental conservation, and community development initiatives.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Fresh & Locally Inspired Dining', description: 'Meals are prepared using fresh local produce from the fertile slopes of Mount Elgon, reflecting the region’s agricultural richness.', image: 'videoThumbTestimonial' },
            { title: 'Flexible Meal Arrangements', description: 'Depending on your lodge, meals may be served on-site or arranged at nearby restaurants.', image: 'sipiCoffee' },
            { title: 'Scenic Dining Settings', description: 'Enjoy meals with views of waterfalls, hills, or gardens, enhancing the overall experience.', image: 'ideaFamilySafari' }
        ],
        bookingTips: [
            "Mount Elgon is suitable for travelers seeking moderate hiking without extreme altitude.",
            "Comfortable hiking shoes and rain protection are recommended.",
            "The area can be visited year-round, though drier months offer easier trail conditions.",
            "Combine this tour with Sipi Falls for a fuller experience.",
            "Let us know your fitness level — routes can be adjusted accordingly."
        ]
    },
    {
        id: '11', 
        title: 'Sipi Falls Adventure',
        shortDescription: 'Waterfalls, Coffee Trails & Scenic Highland Hikes',
        imageUrl: placeholderImages.campaignSipi.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'sipi falls',
        description: 'Sipi Falls is one of eastern Uganda’s most scenic destinations, famous for its series of three dramatic waterfalls cascading down the foothills of Mount Elgon. Set within rolling hills, fertile farmlands, and wide-open views across the Karamoja plains, Sipi offers a perfect blend of nature, culture, and gentle adventure.\n\nThis tour combines guided waterfall hikes, Arabica coffee experiences, and highland nature walks, making it ideal for travelers who enjoy scenic landscapes, cultural interaction, and active exploration without extreme physical demands.\n\nSipi Falls is best experienced at a relaxed pace, allowing time to appreciate its natural beauty, local traditions, and peaceful mountain atmosphere.',
        storyline: [
            'Walk along scenic trails that lead to Sipi’s three waterfalls, each offering a different perspective and dramatic views of plunging water and cliffs.',
            'Join a guided coffee tour through local farms to learn how Arabica coffee is grown, harvested, processed, and brewed in the highlands.',
            'Hike across open hills and ridgelines with panoramic views stretching toward Mount Elgon and the plains below.'
        ],
        budget: 4500, goal: 100, currentAmount: 88, organizer: 'iffe-travels', 
        tags: ['#SipiFalls', '#WaterfallHiking', '#ArabicaCoffee', '#ScenicHighlands', '#EasternUganda'], 
        startDate: '2024-11-20', endDate: '2024-11-22', volunteersNeeded: 15, volunteersSignedUp: 11,
        activities: [
            { title: 'Waterfall Hikes', description: 'Guided hikes connect all three Sipi Falls, ranging from gentle walks to more challenging routes, with time for photography and rest.', image: 'campaignSipi' },
            { title: 'Arabica Coffee Tour', description: 'Experience the full coffee journey — from farm to cup — guided by local farmers who share generations of knowledge and tradition.', image: 'sipiCoffee' },
            { title: 'Scenic Nature Walks', description: 'Explore the surrounding hills, villages, and farmlands on guided walks that highlight local life and landscape.', image: 'sipiHiking' },
            { title: 'Cultural Encounters', description: 'Interact with local communities, learn about traditional practices, and gain insight into daily life in the Sipi region.', image: 'ideaFamilySafari' }
        ],
        accommodation: [
            { title: 'Highland Lodges & Eco-Retreats', description: 'Accommodation is arranged at carefully selected lodges and eco-retreats near Sipi Falls, offering easy access to trails and viewpoints.', image: 'pkgAdventurer' },
            { title: 'Comfort with Exceptional Views', description: 'Rooms are designed for comfort and relaxation, often featuring terraces or outdoor seating with views of waterfalls, hills, or gardens.', image: 'pkgUltimate' },
            { title: 'Sustainable & Locally Operated', description: 'Many lodges emphasize sustainability, local employment, and low-impact operations aligned with responsible tourism values.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Fresh, Farm-Based Cuisine', description: 'Meals feature locally sourced produce from the fertile Mount Elgon region, prepared simply and thoughtfully.', image: 'videoThumbTestimonial' },
            { title: 'Coffee-Inspired Experiences', description: 'Enjoy freshly brewed local Arabica coffee as part of your stay, often served during or after guided coffee tours.', image: 'sipiCoffee' },
            { title: 'Scenic Dining Settings', description: 'Meals are commonly enjoyed with views of the surrounding hills or waterfalls, adding to the overall experience.', image: 'ideaFamilySafari' }
        ],
        bookingTips: [
            "Sipi Falls can be visited year-round, but drier months offer easier hiking conditions.",
            "Comfortable walking shoes are recommended for waterfall trails.",
            "Combine this tour with Mount Elgon National Park for a richer highland experience.",
            "Photography lovers should plan early morning or late afternoon walks.",
            "Let us know your pace preference — routes can be adjusted accordingly."
        ]
    },
    {
        id: '12', 
        title: 'Busoga Kingdom Cultural Tour',
        shortDescription: 'Immerse yourself in the royal heritage and traditions of Busoga.',
        imageUrl: placeholderImages.campaignBusoga.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'cultural kingdom',
        description: 'The Busoga Kingdom Cultural Tour offers a deep and authentic introduction to one of Uganda’s most historically rich and culturally vibrant regions. Centered around Jinja and surrounding Busoga communities, this experience explores the traditions, leadership systems, and daily life of the Basoga people.\n\nVisitors are introduced to royal heritage, clan traditions, music, dance, storytelling, and crafts, while learning how culture continues to shape modern Busoga society. This tour is ideal for travelers seeking meaningful cultural engagement beyond wildlife and landscapes.\n\nBusoga is not only a kingdom of history, but a living culture — proud, evolving, and welcoming.',
        storyline: [
            'Learn about the Busoga Kingdom’s royal structure, history, and traditions through guided cultural interpretation and community visits.',
            'Experience traditional music, dance, and storytelling that reflect the identity, values, and social life of the Basoga people.',
            'Engage with artisans and local communities to discover traditional crafts, food practices, and everyday life in Busoga.'
        ],
        budget: 2500, goal: 100, currentAmount: 65, organizer: 'iffe-travels', 
        tags: ['#BusogaKingdom', '#CulturalHeritage', '#TraditionalMusic', '#CommunityExperiences', '#EasternUganda'], 
        startDate: '2024-12-05', endDate: '2024-12-06', volunteersNeeded: 25, volunteersSignedUp: 10,
        activities: [
            { title: 'Royal & Cultural Heritage Visits', description: 'Explore cultural sites connected to Busoga leadership, clan systems, and historical narratives guided by knowledgeable locals.', image: 'campaignBusoga' },
            { title: 'Traditional Music & Dance', description: 'Witness or participate in cultural performances that express storytelling, celebration, and community identity.', image: 'ideaFamilySafari' },
            { title: 'Crafts & Artisan Encounters', description: 'Meet local craftsmen and women producing traditional items such as baskets, drums, and household crafts.', image: 'ideaFamilySafari' },
            { title: 'Community Interaction', description: 'Spend time in local communities to understand daily life, social structures, and cultural values.', image: 'campaignKampala'}
        ],
        accommodation: [
            { title: 'Comfortable Cultural Lodges & Hotels', description: 'Accommodation is arranged in well-selected lodges and hotels within Jinja and the Busoga region, offering comfort and easy access to cultural sites.', image: 'pkgAdventurer' },
            { title: 'Local Character & Warm Hospitality', description: 'Stays emphasize friendly service, regional character, and a relaxed atmosphere suitable for cultural exploration.', image: 'pkgUltimate' },
            { title: 'Optional Upgrades Available', description: 'Mid-range and higher-end options can be arranged for travelers seeking additional comfort.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Traditional Busoga Cuisine', description: 'Enjoy meals inspired by local Busoga dishes prepared with fresh regional ingredients.', image: 'videoThumbTestimonial' },
            { title: 'Cultural Dining Experiences', description: 'Some meals are accompanied by cultural explanations, offering insight into food traditions and customs.', image: 'sipiCoffee' },
            { title: 'Flexible Dining Options', description: 'Both local and international meal choices are available depending on accommodation and preferences.', image: 'ideaFamilySafari' }
        ],
        bookingTips: [
            "Cultural tours are best enjoyed with an open schedule to allow deeper engagement.",
            "Dress respectfully during cultural visits and ceremonies.",
            "Photography should be done with permission, especially during performances.",
            "Combine this tour with Jinja or Source of the Nile for a balanced cultural and adventure itinerary.",
            "Let us know if you’re interested in educational or group-focused experiences."
        ]
    },
    {
        id: '13', title: 'Kidepo Valley National Park',
        shortDescription: 'Explore remote, rugged landscapes with unique wildlife.',
        imageUrl: placeholderImages.campaignKidepo.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'kidepo valley',
        description: 'Venture to the remote and wild Kidepo Valley National Park in the far north of Uganda. This park offers a true wilderness experience, with wildlife you won\'t see anywhere else in the country, like cheetahs and ostriches.',
        storyline: [
            'A journey to one of Africa\'s last great wildernesses.',
            'The park is remote and untouched, offering a unique safari experience.',
            'See wildlife that you won\'t find anywhere else in Uganda.'
        ],
        budget: 18000, goal: 100, currentAmount: 70, organizer: 'iffe-travels', tags: ['#Remote', '#Wilderness', '#Uganda'], startDate: '2025-03-10', endDate: '2025-03-15', volunteersNeeded: 8, volunteersSignedUp: 3,
        activities: [
            { title: 'Game drives', description: 'See the park\'s unique wildlife on game drives.', image: 'campaignKidepo' },
            { title: 'Cultural visits to Karamojong communities', description: 'Learn about the local culture.', image: 'ideaFamilySafari' },
            { title: 'Hiking in the rugged landscapes', description: 'Explore the park on foot.', image: 'ideaWalkingSafari' }
        ],
        accommodation: [
            { title: 'Luxury Lodges', description: 'Luxury lodges and basic campsites within the park.', image: 'pkgAdventurer' },
            { title: 'Wilderness Peace', description: 'Enjoy the peace and quiet of the wilderness.', image: 'pkgUltimate' },
            { title: 'All Budgets', description: 'Options available for all budgets.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'All-Inclusive', description: 'All-inclusive packages available.', image: 'videoThumbTestimonial' },
            { title: 'Scenic Dining', description: 'Enjoy meals with a view of the park\'s stunning landscapes.', image: 'sipiCoffee' },
            { title: 'Bush Dinners', description: 'Bush dinners can be arranged for a special experience.', image: 'ideaFamilySafari' }
        ]
    },
    {
        id: '14', title: 'Karuma Falls Wildlife Tour',
        shortDescription: 'Spot wildlife near the stunning Karuma Falls on the Nile.',
        imageUrl: placeholderImages.campaignKaruma.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'karuma falls',
        description: 'Visit the impressive Karuma Falls, a cascade of roaring rapids on the Victoria Nile. The area is part of Murchison Falls National Park and is a great place to spot wildlife.',
        storyline: [
            'Witness the Nile\'s power and the wildlife it attracts.',
            'A great addition to a Murchison Falls safari.',
            'See a different side of the Nile.'
        ],
        budget: 5500, goal: 100, currentAmount: 85, organizer: 'iffe-travels', tags: ['#Wildlife', '#NationalPark', '#Uganda'], startDate: '2024-10-15', endDate: '2024-10-17', volunteersNeeded: 15, volunteersSignedUp: 10,
        activities: [
            { title: 'Wildlife viewing near the falls', description: 'See the wildlife attracted by the falls.', image: 'campaignKaruma' },
            { title: 'Visiting the falls', description: 'Witness the power of the falls.', image: 'campaignMurchison' },
            { title: 'Bird watching in the surrounding area', description: 'Discover the diverse birdlife.', image: 'blogShoebill' }
        ],
        accommodation: [
            { title: 'Nearby Lodges', description: 'Lodges near the falls.', image: 'pkgAdventurer' },
            { title: 'Scenic Location', description: 'Enjoy a comfortable stay in a scenic location.', image: 'pkgUltimate' },
            { title: 'All Budgets', description: 'Options available for all budgets.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Lodge Dining', description: 'Provided by the lodges.', image: 'videoThumbTestimonial' },
            { title: 'River Views', description: 'Enjoy a meal with a view of the river.', image: 'sipiCoffee' },
            { title: 'Varied Options', description: 'A variety of dining options available.', image: 'ideaFamilySafari' }
        ]
    },
    {
        id: '15', title: 'Pian Upe Wildlife Reserve',
        shortDescription: 'Discover rare wildlife species in a semi-arid savannah.',
        imageUrl: placeholderImages.campaignPianUpe.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'savannah reserve',
        description: 'Explore one of Uganda\'s lesser-known gems, the Pian Upe Wildlife Reserve. This vast savannah is home to rare species like the roan antelope and offers a secluded safari experience.',
        storyline: [
            'An off-the-beaten-path adventure for the intrepid traveler.',
            'See rare wildlife that you won\'t find in other parks.',
            'A true wilderness experience.'
        ],
        budget: 13000, goal: 100, currentAmount: 60, organizer: 'iffe-travels', tags: ['#RareWildlife', '#Savannah', '#Uganda'], startDate: '2025-04-01', endDate: '2025-04-05', volunteersNeeded: 10, volunteersSignedUp: 2,
        activities: [
            { title: 'Game drives', description: 'Spot rare wildlife on game drives.', image: 'campaignPianUpe' },
            { title: 'Nature walks', description: 'Explore the savannah on foot.', image: 'ideaWalkingSafari' },
            { title: 'Cultural encounters', description: 'Meet the local Karamojong people.', image: 'ideaFamilySafari' }
        ],
        accommodation: [
            { title: 'Camping', description: 'Basic camping facilities and nearby guesthouses.', image: 'pkgAdventurer' },
            { title: 'Back to Nature', description: 'A true back-to-nature experience.', image: 'pkgUltimate' },
            { title: 'Adventurous Options', description: 'Options for the adventurous traveler.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Camping Meals', description: 'Basic meals provided on camping trips.', image: 'videoThumbTestimonial' },
            { title: 'Campfire Cooking', description: 'Enjoy a simple meal cooked over an open fire.', image: 'sipiCoffee' },
            { title: 'Local Cuisine', description: 'A chance to try local cuisine.', image: 'ideaFamilySafari' }
        ]
    },
    {
        id: '16', title: 'Kampala City Tour',
        shortDescription: 'Explore museums, mosques, and cultural centres in Uganda\'s capital.',
        imageUrl: placeholderImages.campaignKampala.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'kampala city',
        description: 'Discover the vibrant capital city of Kampala. Visit historic sites like the Kasubi Tombs, the Gaddafi National Mosque, and the Uganda Museum. Experience the bustling markets and the lively culture of the city.',
        storyline: [
            'A day in the heart of Uganda.',
            'Experience the energy and vibrancy of Kampala.',
            'Learn about the history and culture of the city.'
        ],
        budget: 2000, goal: 100, currentAmount: 91, organizer: 'iffe-travels', tags: ['#CityTour', '#Culture', '#Uganda', '#Day-Trip', '#Jinja', '#Entebbe'], startDate: '2024-11-15', endDate: '2024-11-15', volunteersNeeded: 50, volunteersSignedUp: 45,
        activities: [
            { title: 'Visiting historical sites', description: 'See the Kasubi Tombs and other historic sites.', image: 'campaignBusoga' },
            { title: 'Shopping in craft markets', description: 'Find unique souvenirs.', image: 'ideaFamilySafari' },
            { title: 'Trying local street food', description: 'A taste of Ugandan street food.', image: 'videoThumbTestimonial' }
        ],
        accommodation: [
            { title: 'N/A', description: 'Day tour, no accommodation provided.', image: 'pkgAdventurer' },
            { title: 'Can be Arranged', description: 'Can be arranged upon request.', image: 'pkgUltimate' },
            { title: 'Contact Us', description: 'Contact us for more details.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Traditional Lunch', description: 'Includes a traditional Ugandan lunch.', image: 'videoThumbTestimonial' },
            { title: 'Local Dishes', description: 'Try local dishes like matoke and luwombo.', image: 'sipiCoffee' },
            { title: 'A Taste of Uganda', description: 'A taste of Ugandan cuisine.', image: 'ideaFamilySafari' }
        ]
    },
    {
        id: '17', title: 'Entebbe Botanical Gardens',
        shortDescription: 'Visit the Wildlife Centre and relax by Lake Victoria.',
        imageUrl: placeholderImages.campaignEntebbe.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'entebbe botanical',
        description: 'Enjoy a relaxing day in Entebbe. Explore the lush Botanical Gardens, visit the Uganda Wildlife Education Centre, and enjoy the shores of Lake Victoria.',
        storyline: [
            'A peaceful introduction to Uganda\'s nature and wildlife.',
            'A great way to spend a day before or after a flight.',
            'Relax and unwind in a beautiful setting.'
        ],
        budget: 1500, goal: 100, currentAmount: 89, organizer: 'iffe-travels', tags: ['#Gardens', '#Relaxation', '#Uganda', '#Day-Trip', '#Jinja', '#Kampala'], startDate: '2024-11-14', endDate: '2024-11-14', volunteersNeeded: 40, volunteersSignedUp: 30,
        activities: [
            { title: 'A tour of the Botanical Gardens', description: 'Explore the lush gardens.', image: 'campaignEntebbe' },
            { title: 'A visit to the Wildlife Centre', description: 'See a variety of Ugandan wildlife.', image: 'galleryElephant' },
            { title: 'Lunch by Lake Victoria', description: 'Enjoy a meal with a view.', image: 'videoThumbTestimonial' }
        ],
        accommodation: [
            { title: 'N/A', description: 'Day tour, no accommodation provided.', image: 'pkgAdventurer' },
            { title: 'Can be Arranged', description: 'Can be arranged upon request.', image: 'pkgUltimate' },
            { title: 'Contact Us', description: 'Contact us for more details.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Lakeside Lunch', description: 'Includes lunch at a lakeside restaurant.', image: 'videoThumbTestimonial' },
            { title: 'Fresh Fish', description: 'Enjoy fresh fish from Lake Victoria.', image: 'sipiCoffee' },
            { title: 'Relaxing Meal', description: 'A relaxing meal with a view.', image: 'ideaFamilySafari' }
        ]
    },
    {
        id: '18', title: 'Ngamba Island Chimpanzee Sanctuary',
        shortDescription: 'Visit a sanctuary for orphaned chimpanzees on Lake Victoria.',
        imageUrl: placeholderImages.campaignNgamba.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'chimpanzee sanctuary',
        description: 'Take a boat trip on Lake Victoria to Ngamba Island, a sanctuary for rescued and orphaned chimpanzees. Learn about their conservation and watch them during their feeding time.',
        storyline: [
            'A heartwarming and educational experience supporting chimp conservation.',
            'Get up close with our closest relatives.',
            'A great day trip from Entebbe or Kampala.'
        ],
        budget: 3500, goal: 100, currentAmount: 94, organizer: 'iffe-travels', tags: ['#Conservation', '#Chimpanzee', '#Uganda', '#Day-Trip', '#Kampala'], startDate: '2024-11-16', endDate: '2024-11-16', volunteersNeeded: 20, volunteersSignedUp: 19,
        activities: [
            { title: 'Boat trip on Lake Victoria', description: 'A scenic boat trip to Ngamba Island.', image: 'campaignSourceNile' },
            { title: 'Chimpanzee viewing', description: 'Watch the chimpanzees during their feeding time.', image: 'campaignNgamba' },
            { title: 'Educational talks on conservation', description: 'Learn about chimpanzee conservation efforts.', image: 'homeCreatorTom' }
        ],
        accommodation: [
            { title: 'N/A', description: 'Day trip, no accommodation provided.', image: 'pkgAdventurer' },
            { title: 'Can be Arranged', description: 'Can be arranged upon request.', image: 'pkgUltimate' },
            { title: 'Contact Us', description: 'Contact us for more details.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Island Lunch', description: 'Lunch is included in the trip.', image: 'videoThumbTestimonial' },
            { title: 'Dining Experience', description: 'Enjoy a meal on the island.', image: 'sipiCoffee' },
            { title: 'Unique Setting', description: 'A unique dining experience.', image: 'ideaFamilySafari' }
        ]
    },
    {
        id: '19', title: 'Mabira Forest Zip-Lining',
        shortDescription: 'Experience the thrill of zip-lining through a lush rainforest.',
        imageUrl: placeholderImages.campaignMabira.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'rainforest zip',
        description: 'Soar through the canopy of the ancient Mabira Forest on a thrilling zip-lining adventure. A great day trip from Kampala or Jinja for adventure seekers.',
        storyline: [
            'See the rainforest from a unique, bird\'s-eye perspective.',
            'An adrenaline-pumping adventure.',
            'A great way to experience the beauty of the forest.'
        ],
        budget: 2800, goal: 100, currentAmount: 86, organizer: 'iffe-travels', tags: ['#Adventure', '#Forest', '#Uganda', '#Day-Trip'], startDate: '2024-11-17', endDate: '2024-11-17', volunteersNeeded: 25, volunteersSignedUp: 20,
        activities: [
            { title: 'Zip-lining through the forest canopy', description: 'An exhilarating experience.', image: 'campaignMabira' },
            { title: 'Forest walks', description: 'Explore the flora and fauna up close.', image: 'ideaWalkingSafari' },
            { title: 'Bird watching', description: 'Discover the numerous bird species in the forest.', image: 'blogShoebill' }
        ],
        accommodation: [
            { title: 'N/A', description: 'Day trip, no accommodation provided.', image: 'pkgAdventurer' },
            { title: 'Can be Arranged', description: 'Can be arranged upon request.', image: 'pkgUltimate' },
            { title: 'Contact Us', description: 'Contact us for more details.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Forest Lunch', description: 'Lunch included in the package.', image: 'videoThumbTestimonial' },
            { title: 'Adventure Refuel', description: 'Enjoy a meal in a forest setting.', image: 'sipiCoffee' },
            { title: 'Refuel', description: 'A chance to refuel after your adventure.', image: 'ideaFamilySafari' }
        ]
    },
    {
        id: '20', title: 'Ssese Islands Relaxation',
        shortDescription: 'Unwind on the beautiful beaches of the Ssese Islands.',
        imageUrl: placeholderImages.campaignSsese.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'lake victoria island',
        description: 'Escape to the tranquil Ssese Islands in Lake Victoria. This archipelago of 84 islands is perfect for relaxing on sandy beaches, taking nature walks, and enjoying stunning sunsets.',
        storyline: [
            'A tropical paradise in the heart of Africa.',
            'Relax and unwind on the sandy beaches.',
            'A perfect end to a Ugandan safari.'
        ],
        budget: 6500, goal: 100, currentAmount: 93, organizer: 'iffe-travels', tags: ['#Beach', '#Relaxation', '#Uganda'], startDate: '2024-12-10', endDate: '2024-12-13', volunteersNeeded: 15, volunteersSignedUp: 14,
        activities: [
            { title: 'Beach relaxation and swimming', description: 'Enjoy the sandy beaches.', image: 'campaignSsese' },
            { title: 'Canoeing and kayaking', description: 'Explore the lake at your own pace.', image: 'fifaCardOkavango' },
            { title: 'Fishing for tilapia and Nile perch', description: 'Try your hand at fishing.', image: 'videoThumbTestimonial' }
        ],
        accommodation: [
            { title: 'Beachfront Resorts', description: 'Beachfront resorts and hotels.', image: 'pkgAdventurer' },
            { title: 'Lake Views', description: 'Enjoy stunning views of the lake from your room.', image: 'pkgUltimate' },
            { title: 'All Budgets', description: 'A range of options for all budgets.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Fresh Fish', description: 'Fresh fish is a specialty.', image: 'videoThumbTestimonial' },
            { title: 'Beach Dining', description: 'Enjoy a meal on the beach.', image: 'sipiCoffee' },
            { title: 'Varied Options', description: 'A variety of dining options available.', image: 'ideaFamilySafari' }
        ]
    },
    {
        id: '21', title: 'Semuliki National Park',
        shortDescription: 'Discover unique bird species and boiling hot springs.',
        imageUrl: placeholderImages.campaignSemuliki.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'semuliki hot springs',
        description: 'Explore the unique lowland tropical rainforest of Semuliki National Park. It\'s a birdwatcher\'s paradise and home to the amazing Sempaya Hot Springs.',
        storyline: [
            'A taste of Central African jungle in Uganda.',
            'See unique bird species not found elsewhere in Uganda.',
            'Witness the power of the Sempaya Hot Springs.'
        ],
        budget: 7500, goal: 100, currentAmount: 77, organizer: 'iffe-travels', tags: ['#BirdWatching', '#HotSprings', '#Uganda'], startDate: '2025-03-01', endDate: '2025-03-04', volunteersNeeded: 10, volunteersSignedUp: 6,
        activities: [
            { title: 'Bird watching', description: 'An expert guide will help you spot unique bird species.', image: 'blogShoebill' },
            { title: 'Visiting the hot springs', description: 'Boil eggs in the hot springs.', image: 'campaignSemuliki' },
            { title: 'Nature walks', description: 'Explore the rainforest on foot.', image: 'ideaWalkingSafari' }
        ],
        accommodation: [
            { title: 'Nearby Lodges', description: 'Lodges and campsites near the park.', image: 'pkgAdventurer' },
            { title: 'Comfortable Stay', description: 'Enjoy a comfortable stay in a beautiful setting.', image: 'pkgUltimate' },
            { title: 'All Budgets', description: 'Options available for all budgets.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Lodge Dining', description: 'Provided by accommodation.', image: 'videoThumbTestimonial' },
            { title: 'Forest Views', description: 'Enjoy meals with a view of the forest.', image: 'sipiCoffee' },
            { title: 'Varied Options', description: 'A variety of dining options available.', image: 'ideaFamilySafari' }
        ]
    },
    {
        id: '22', title: 'Toro Kingdom & Fort Portal',
        shortDescription: 'Explore stunning crater lakes and rich cultural experiences.',
        imageUrl: placeholderImages.campaignFortPortal.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'crater lake',
        description: 'Visit the picturesque town of Fort Portal, the seat of the Toro Kingdom. The area is famous for its stunning crater lakes, offering beautiful scenery and opportunities for hiking and swimming.',
        storyline: [
            'A blend of natural beauty and cultural heritage.',
            'Explore the stunning crater lakes of the region.',
            'Learn about the history and culture of the Toro Kingdom.'
        ],
        budget: 5000, goal: 100, currentAmount: 81, organizer: 'iffe-travels', tags: ['#Culture', '#Scenery', '#Uganda'], startDate: '2024-11-25', endDate: '2024-11-27', volunteersNeeded: 20, volunteersSignedUp: 15,
        activities: [
            { title: 'Crater lake hikes', description: 'Hikes with stunning views of the crater lakes.', image: 'campaignFortPortal' },
            { title: 'Visit to the Toro Kingdom palace', description: 'Learn about the history of the kingdom.', image: 'campaignBusoga' },
            { title: 'Exploring the Amabere ga Nyina Mwiru caves', description: 'A unique cultural experience.', image: 'campaignElgon' }
        ],
        accommodation: [
            { title: 'Fort Portal Hotels', description: 'A wide range of hotels and lodges in and around Fort Portal.', image: 'pkgAdventurer' },
            { title: 'Comfortable Stay', description: 'Enjoy a comfortable stay in this beautiful town.', image: 'pkgUltimate' },
            { title: 'All Budgets', description: 'Options available for all budgets.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Local & International', description: 'Explore local and international cuisine in Fort Portal.', image: 'videoThumbTestimonial' },
            { title: 'Crater Lake Views', description: 'Enjoy a meal with a view of the crater lakes.', image: 'sipiCoffee' },
            { title: 'Varied Options', description: 'A variety of dining options available.', image: 'ideaFamilySafari' }
        ]
    },
];

async function getCampaign(id: string): Promise<{ campaign: Campaign | undefined; relatedTours: RelatedTour[] }> {
    const campaign = mockCampaignsData.find(campaign => campaign.id === id);
    
    let relatedTours: RelatedTour[] = [];
    if (campaign) {
        relatedTours = mockCampaignsData
            .filter(otherCampaign => {
                // Ensure it's not the same campaign
                if (otherCampaign.id === campaign.id) return false;
                // Check if there's at least one common tag
                return otherCampaign.tags.some(tag => campaign.tags.includes(tag));
            })
            // Shuffle and take the first few
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(c => ({
                id: c.id,
                title: c.title,
                imageUrl: (placeholderImages[c.imageUrl.split('/').pop()?.split('.')[0] as keyof typeof placeholderImages] as any)?.src || c.imageUrl,
                dataAiHint: c.dataAiHint,
            }));
    }
     // If no related tours found by tags, show some random ones
    if (relatedTours.length === 0) {
        relatedTours = mockCampaignsData
            .filter(c => c.id !== id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(c => ({
                id: c.id,
                title: c.title,
                imageUrl: (placeholderImages[c.imageUrl.split('/').pop()?.split('.')[0] as keyof typeof placeholderImages] as any)?.src || c.imageUrl,
                dataAiHint: c.dataAiHint,
            }));
    }


    return { campaign, relatedTours };
}

export default async function CampaignDetailPage({ params }: { params: { id: string } }) {
  const { campaign, relatedTours } = await getCampaign(params.id);

  if (!campaign) {
    notFound();
  }

  return <CampaignDetailClientPage campaign={campaign} relatedTours={relatedTours} />;
}

    

    

    

    

    











