import { Show } from '../slices/contentSlice';

export const showData: Show[] = [
  {
    id: '401',
    title: 'Ethereal',
    description: 'In a world where some humans have developed supernatural abilities, detective Sara Chen must navigate both her emerging powers and a series of mysterious deaths that appear to be linked to a shadowy organization experimenting on powered individuals.',
    releaseYear: '2023',
    rating: 'TV-MA',
    seasons: 2,
    episodes: 16,
    genres: ['Sci-Fi', 'Drama', 'Thriller', 'Mystery'],
    starRating: 4.7,
    thumbnailUrl: 'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?w=600&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?q=80&w=2000&auto=format&fit=crop',
    creator: 'Michael Torres',
    network: 'Rangbaj Network',
    cast: [
      { 
        name: 'Olivia Park', 
        character: 'Detective Sara Chen',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'James Reid', 
        character: 'Dr. Marcus Reed',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Sophia Johnson', 
        character: 'Captain Amara Williams',
        image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Daniel Kim', 
        character: 'Lucas Gray',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop' 
      }
    ],
    relatedShows: [
      { id: '402', title: 'Parallax', thumbnail: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=400&auto=format&fit=crop' },
      { id: '403', title: 'Chimera', thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop' },
      { id: '404', title: 'Fragments', thumbnail: 'https://images.unsplash.com/photo-1460355976672-71c3f0a4bdac?w=400&auto=format&fit=crop' },
    ],
    seasonDetails: [
      {
        number: 1,
        title: 'Season 1',
        episodes: [
          {
            id: '401-101',
            number: 1,
            title: 'Awakening',
            duration: '48m',
            thumbnail: 'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?w=400&auto=format&fit=crop',
            description: 'Detective Sara Chen experiences strange symptoms after investigating a murder scene, leading her to discover she has developed abilities beyond normal human capacity.'
          },
          {
            id: '401-102',
            number: 2,
            title: 'Shadows',
            duration: '52m',
            thumbnail: 'https://images.unsplash.com/photo-1529973625058-a665431328fb?w=400&auto=format&fit=crop',
            description: 'As Sara struggles to control her new abilities, more bodies appear with similar markers, suggesting a pattern that connects to a covert research facility.'
          },
          {
            id: '401-103',
            number: 3,
            title: 'Connections',
            duration: '47m',
            thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&auto=format&fit=crop',
            description: 'Sara meets others with similar abilities and begins to piece together the conspiracy behind their powers.'
          }
        ]
      },
      {
        number: 2,
        title: 'Season 2',
        episodes: [
          {
            id: '401-201',
            number: 1,
            title: 'Evolution',
            duration: '55m',
            thumbnail: 'https://images.unsplash.com/photo-1512413914633-b5043f4041ea?w=400&auto=format&fit=crop',
            description: 'Six months after the events of Season 1, Sara has gained better control of her abilities but discovers a new wave of powered individuals with more dangerous capabilities.'
          },
          {
            id: '401-202',
            number: 2,
            title: 'Fracture',
            duration: '49m',
            thumbnail: 'https://images.unsplash.com/photo-1557626204-59dd03f32fb9?w=400&auto=format&fit=crop',
            description: 'A rift forms between Sara and her colleagues when her abilities become public knowledge, forcing her to choose sides in a growing conflict.'
          },
          {
            id: '401-203',
            number: 3,
            title: 'Threshold',
            duration: '51m',
            thumbnail: 'https://images.unsplash.com/photo-1590418606746-018840f9cd0f?w=400&auto=format&fit=crop',
            description: 'Dr. Reed reveals the full extent of his research, while Sara discovers that her powers are still evolving in unexpected ways.'
          }
        ]
      }
    ]
  },
  {
    id: '402',
    title: 'Parallax',
    description: 'When a quantum physics experiment goes catastrophically wrong, scientist Maya Patel finds herself able to glimpse parallel versions of her life. As she tries to return to her original reality, she discovers that moving between dimensions has consequences for all versions of herself.',
    releaseYear: '2024',
    rating: 'TV-14',
    seasons: 1,
    episodes: 10,
    genres: ['Sci-Fi', 'Drama', 'Mystery'],
    starRating: 4.5,
    thumbnailUrl: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=600&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?q=80&w=2000&auto=format&fit=crop',
    creator: 'Jennifer Lee',
    network: 'Rangbaj Network',
    cast: [
      { 
        name: 'Priya Sharma', 
        character: 'Dr. Maya Patel',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'David Chen', 
        character: 'Dr. Ethan Clark',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Marcus Johnson', 
        character: 'Director Phillips',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop' 
      }
    ],
    relatedShows: [
      { id: '401', title: 'Ethereal', thumbnail: 'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?w=400&auto=format&fit=crop' },
      { id: '405', title: 'Newton\'s Cradle', thumbnail: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?w=400&auto=format&fit=crop' },
      { id: '406', title: 'Quantum Division', thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop' },
    ],
    seasonDetails: [
      {
        number: 1,
        title: 'Season 1',
        episodes: [
          {
            id: '402-101',
            number: 1,
            title: 'Divergence',
            duration: '58m',
            thumbnail: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=400&auto=format&fit=crop',
            description: 'Dr. Maya Patel\'s groundbreaking experiment in quantum computing goes awry, fracturing her perception of reality and revealing glimpses of parallel lives.'
          },
          {
            id: '402-102',
            number: 2,
            title: 'Echo',
            duration: '52m',
            thumbnail: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=400&auto=format&fit=crop',
            description: 'Maya struggles to determine which reality is her original one, while discovering that her actions in one universe affect the others.'
          },
          {
            id: '402-103',
            number: 3,
            title: 'Ripple Effect',
            duration: '55m',
            thumbnail: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&auto=format&fit=crop',
            description: 'As Maya learns to navigate between realities, she discovers a disturbing pattern suggesting someone else is manipulating the dimensional barriers.'
          }
        ]
      }
    ]
  },
  {
    id: '403',
    title: 'Chimera',
    description: 'In a near-future where genetic engineering has become commonplace, geneticist Thomas Jin creates a revolutionary treatment that can cure previously incurable diseases. But when patients begin experiencing strange side effects, he discovers his creation is evolving beyond his control.',
    releaseYear: '2023',
    rating: 'TV-MA',
    seasons: 2,
    episodes: 18,
    genres: ['Sci-Fi', 'Thriller', 'Horror'],
    starRating: 4.3,
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000&auto=format&fit=crop',
    creator: 'Dr. Robert Chen',
    network: 'Eclipse TV',
    cast: [
      { 
        name: 'James Park', 
        character: 'Dr. Thomas Jin',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Zoe Williams', 
        character: 'Dr. Amara Okafor',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Nathan Roberts', 
        character: 'Director Ellis',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop' 
      }
    ],
    relatedShows: [
      { id: '401', title: 'Ethereal', thumbnail: 'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?w=400&auto=format&fit=crop' },
      { id: '407', title: 'Evolution\'s Edge', thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop' },
      { id: '408', title: 'Pandemic Protocol', thumbnail: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=400&auto=format&fit=crop' },
    ],
    seasonDetails: [
      {
        number: 1,
        title: 'Season 1',
        episodes: [
          {
            id: '403-101',
            number: 1,
            title: 'Genesis',
            duration: '56m',
            thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop',
            description: 'Dr. Thomas Jin receives approval for human trials of his revolutionary genetic treatment, celebrating a breakthrough that could change medicine forever.'
          },
          {
            id: '403-102',
            number: 2,
            title: 'Mutation',
            duration: '54m',
            thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&auto=format&fit=crop',
            description: 'The first patients show remarkable recovery, but Thomas notices anomalies in their genetic profiles that weren\'t part of the original treatment design.'
          },
          {
            id: '403-103',
            number: 3,
            title: 'Adaptation',
            duration: '58m',
            thumbnail: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&auto=format&fit=crop',
            description: 'As patients begin developing unexpected abilities, Thomas races to understand how his treatment is rewriting human DNA in ways he never intended.'
          }
        ]
      },
      {
        number: 2,
        title: 'Season 2',
        episodes: [
          {
            id: '403-201',
            number: 1,
            title: 'Escalation',
            duration: '62m',
            thumbnail: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=400&auto=format&fit=crop',
            description: 'One year later, Thomas works in secret to contain the spread of his creation, which has escaped the lab and begun spreading through environmental exposure.'
          },
          {
            id: '403-202',
            number: 2,
            title: 'Contagion',
            duration: '57m',
            thumbnail: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400&auto=format&fit=crop',
            description: 'As the modified genes spread across the city, society begins to fragment between those who embrace the changes and those who fear them.'
          },
          {
            id: '403-203',
            number: 3,
            title: 'Evolution',
            duration: '59m',
            thumbnail: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=400&auto=format&fit=crop',
            description: 'Thomas discovers that the genetic modifications have developed a form of collective intelligence, raising questions about what new form of life he has inadvertently created.'
          }
        ]
      }
    ]
  },
  {
    id: '404',
    title: 'Fragments',
    description: 'After a mysterious global event causes millions of people to experience vivid memories of lives they never lived, psychologist Dr. Rebecca Chen discovers these "fragments" are actually memories from people\'s future selves. As she helps patients distinguish between past, present, and future, she uncovers a conspiracy to control humanity\'s timeline.',
    releaseYear: '2024',
    rating: 'TV-14',
    seasons: 1,
    episodes: 8,
    genres: ['Drama', 'Mystery', 'Sci-Fi'],
    starRating: 4.6,
    thumbnailUrl: 'https://images.unsplash.com/photo-1460355976672-71c3f0a4bdac?w=600&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1460355976672-71c3f0a4bdac?q=80&w=2000&auto=format&fit=crop',
    creator: 'Sarah Johnson',
    network: 'Rangbaj Network',
    cast: [
      { 
        name: 'Michelle Zhang', 
        character: 'Dr. Rebecca Chen',
        image: 'https://images.unsplash.com/photo-1557296387-5358ad7997bb?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'James Wilson', 
        character: 'Dr. Marcus Reed',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Olivia Carter', 
        character: 'Agent Diana Foster',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop' 
      }
    ],
    relatedShows: [
      { id: '401', title: 'Ethereal', thumbnail: 'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?w=400&auto=format&fit=crop' },
      { id: '402', title: 'Parallax', thumbnail: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=400&auto=format&fit=crop' },
      { id: '405', title: 'Newton\'s Cradle', thumbnail: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?w=400&auto=format&fit=crop' },
    ],
    seasonDetails: [
      {
        number: 1,
        title: 'Season 1',
        episodes: [
          {
            id: '404-101',
            number: 1,
            title: 'The Pulse',
            duration: '55m',
            thumbnail: 'https://images.unsplash.com/photo-1460355976672-71c3f0a4bdac?w=400&auto=format&fit=crop',
            description: 'A mysterious electromagnetic pulse sweeps the globe, leaving millions of people disoriented with memories of events they\'ve never experienced.'
          },
          {
            id: '404-102',
            number: 2,
            title: 'Echoes',
            duration: '52m',
            thumbnail: 'https://images.unsplash.com/photo-1583468991116-9a7d57c05d39?w=400&auto=format&fit=crop',
            description: 'Dr. Rebecca Chen begins working with patients affected by the pulse and notices patterns suggesting these memories come from a coherent timeline.'
          },
          {
            id: '404-103',
            number: 3,
            title: 'Prophecy',
            duration: '56m',
            thumbnail: 'https://images.unsplash.com/photo-1566345984367-57e7414d9a2c?w=400&auto=format&fit=crop',
            description: 'Rebecca discovers that some of the "memories" have begun coming true, revealing they may be glimpses of an actual future.'
          }
        ]
      }
    ]
  },
  {
    id: '405',
    title: 'Newton\'s Cradle',
    description: 'A brilliant but socially awkward physicist discovers that her new experimental particle accelerator can send messages through time—but only to herself, and only 24 hours in either direction. As she uses this ability to solve scientific problems and navigate her personal life, she discovers that changing the past, even slightly, has unpredictable consequences.',
    releaseYear: '2023',
    rating: 'TV-14',
    seasons: 2,
    episodes: 20,
    genres: ['Sci-Fi', 'Drama', 'Comedy'],
    starRating: 4.4,
    thumbnailUrl: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?w=600&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?q=80&w=2000&auto=format&fit=crop',
    creator: 'Daniel Wong',
    network: 'Quantum Media',
    cast: [
      { 
        name: 'Emma Chen', 
        character: 'Dr. Lily Park',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Thomas Rodriguez', 
        character: 'Dr. James Cooper',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Zoe Jackson', 
        character: 'Director Sarah Chen',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&auto=format&fit=crop' 
      }
    ],
    relatedShows: [
      { id: '402', title: 'Parallax', thumbnail: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=400&auto=format&fit=crop' },
      { id: '404', title: 'Fragments', thumbnail: 'https://images.unsplash.com/photo-1460355976672-71c3f0a4bdac?w=400&auto=format&fit=crop' },
      { id: '406', title: 'Quantum Division', thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop' },
    ],
    seasonDetails: [
      {
        number: 1,
        title: 'Season 1',
        episodes: [
          {
            id: '405-101',
            number: 1,
            title: 'Causality',
            duration: '48m',
            thumbnail: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?w=400&auto=format&fit=crop',
            description: 'Dr. Lily Park accidentally discovers that her particle accelerator can send data through time while working late in her lab.'
          },
          {
            id: '405-102',
            number: 2,
            title: 'Feedback Loop',
            duration: '45m',
            thumbnail: 'https://images.unsplash.com/photo-1581091877018-dac6a371d50f?w=400&auto=format&fit=crop',
            description: 'Lily begins experimenting with sending messages to her past self, creating an information loop that accelerates her research.'
          },
          {
            id: '405-103',
            number: 3,
            title: 'Ripple Effect',
            duration: '46m',
            thumbnail: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&auto=format&fit=crop',
            description: 'When Lily uses her time-communication to avoid a personal embarrassment, she discovers that even small changes create unexpected consequences.'
          }
        ]
      },
      {
        number: 2,
        title: 'Season 2',
        episodes: [
          {
            id: '405-201',
            number: 1,
            title: 'Temporal Extension',
            duration: '52m',
            thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop',
            description: 'After modifying her equipment, Lily extends her temporal range to 48 hours, opening up new possibilities but also greater risks.'
          },
          {
            id: '405-202',
            number: 2,
            title: 'Divergence',
            duration: '49m',
            thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop',
            description: 'Lily discovers that her communications have created multiple timelines that are now diverging in increasingly dramatic ways.'
          },
          {
            id: '405-203',
            number: 3,
            title: 'Quantum Uncertainty',
            duration: '51m',
            thumbnail: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&auto=format&fit=crop',
            description: 'When Lily receives a message from a future version of herself that she doesn\'t recognize, she questions whether she\'s lost control of her experiment.'
          }
        ]
      }
    ]
  },
  {
    id: '406',
    title: 'Quantum Division',
    description: 'In a future where humanity has colonized the solar system, a team of quantum mechanics discovers that faster-than-light travel is possible—but comes with the unintended consequence of creating divergent timelines. As interplanetary tensions rise over the technology, the team must navigate political intrigue while trying to prevent temporal catastrophe.',
    releaseYear: '2024',
    rating: 'TV-MA',
    seasons: 1,
    episodes: 10,
    genres: ['Sci-Fi', 'Drama', 'Thriller'],
    starRating: 4.8,
    thumbnailUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2000&auto=format&fit=crop',
    creator: 'Elena Rodriguez',
    network: 'Rangbaj Network',
    cast: [
      { 
        name: 'Richard Chen', 
        character: 'Dr. Alexander Zhao',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Amara Osei', 
        character: 'Dr. Imani Okafor',
        image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Marcus Taylor', 
        character: 'General Victor Hayes',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop' 
      }
    ],
    relatedShows: [
      { id: '402', title: 'Parallax', thumbnail: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=400&auto=format&fit=crop' },
      { id: '405', title: 'Newton\'s Cradle', thumbnail: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?w=400&auto=format&fit=crop' },
      { id: '407', title: 'Evolution\'s Edge', thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop' },
    ],
    seasonDetails: [
      {
        number: 1,
        title: 'Season 1',
        episodes: [
          {
            id: '406-101',
            number: 1,
            title: 'Breakthrough',
            duration: '62m',
            thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop',
            description: 'Dr. Alexander Zhao and his team achieve a breakthrough in quantum propulsion that could revolutionize interplanetary travel.'
          },
          {
            id: '406-102',
            number: 2,
            title: 'Fracture',
            duration: '58m',
            thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&auto=format&fit=crop',
            description: 'The first test of the quantum drive reveals a disturbing side effect: the creation of divergent timelines that begin to interact with our own.'
          },
          {
            id: '406-103',
            number: 3,
            title: 'Bifurcation',
            duration: '64m',
            thumbnail: 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=400&auto=format&fit=crop',
            description: 'As political factions vie for control of the technology, Alexander discovers evidence that someone is deliberately manipulating the timeline divergences.'
          }
        ]
      }
    ]
  }
];
