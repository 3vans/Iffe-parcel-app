
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
            { title: 'All-Inclusive', description: 'All-inclusive options available.', image: 'videoThumbTestimonial' },
            { title: 'Dining with a View', description: 'Enjoy meals with a view of the park.', image: 'sipiCoffee' },
            { title: 'Bush Dining', description: 'Bush breakfasts and dinners can be arranged for a special experience.', image: 'ideaFamilySafari' }
        ],
    },
    {
        id: '3',
        title: 'Murchison Falls Safari',
        shortDescription: 'See the powerful falls and diverse wildlife of Murchison.',
        imageUrl: placeholderImages.campaignMurchison.src,
        imageWidth: placeholderImages.campaignMurchison.width,
        imageHeight: placeholderImages.campaignMurchison.height,
        dataAiHint: placeholderImages.campaignMurchison.hint,
        description: 'Discover the dramatic Murchison Falls, where the Nile river explodes through a narrow gorge. The park is home to lions, giraffes, elephants, and vast herds of antelope. A boat trip to the base of the falls is a highlight.',
        storyline: [
            "Feel the power of nature at the world's most powerful waterfall.",
            "Explore the vast savannah teeming with life, including giraffes, elephants, and lions.",
            "The boat safari on the Nile offers incredible wildlife viewing opportunities."
        ],
        budget: 8000, goal: 100, currentAmount: 88, organizer: 'iffe-travels', tags: ['#Wildlife', '#Waterfalls', '#Uganda'], startDate: '2024-10-05', endDate: '2024-10-10', volunteersNeeded: 10, volunteersSignedUp: 10,
        activities: [
            { title: 'Hike to the top of the falls', description: 'A spectacular view awaits at the top of the falls.', image: 'campaignMurchison' },
            { title: 'Nile River Boat Safari', description: 'A boat trip to the base of the falls for incredible wildlife viewing.', image: 'fifaCardNile' },
            { title: 'Game Drives', description: 'Spot the diverse wildlife of the park on guided game drives.', image: 'galleryGiraffe' }
        ],
        accommodation: [
            { title: 'Riverside Lodges', description: 'Riverside lodges and safari tents with stunning views.', image: 'pkgAdventurer' },
            { title: 'Nile Sounds', description: 'Enjoy the sounds of the Nile from your accommodation.', image: 'pkgUltimate' },
            { title: 'Budget Options', description: 'Options available for all budgets.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Full Board', description: 'Full board available.', image: 'videoThumbTestimonial' },
            { title: 'River Views', description: 'Enjoy meals with a view of the river or savannah.', image: 'sipiCoffee' },
            { title: 'Bush Dining', description: 'Options for bush breakfasts and dinners.', image: 'ideaFamilySafari' }
        ],
    },
    // Adding more campaigns from the main page
     {
        id: '4', title: 'Kibale Forest Chimpanzee Trekking',
        shortDescription: 'Trek chimpanzees in the primate capital of East Africa.',
        imageUrl: placeholderImages.campaignKibale.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'chimpanzee forest',
        description: 'Immerse yourself in Kibale Forest, home to the highest concentration of primates in Africa. The main attraction is trekking to find and observe chimpanzees in their natural habitat.',
        storyline: [
            'An intimate encounter with our closest relatives in the animal kingdom.',
            'The forest is a magical place, filled with the sounds of primates and birds.',
            'Learn about the conservation efforts to protect these intelligent creatures.'
        ],
        budget: 12000, goal: 100, currentAmount: 85, organizer: 'iffe-travels', tags: ['#Chimpanzee', '#Primates', '#Uganda'], startDate: '2024-08-10', endDate: '2024-08-13', volunteersNeeded: 6, volunteersSignedUp: 4,
        activities: [
            { title: 'Chimpanzee Trekking', description: 'Expert guides lead you to find and observe chimpanzees.', image: 'campaignKibale' },
            { title: 'Bigodi Wetland Sanctuary Walk', description: 'A walk for bird and monkey viewing in the Bigodi Wetland.', image: 'blogShoebill' },
            { title: 'Bird Watching', description: 'Kibale is one of Africa\'s premier birding spots.', image: 'blogShoebill' }
        ],
        accommodation: [
            { title: 'Forest Lodges', description: 'Forest lodges and camps, some with views of the forest canopy.', image: 'pkgAdventurer' },
            { title: 'Forest Sounds', description: 'Wake up to the sounds of the forest.', image: 'pkgUltimate' },
            { title: 'Eco-Friendly', description: 'Eco-friendly accommodations that blend with the natural environment.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'All Meals Included', description: 'Packages typically include all meals during your stay.', image: 'videoThumbTestimonial' },
            { title: 'Local Food', description: 'Enjoy fresh, locally sourced food.', image: 'sipiCoffee' },
            { title: 'Forest Dining', description: 'Dine in a unique forest setting.', image: 'ideaFamilySafari' }
        ]
    },
    {
        id: '5', title: 'Rwenzori Mountains Hiking',
        shortDescription: 'Hike the snow-capped "Mountains of the Moon".',
        imageUrl: placeholderImages.campaignRwenzori.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'rwenzori mountains',
        description: 'Challenge yourself with a trek into the legendary Rwenzori Mountains, a UNESCO World Heritage site. These mist-shrouded peaks offer stunning scenery, unique flora, and a true high-altitude adventure.',
        storyline: [
            'A journey through different vegetation zones, from tropical rainforest to alpine meadows.',
            'Culminate in views of equatorial glaciers, a rare sight in Africa.',
            'This is a challenging but rewarding trek for the adventurous traveler.'
        ],
        budget: 25000, goal: 100, currentAmount: 75, organizer: 'iffe-travels', tags: ['#Hiking', '#Mountains', '#Uganda'], startDate: '2025-01-10', endDate: '2025-01-20', volunteersNeeded: 8, volunteersSignedUp: 2,
        activities: [
            { title: 'Multi-day trekking circuits', description: 'Circuits for all levels of fitness.', image: 'campaignRwenzori' },
            { title: 'Acclimatization hikes', description: 'Prepare for the summit with acclimatization hikes.', image: 'sipiHiking' },
            { title: 'Summit attempts on Margherita Peak', description: 'Attempt to summit the highest point, Margherita Peak.', image: 'fifaCardKili' }
        ],
        accommodation: [
            { title: 'Mountain Huts', description: 'Basic but comfortable mountain huts along the trekking routes.', image: 'pkgAdventurer' },
            { title: 'Expedition Camaraderie', description: 'Experience the camaraderie of a mountain expedition.', image: 'pkgUltimate' },
            { title: 'Gear Provided', description: 'All necessary camping gear is provided.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Trek Cook', description: 'All meals on the mountain are prepared by a dedicated trek cook.', image: 'videoThumbTestimonial' },
            { title: 'High-Energy Meals', description: 'High-energy meals to fuel your trek.', image: 'sipiCoffee' },
            { title: 'Hot Drinks', description: 'Hot drinks and snacks are provided throughout the day.', image: 'ideaFamilySafari' }
        ]
    },
    {
        id: '6', title: 'Relax at Lake Bunyonyi',
        shortDescription: 'Relax by one of Africa’s deepest and most scenic lakes.',
        imageUrl: placeholderImages.campaignBunyonyi.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'lake bunyonyi',
        description: 'Unwind at the beautiful Lake Bunyonyi, known for its 29 islands and terraced hillsides. It\'s a perfect place to relax after a gorilla trek, with activities like canoeing, swimming, and hiking.',
        storyline: [
            'A tranquil escape into one of Uganda\'s most picturesque landscapes.',
            'The lake is a place of peace and beauty, perfect for relaxation.',
            'Explore the islands and learn about the local culture.'
        ],
        budget: 5000, goal: 100, currentAmount: 95, organizer: 'iffe-travels', tags: ['#Relaxation', '#Scenery', '#Uganda'], startDate: '2024-09-05', endDate: '2024-09-08', volunteersNeeded: 15, volunteersSignedUp: 15,
        activities: [
            { title: 'Canoeing on the calm waters', description: 'Explore the lake by canoe.', image: 'campaignBunyonyi' },
            { title: 'Island hopping', description: 'Discover the history of each island.', image: 'campaignSsese' },
            { title: 'Swimming in the bilge-free waters', description: 'Enjoy a refreshing swim in the lake.', image: 'campaignBunyonyi' }
        ],
        accommodation: [
            { title: 'Lakeside Resorts', description: 'A range of lakeside resorts, cottages, and campsites.', image: 'pkgAdventurer' },
            { title: 'Stunning Views', description: 'Wake up to stunning views of the lake.', image: 'pkgUltimate' },
            { title: 'Peace and Quiet', description: 'Enjoy the peace and quiet of this beautiful location.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Local Crayfish', description: 'Freshly prepared meals, including local crayfish, a specialty of the lake.', image: 'videoThumbTestimonial' },
            { title: 'Dining with a View', description: 'Enjoy a meal with a view of the lake.', image: 'sipiCoffee' },
            { title: 'All Diets', description: 'Options for all dietary needs.', image: 'ideaFamilySafari' }
        ]
    },
     {
        id: '7', title: 'Lake Mburo Cycling Safari',
        shortDescription: 'The closest park to Kampala, perfect for cycling among zebras.',
        imageUrl: placeholderImages.campaignMburo.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'zebra safari',
        description: 'Experience a unique cycling safari in Lake Mburo National Park. Ride alongside herds of zebras, impalas, and other wildlife in this beautiful and accessible park.',
        storyline: [
            'A thrilling and active way to get closer to nature.',
            'Cycling among the wildlife is an unforgettable experience.',
            'The park is small but packed with wildlife.'
        ],
        budget: 6000, goal: 100, currentAmount: 82, organizer: 'iffe-travels', tags: ['#Cycling', '#Zebras', '#Uganda'], startDate: '2024-11-01', endDate: '2024-11-03', volunteersNeeded: 20, volunteersSignedUp: 18,
        activities: [
            { title: 'Guided cycling safaris', description: 'Scenic trails for a unique safari experience.', image: 'campaignMburo' },
            { title: 'Walking safaris', description: 'Get even closer to the wildlife on foot.', image: 'ideaWalkingSafari' },
            { title: 'Boat trips on the lake', description: 'See hippos and crocodiles on a boat trip.', image: 'galleryElephant' }
        ],
        accommodation: [
            { title: 'Safari Lodges', description: 'Safari lodges and luxury tented camps.', image: 'pkgAdventurer' },
            { title: 'Bush Sounds', description: 'Enjoy the sounds of the bush from your accommodation.', image: 'pkgUltimate' },
            { title: 'Budget Options', description: 'Options available for all budgets.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'All-Inclusive', description: 'All-inclusive packages available.', image: 'videoThumbTestimonial' },
            { title: 'Wildlife Views', description: 'Enjoy meals with a view of the park\'s wildlife.', image: 'sipiCoffee' },
            { title: 'Bush Dinners', description: 'Bush dinners can be arranged for a special experience.', image: 'ideaFamilySafari' }
        ]
    },
    {
        id: '8', title: 'Jinja - Source of the Nile',
        shortDescription: 'Discover the legendary source of the world\'s longest river.',
        imageUrl: placeholderImages.campaignSourceNile.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'source of nile',
        description: 'Visit Jinja, the historic town famous as the source of the River Nile. Take a boat trip to the exact spot where the river begins its long journey to the Mediterranean.',
        storyline: [
            'Stand at the beginning of one of the world\'s great rivers.',
            'Learn about the history and geography of the Nile.',
            'A must-do experience for any visitor to Uganda.'
        ],
        budget: 3000, goal: 100, currentAmount: 90, organizer: 'iffe-travels', tags: ['#Jinja', '#RiverNile', '#Uganda'], startDate: '2024-12-01', endDate: '2024-12-02', volunteersNeeded: 30, volunteersSignedUp: 25,
        activities: [
            { title: 'Boat trip to the Source of the Nile', description: 'A boat trip to the exact spot where the Nile begins.', image: 'campaignSourceNile' },
            { title: 'Visit local craft markets', description: 'Shop for souvenirs at local craft markets.', image: 'ideaFamilySafari' },
            { title: 'Explore the colonial architecture', description: 'Discover the historic architecture of Jinja town.', image: 'campaignBusoga' }
        ],
        accommodation: [
            { title: 'Jinja Hotels', description: 'Hotels and guesthouses in Jinja.', image: 'pkgAdventurer' },
            { title: 'Comfortable Stay', description: 'Enjoy a comfortable stay in this historic town.', image: 'pkgUltimate' },
            { title: 'All Budgets', description: 'Options available for all budgets.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Fresh Fish', description: 'Enjoy fresh fish from Lake Victoria.', image: 'videoThumbTestimonial' },
            { title: 'Local Cuisine', description: 'Try local Ugandan cuisine.', image: 'sipiCoffee' },
            { title: 'Jinja Restaurants', description: 'A variety of restaurants and cafes in Jinja.', image: 'ideaFamilySafari' }
        ]
    },
    {
        id: '9', title: 'White-Water Rafting in Jinja',
        shortDescription: 'Experience the thrill of Grade 5 rapids on the Nile.',
        imageUrl: placeholderImages.campaignRafting.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'white water rafting',
        description: 'Get your adrenaline pumping with a white-water rafting adventure on the powerful rapids of the Nile River near Jinja. Full-day and half-day trips are available for all experience levels.',
        storyline: [
            'An action-packed day of adventure on one of the world\'s most famous rivers.',
            'Rafting on the Nile is a thrilling and unforgettable experience.',
            'No prior experience is necessary.'
        ],
        budget: 4000, goal: 100, currentAmount: 95, organizer: 'iffe-travels', tags: ['#Adventure', '#Jinja', '#Uganda'], startDate: '2024-12-03', endDate: '2024-12-03', volunteersNeeded: 40, volunteersSignedUp: 40,
        activities: [
            { title: 'White-water rafting on Grade 5 rapids', description: 'An adrenaline-pumping experience.', image: 'campaignRafting' },
            { title: 'Kayaking', description: 'A different perspective of the river.', image: 'fifaCardOkavango' },
            { title: 'River bugging', description: 'A unique solo adventure on the river.', image: 'campaignRafting' }
        ],
        accommodation: [
            { title: 'Riverside Camps', description: 'Riverside camps and lodges.', image: 'pkgAdventurer' },
            { title: 'Relax by the River', description: 'Relax by the river after a day of adventure.', image: 'pkgUltimate' },
            { title: 'All Budgets', description: 'Options available for all budgets.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'BBQ Lunch', description: 'Includes a BBQ lunch and celebratory drinks after the rafting.', image: 'videoThumbTestimonial' },
            { title: 'Group Dining', description: 'Enjoy a meal with your fellow adventurers.', image: 'sipiCoffee' },
            { title: 'Vegetarian Options', description: 'Vegetarian options available.', image: 'ideaFamilySafari' }
        ]
    },
    {
        id: '10', title: 'Mount Elgon National Park',
        shortDescription: 'Hike a volcanic mountain and explore caves near Sipi Falls.',
        imageUrl: placeholderImages.campaignElgon.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'mount elgon',
        description: 'Hike the slopes of Mount Elgon, an extinct shield volcano. The park offers varied trekking options, from day hikes to multi-day expeditions to the caldera.',
        storyline: [
            'Explore a unique ecosystem on the slopes of one of Africa\'s largest volcanic bases.',
            'The views from the top are spectacular.',
            'A great alternative to more strenuous mountain treks.'
        ],
        budget: 9000, goal: 100, currentAmount: 78, organizer: 'iffe-travels', tags: ['#Hiking', '#Volcano', '#Uganda'], startDate: '2025-02-01', endDate: '2025-02-05', volunteersNeeded: 12, volunteersSignedUp: 7,
        activities: [
            { title: 'Hiking to the caldera and peaks', description: 'Explore the volcanic crater.', image: 'campaignElgon' },
            { title: 'Cave exploration', description: 'See ancient rock art in the caves.', image: 'campaignFortPortal' },
            { title: 'Bird watching in the forested slopes', description: 'Discover the diverse birdlife of the park.', image: 'blogShoebill' }
        ],
        accommodation: [
            { title: 'Guesthouses', description: 'Guesthouses and campsites near the park entrance.', image: 'pkgAdventurer' },
            { title: 'Mountain Air', description: 'Enjoy the fresh mountain air.', image: 'pkgUltimate' },
            { title: 'Basic Lodging', description: 'Basic but comfortable lodging.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Trekking Meals', description: 'Meals provided on multi-day treks.', image: 'videoThumbTestimonial' },
            { title: 'High-Energy Food', description: 'High-energy food to fuel your hike.', image: 'sipiCoffee' },
            { title: 'Post-Hike Meal', description: 'Enjoy a hot meal after a day of trekking.', image: 'ideaFamilySafari' }
        ]
    },
    {
        id: '11', title: 'Sipi Falls Adventure',
        shortDescription: 'Explore a series of beautiful waterfalls with coffee tours and hikes.',
        imageUrl: placeholderImages.campaignSipi.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'sipi falls',
        description: 'Discover the beauty of Sipi Falls, a series of three stunning waterfalls in eastern Uganda. Enjoy guided hikes, abseiling, and a fascinating tour of a local coffee plantation.',
        storyline: [
            'A journey into the heart of coffee country, with spectacular waterfall views.',
            'The falls are a beautiful and refreshing sight.',
            'Learn about the local culture and way of life.'
        ],
        budget: 4500, goal: 100, currentAmount: 88, organizer: 'iffe-travels', tags: ['#Waterfalls', '#Coffee', '#Uganda'], startDate: '2024-11-20', endDate: '2024-11-22', volunteersNeeded: 15, volunteersSignedUp: 11,
        activities: [
            { title: 'Waterfall hikes', description: 'See all three stunning waterfalls.', image: 'campaignSipi' },
            { title: 'Abseiling down a waterfall', description: 'An adrenaline-pumping experience.', image: 'sipiAbseiling' },
            { title: 'Coffee tours', description: 'Learn about the local coffee industry.', image: 'sipiCoffee' }
        ],
        accommodation: [
            { title: 'Lodges with Views', description: 'Lodges and community-run guesthouses with incredible views.', image: 'pkgAdventurer' },
            { title: 'Sound of Falls', description: 'Enjoy the sound of the falls from your room.', image: 'pkgUltimate' },
            { title: 'Peaceful Stay', description: 'A peaceful and relaxing place to stay.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Local Dishes', description: 'Taste local dishes and freshly brewed coffee.', image: 'videoThumbTestimonial' },
            { title: 'Dining with a View', description: 'Enjoy a meal with a view of the falls.', image: 'sipiCoffee' },
            { title: 'Vegetarian Options', description: 'Vegetarian options available.', image: 'ideaFamilySafari' }
        ]
    },
    {
        id: '12', title: 'Busoga Kingdom Cultural Tour',
        shortDescription: 'Immerse yourself in the royal heritage and traditions of Busoga.',
        imageUrl: placeholderImages.campaignBusoga.src, imageWidth: 600, imageHeight: 350, dataAiHint: 'cultural kingdom',
        description: 'Experience the rich culture of the Busoga Kingdom. Visit royal sites, learn about local traditions, and enjoy cultural performances. A unique insight into the heritage of eastern Uganda.',
        storyline: [
            'A deep dive into the history and living culture of the Basoga people.',
            'Learn about the kingdom\'s traditions and customs.',
            'A fascinating and educational experience.'
        ],
        budget: 2500, goal: 100, currentAmount: 65, organizer: 'iffe-travels', tags: ['#Culture', '#History', '#Uganda'], startDate: '2024-12-05', endDate: '2024-12-06', volunteersNeeded: 25, volunteersSignedUp: 10,
        activities: [
            { title: 'Visit to the Kyabazinga\'s palace', description: 'See the royal palace of the Busoga Kingdom.', image: 'campaignBusoga' },
            { title: 'Cultural performances', description: 'Enjoy traditional music and dance.', image: 'ideaFamilySafari' },
            { title: 'Local craft workshops', description: 'Learn traditional skills from local artisans.', image: 'ideaFamilySafari' }
        ],
        accommodation: [
            { title: 'Jinja Hotels', description: 'Hotels in Jinja or nearby towns.', image: 'pkgAdventurer' },
            { title: 'Comfortable Stay', description: 'Enjoy a comfortable stay in a modern hotel.', image: 'pkgUltimate' },
            { title: 'All Budgets', description: 'Options available for all budgets.', image: 'pkgExplorer' }
        ],
        meals: [
            { title: 'Traditional Cuisine', description: 'Try traditional Busoga cuisine.', image: 'videoThumbTestimonial' },
            { title: 'Family Meal', description: 'Enjoy a meal with a local family.', image: 'sipiCoffee' },
            { title: 'Jinja Restaurants', description: 'A variety of restaurants in Jinja.', image: 'ideaFamilySafari' }
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
        budget: 2000, goal: 100, currentAmount: 91, organizer: 'iffe-travels', tags: ['#CityTour', '#Culture', '#Uganda'], startDate: '2024-11-15', endDate: '2024-11-15', volunteersNeeded: 50, volunteersSignedUp: 45,
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
        budget: 1500, goal: 100, currentAmount: 89, organizer: 'iffe-travels', tags: ['#Gardens', '#Relaxation', '#Uganda'], startDate: '2024-11-14', endDate: '2024-11-14', volunteersNeeded: 40, volunteersSignedUp: 30,
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
        budget: 3500, goal: 100, currentAmount: 94, organizer: 'iffe-travels', tags: ['#Conservation', '#Chimpanzee', '#Uganda'], startDate: '2024-11-16', endDate: '2024-11-16', volunteersNeeded: 20, volunteersSignedUp: 19,
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
        budget: 2800, goal: 100, currentAmount: 86, organizer: 'iffe-travels', tags: ['#Adventure', '#Forest', '#Uganda'], startDate: '2024-11-17', endDate: '2024-11-17', volunteersNeeded: 25, volunteersSignedUp: 20,
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
            { title: 'Varied Options', description: 'A variety of dining options.', image: 'ideaFamilySafari' }
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

    

    

    

    

    
