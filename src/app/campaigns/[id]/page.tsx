
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
  activities: string[];
  accommodation: string[];
  meals: string[];
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
            'Gorilla Trekking (permit included): An intimate encounter with a gorilla family.',
            'Community Walk: Visit local communities and learn about their culture and traditions.',
            'Bird Watching Tour: Explore the diverse birdlife of Bwindi with an expert guide.'
        ],
        accommodation: [
            'Comfortable eco-lodges with stunning forest views.',
            'Options range from budget-friendly to luxury accommodations.',
            'All lodges are selected for their commitment to sustainability and guest comfort.'
        ],
        meals: [
            'Full board included: breakfast, packed lunch for the trek, and dinner.',
            'Meals are prepared with locally sourced ingredients, offering a taste of Uganda.',
            'Special dietary requirements can be accommodated upon request.'
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
        description: 'Explore the diverse ecosystems of Queen Elizabeth National Park. Famous for its tree-climbing lions, this park also boasts a stunning boat safari on the Kazinga Channel where you can see elephants, hippos, crocodiles, and a huge variety of birdlife.',
        storyline: [
            'From the open savannah to the dense papyrus swamps, every game drive and boat cruise offers a new discovery.',
            'This is classic African safari at its best, with opportunities to see a wide range of wildlife.',
            'The park\'s diverse landscapes make it a photographer\'s paradise.'
        ],
        budget: 15000, goal: 100, currentAmount: 92, organizer: 'iffe-travels', tags: ['#Wildlife', '#Lions', '#Uganda'], startDate: '2024-07-15', endDate: '2024-07-22', volunteersNeeded: 12, volunteersSignedUp: 8,
        activities: [
            'Game Drives (Ishasha & Kasenyi): Search for tree-climbing lions and other big game.',
            'Kazinga Channel Boat Cruise: Get up close with hippos, crocodiles, and elephants.',
            'Crater Lake Drive: Explore the scenic crater lakes of the park.'
        ],
        accommodation: [
            'Selection of safari lodges and camps overlooking the savannah or channel.',
            'Each accommodation offers unique views and comfortable amenities.',
            'Enjoy the sounds of the wild from the safety of your room.'
        ],
        meals: [
            'All-inclusive options available.',
            'Enjoy meals with a view of the park.',
            'Bush breakfasts and dinners can be arranged for a special experience.'
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
            'Hike to the top of the falls for a spectacular view.',
            'Nile River Boat Safari to the base of the falls.',
            'Game Drives to spot the diverse wildlife of the park.'
        ],
        accommodation: [
            'Riverside lodges and safari tents with stunning views.',
            'Enjoy the sounds of the Nile from your accommodation.',
            'Options available for all budgets.'
        ],
        meals: [
            'Full board available.',
            'Enjoy meals with a view of the river or savannah.',
            'Options for bush breakfasts and dinners.'
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
            'Chimpanzee Trekking with expert guides.',
            'Bigodi Wetland Sanctuary Walk for bird and monkey viewing.',
            'Bird Watching in one of Africa\'s premier birding spots.'
        ],
        accommodation: [
            'Forest lodges and camps, some with views of the forest canopy.',
            'Wake up to the sounds of the forest.',
            'Eco-friendly accommodations that blend with the natural environment.'
        ],
        meals: [
            'Packages typically include all meals during your stay.',
            'Enjoy fresh, locally sourced food.',
            'Dine in a unique forest setting.'
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
            'Multi-day trekking circuits for all levels of fitness.',
            'Acclimatization hikes to prepare for the summit.',
            'Summit attempts on Margherita Peak, the highest point.'
        ],
        accommodation: [
            'Basic but comfortable mountain huts along the trekking routes.',
            'Experience the camaraderie of a mountain expedition.',
            'All necessary camping gear is provided.'
        ],
        meals: [
            'All meals on the mountain are prepared by a dedicated trek cook.',
            'High-energy meals to fuel your trek.',
            'Hot drinks and snacks are provided throughout the day.'
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
            'Canoeing on the calm waters of the lake.',
            'Island hopping to discover the history of each island.',
            'Swimming in the bilge-free waters of the lake.'
        ],
        accommodation: [
            'A range of lakeside resorts, cottages, and campsites.',
            'Wake up to stunning views of the lake.',
            'Enjoy the peace and quiet of this beautiful location.'
        ],
        meals: [
            'Freshly prepared meals, including local crayfish, a specialty of the lake.',
            'Enjoy a meal with a view of the lake.',
            'Options for all dietary needs.'
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
            'Guided cycling safaris on scenic trails.',
            'Walking safaris to get even closer to the wildlife.',
            'Boat trips on the lake to see hippos and crocodiles.'
        ],
        accommodation: [
            'Safari lodges and luxury tented camps.',
            'Enjoy the sounds of the bush from your accommodation.',
            'Options available for all budgets.'
        ],
        meals: [
            'All-inclusive packages available.',
            'Enjoy meals with a view of the park\'s wildlife.',
            'Bush dinners can be arranged for a special experience.'
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
            'Boat trip to the Source of the Nile.',
            'Visit local craft markets for souvenirs.',
            'Explore the colonial architecture of Jinja town.'
        ],
        accommodation: [
            'Hotels and guesthouses in Jinja.',
            'Enjoy a comfortable stay in this historic town.',
            'Options available for all budgets.'
        ],
        meals: [
            'Enjoy fresh fish from Lake Victoria.',
            'Try local Ugandan cuisine.',
            'A variety of restaurants and cafes in Jinja.'
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
            'White-water rafting on Grade 5 rapids.',
            'Kayaking for a different perspective of the river.',
            'River bugging for a unique solo adventure.'
        ],
        accommodation: [
            'Riverside camps and lodges.',
            'Relax by the river after a day of adventure.',
            'Options available for all budgets.'
        ],
        meals: [
            'Includes a BBQ lunch and celebratory drinks after the rafting.',
            'Enjoy a meal with your fellow adventurers.',
            'Vegetarian options available.'
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
            'Hiking to the caldera and peaks.',
            'Cave exploration to see ancient rock art.',
            'Bird watching in the forested slopes.'
        ],
        accommodation: [
            'Guesthouses and campsites near the park entrance.',
            'Enjoy the fresh mountain air.',
            'Basic but comfortable lodging.'
        ],
        meals: [
            'Meals provided on multi-day treks.',
            'High-energy food to fuel your hike.',
            'Enjoy a hot meal after a day of trekking.'
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
            'Waterfall hikes to see all three falls.',
            'Abseiling down the side of a waterfall.',
            'Coffee tours to learn about the local coffee industry.'
        ],
        accommodation: [
            'Lodges and community-run guesthouses with incredible views.',
            'Enjoy the sound of the falls from your room.',
            'A peaceful and relaxing place to stay.'
        ],
        meals: [
            'Taste local dishes and freshly brewed coffee.',
            'Enjoy a meal with a view of the falls.',
            'Vegetarian options available.'
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
            'Visit to the Kyabazinga\'s palace.',
            'Cultural performances of traditional music and dance.',
            'Local craft workshops to learn traditional skills.'
        ],
        accommodation: [
            'Hotels in Jinja or nearby towns.',
            'Enjoy a comfortable stay in a modern hotel.',
            'Options available for all budgets.'
        ],
        meals: [
            'Try traditional Busoga cuisine.',
            'Enjoy a meal with a local family.',
            'A variety of restaurants in Jinja.'
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
            'Game drives to see the park\'s unique wildlife.',
            'Cultural visits to Karamojong communities.',
            'Hiking in the rugged landscapes of the park.'
        ],
        accommodation: [
            'Luxury lodges and basic campsites within the park.',
            'Enjoy the peace and quiet of the wilderness.',
            'Options available for all budgets.'
        ],
        meals: [
            'All-inclusive packages available.',
            'Enjoy meals with a view of the park\'s stunning landscapes.',
            'Bush dinners can be arranged for a special experience.'
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
            'Wildlife viewing near the falls.',
            'Visiting the falls to witness their power.',
            'Bird watching in the surrounding area.'
        ],
        accommodation: [
            'Lodges near the falls.',
            'Enjoy a comfortable stay in a scenic location.',
            'Options available for all budgets.'
        ],
        meals: [
            'Provided by the lodges.',
            'Enjoy a meal with a view of the river.',
            'A variety of dining options available.'
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
            'Game drives to spot rare wildlife.',
            'Nature walks to explore the savannah on foot.',
            'Cultural encounters with the local Karamojong people.'
        ],
        accommodation: [
            'Basic camping facilities and nearby guesthouses.',
            'A true back-to-nature experience.',
            'Options for the adventurous traveler.'
        ],
        meals: [
            'Basic meals provided on camping trips.',
            'Enjoy a simple meal cooked over an open fire.',
            'A chance to try local cuisine.'
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
            'Visiting historical sites like the Kasubi Tombs.',
            'Shopping in craft markets for souvenirs.',
            'Trying local street food.'
        ],
        accommodation: [
            'N/A (Day tour).',
            'No accommodation provided.',
            'Can be arranged upon request.'
        ],
        meals: [
            'Includes a traditional Ugandan lunch.',
            'Try local dishes like matoke and luwombo.',
            'A taste of Ugandan cuisine.'
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
            'A tour of the beautiful Botanical Gardens.',
            'A visit to the Uganda Wildlife Education Centre.',
            'Lunch by the shores of Lake Victoria.'
        ],
        accommodation: [
            'N/A (Day tour).',
            'No accommodation provided.',
            'Can be arranged upon request.'
        ],
        meals: [
            'Includes lunch at a lakeside restaurant.',
            'Enjoy fresh fish from Lake Victoria.',
            'A relaxing meal with a view.'
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
            'Boat trip on Lake Victoria to Ngamba Island.',
            'Chimpanzee viewing during feeding time.',
            'Educational talks about chimpanzee conservation.'
        ],
        accommodation: [
            'N/A (Day trip).',
            'No accommodation provided.',
            'Can be arranged upon request.'
        ],
        meals: [
            'Lunch is included in the trip.',
            'Enjoy a meal on the island.',
            'A unique dining experience.'
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
            'Zip-lining through the forest canopy.',
            'Forest walks to see the flora and fauna up close.',
            'Bird watching for the numerous bird species in the forest.'
        ],
        accommodation: [
            'N/A (Day trip).',
            'No accommodation provided.',
            'Can be arranged upon request.'
        ],
        meals: [
            'Lunch included in the package.',
            'Enjoy a meal in a forest setting.',
            'A chance to refuel after your adventure.'
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
            'Beach relaxation and swimming.',
            'Canoeing and kayaking on the lake.',
            'Fishing for tilapia and Nile perch.'
        ],
        accommodation: [
            'Beachfront resorts and hotels.',
            'Enjoy stunning views of the lake from your room.',
            'A range of options for all budgets.'
        ],
        meals: [
            'Fresh fish is a specialty.',
            'Enjoy a meal on the beach.',
            'A variety of dining options available.'
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
            'Bird watching with an expert guide.',
            'Visiting the hot springs and boiling eggs in the water.',
            'Nature walks to explore the rainforest.'
        ],
        accommodation: [
            'Lodges and campsites near the park.',
            'Enjoy a comfortable stay in a beautiful setting.',
            'Options available for all budgets.'
        ],
        meals: [
            'Provided by accommodation.',
            'Enjoy meals with a view of the forest.',
            'A variety of dining options.'
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
            'Crater lake hikes with stunning views.',
            'Visit to the Toro Kingdom palace.',
            'Exploring the Amabere ga Nyina Mwiru caves.'
        ],
        accommodation: [
            'A wide range of hotels and lodges in and around Fort Portal.',
            'Enjoy a comfortable stay in this beautiful town.',
            'Options available for all budgets.'
        ],
        meals: [
            'Explore local and international cuisine in Fort Portal.',
            'Enjoy a meal with a view of the crater lakes.',
            'A variety of dining options available.'
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
