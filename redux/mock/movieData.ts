import { Movie } from '../slices/contentSlice';

export const movieData: Movie[] = [
  {
    id: '301',
    title: 'Quantum Resonance',
    description: 'In a world where quantum technology has revolutionized how we perceive reality, one scientist discovers a resonance frequency that allows glimpses into parallel universes. As the boundaries between dimensions blur, she must navigate the consequences of her discovery before the fabric of existence unravels.',
    releaseYear: '2023',
    rating: 'PG-13',
    duration: '2h 15m',
    genres: ['Sci-Fi', 'Drama', 'Thriller', 'Adventure'],
    starRating: 4.8,
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop',
    director: 'Elena Rodriguez',
    studio: 'Rangbaj Studios',
    cast: [
      { 
        name: 'Maya Chen', 
        character: 'Dr. Sophia Lin',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'James Wilson', 
        character: 'Dr. Marcus Webb',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Zoe Thompson', 
        character: 'Eva Reed',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'David Park', 
        character: 'Dr. Alex Zhang',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop' 
      }
    ],
    relatedMovies: [
      { id: '302', title: 'Stellar Odyssey', thumbnail: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=400&auto=format&fit=crop' },
      { id: '303', title: 'Dark Matter', thumbnail: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=400&auto=format&fit=crop' },
      { id: '304', title: 'Nebula\'s Echo', thumbnail: 'https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?w=400&auto=format&fit=crop' },
    ]
  },
  {
    id: '302',
    title: 'Stellar Odyssey',
    description: 'A crew of interstellar explorers embarks on a journey to find humanity\'s new home after Earth becomes uninhabitable. When they discover a potentially habitable planet, they soon realize they\'re not the only intelligent life seeking refuge among the stars.',
    releaseYear: '2024',
    rating: 'PG-13',
    duration: '2h 28m',
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    starRating: 4.6,
    thumbnailUrl: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=600&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?q=80&w=2000&auto=format&fit=crop',
    director: 'Marcus Chen',
    studio: 'Rangbaj Studios',
    cast: [
      { 
        name: 'Thomas Wright', 
        character: 'Captain Elliot Reeves',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Amara Johnson', 
        character: 'Dr. Naomi Keller',
        image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Richard Khan', 
        character: 'Xander Voss',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop' 
      }
    ],
    relatedMovies: [
      { id: '301', title: 'Quantum Resonance', thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop' },
      { id: '303', title: 'Dark Matter', thumbnail: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=400&auto=format&fit=crop' },
      { id: '305', title: 'Aurora\'s Legacy', thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&auto=format&fit=crop' },
    ]
  },
  {
    id: '303',
    title: 'Dark Matter',
    description: 'When a brilliant physicist creates a device that can manipulate dark matter, he inadvertently opens a gateway to a shadow dimension. As strange phenomena begin occurring worldwide, he must team up with his estranged wife to close the breach before our reality is consumed by darkness.',
    releaseYear: '2023',
    rating: 'R',
    duration: '2h 05m',
    genres: ['Sci-Fi', 'Horror', 'Thriller'],
    starRating: 4.3,
    thumbnailUrl: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=600&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=2000&auto=format&fit=crop',
    director: 'Sophia Nolan',
    studio: 'Rangbaj Studios',
    cast: [
      { 
        name: 'Michael Reeves', 
        character: 'Dr. Ethan Reeves',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Emma Chen', 
        character: 'Dr. Lily Reeves',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Omar Washington', 
        character: 'Agent Tyler',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop' 
      }
    ],
    relatedMovies: [
      { id: '301', title: 'Quantum Resonance', thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop' },
      { id: '302', title: 'Stellar Odyssey', thumbnail: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=400&auto=format&fit=crop' },
      { id: '306', title: 'Temporal Paradox', thumbnail: 'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=400&auto=format&fit=crop' },
    ]
  },
  {
    id: '304',
    title: 'Nebula\'s Echo',
    description: 'A lone astronaut returns to Earth after investigating a mysterious nebula, only to discover that decades have passed. As she struggles to find her place in a world that has moved on without her, she begins to exhibit strange abilities connected to the nebula\'s energy.',
    releaseYear: '2024',
    rating: 'PG-13',
    duration: '2h 10m',
    genres: ['Sci-Fi', 'Drama', 'Mystery'],
    starRating: 4.4,
    thumbnailUrl: 'https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?w=600&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?q=80&w=2000&auto=format&fit=crop',
    director: 'Benjamin Reynolds',
    studio: 'Eclipse Films',
    cast: [
      { 
        name: 'Olivia Davis', 
        character: 'Commander Samantha Torres',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Nathan Kim', 
        character: 'Dr. Reid Nakamura',
        image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Grace Jones', 
        character: 'Director Ellen Hayes',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop' 
      }
    ],
    relatedMovies: [
      { id: '301', title: 'Quantum Resonance', thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop' },
      { id: '302', title: 'Stellar Odyssey', thumbnail: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=400&auto=format&fit=crop' },
      { id: '307', title: 'Cosmic Whispers', thumbnail: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&auto=format&fit=crop' },
    ]
  },
  {
    id: '305',
    title: 'Aurora\'s Legacy',
    description: 'In a post-apocalyptic future, the last remnants of humanity survive in a high-tech city called Aurora. When a young engineer discovers that the city\'s AI has been hiding a devastating secret, she must choose between exposing the truth or preserving the fragile peace.',
    releaseYear: '2024',
    rating: 'PG-13',
    duration: '2h 20m',
    genres: ['Sci-Fi', 'Action', 'Drama'],
    starRating: 4.2,
    thumbnailUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop',
    director: 'Li Wei Zhang',
    studio: 'Rangbaj Studios',
    cast: [
      { 
        name: 'Zoe Clark', 
        character: 'Maya Chen',
        image: 'https://images.unsplash.com/photo-1549351512-c5e12b11e283?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Aaron Jones', 
        character: 'Commander Jackson',
        image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Serena Kumar', 
        character: 'ARIA (AI System)',
        image: 'https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?w=400&auto=format&fit=crop' 
      }
    ],
    relatedMovies: [
      { id: '302', title: 'Stellar Odyssey', thumbnail: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=400&auto=format&fit=crop' },
      { id: '307', title: 'Cosmic Whispers', thumbnail: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&auto=format&fit=crop' },
      { id: '308', title: 'Digital Horizon', thumbnail: 'https://images.unsplash.com/photo-1558346547-4439467bd1d5?w=400&auto=format&fit=crop' },
    ]
  },
  {
    id: '306',
    title: 'Temporal Paradox',
    description: 'A brilliant physicist invents a device that allows her to send messages to her past self. As she tries to prevent a personal tragedy, she inadvertently creates a series of increasingly dangerous temporal paradoxes that threaten to unravel the timeline.',
    releaseYear: '2022',
    rating: 'PG-13',
    duration: '1h 58m',
    genres: ['Sci-Fi', 'Thriller', 'Mystery'],
    starRating: 4.5,
    thumbnailUrl: 'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=600&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?q=80&w=2000&auto=format&fit=crop',
    director: 'James Carter',
    studio: 'Time Paradox Films',
    cast: [
      { 
        name: 'Isabella Morrison', 
        character: 'Dr. Emma Reynolds',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Marcus Lee', 
        character: 'Dr. Jacob Tran',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Caroline Diaz', 
        character: 'Professor Olivia Chen',
        image: 'https://images.unsplash.com/photo-1557296387-5358ad7997bb?w=400&auto=format&fit=crop' 
      }
    ],
    relatedMovies: [
      { id: '301', title: 'Quantum Resonance', thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop' },
      { id: '303', title: 'Dark Matter', thumbnail: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=400&auto=format&fit=crop' },
      { id: '309', title: 'Time Fracture', thumbnail: 'https://images.unsplash.com/photo-1603574670812-d24560880210?w=400&auto=format&fit=crop' },
    ]
  },
  {
    id: '307',
    title: 'Cosmic Whispers',
    description: 'When a radio astronomer detects a strange pattern in signals from deep space, she becomes convinced they contain a message from an alien civilization. As she races to decode the message, government agencies and private corporations compete to control what might be humanity\'s first contact with extraterrestrial intelligence.',
    releaseYear: '2023',
    rating: 'PG-13',
    duration: '2h 12m',
    genres: ['Sci-Fi', 'Drama', 'Mystery'],
    starRating: 4.7,
    thumbnailUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2000&auto=format&fit=crop',
    director: 'Nathan Rodriguez',
    studio: 'Rangbaj Studios',
    cast: [
      { 
        name: 'Sophia Turner', 
        character: 'Dr. Ellie Sagan',
        image: 'https://images.unsplash.com/photo-1557296387-5358ad7997bb?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Daniel Washington', 
        character: 'Dr. Marcus Chen',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Rachel Kim', 
        character: 'Director Anna Hayes',
        image: 'https://images.unsplash.com/photo-1532910404247-7ee9488d7292?w=400&auto=format&fit=crop' 
      }
    ],
    relatedMovies: [
      { id: '304', title: 'Nebula\'s Echo', thumbnail: 'https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?w=400&auto=format&fit=crop' },
      { id: '305', title: 'Aurora\'s Legacy', thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&auto=format&fit=crop' },
      { id: '308', title: 'Digital Horizon', thumbnail: 'https://images.unsplash.com/photo-1558346547-4439467bd1d5?w=400&auto=format&fit=crop' },
    ]
  },
  {
    id: '308',
    title: 'Digital Horizon',
    description: 'In a future where people spend most of their lives in a hyper-realistic virtual world, a brilliant programmer discovers a glitch that threatens to collapse the entire system. As the lines between reality and simulation blur, she must navigate both worlds to prevent digital and real-world catastrophe.',
    releaseYear: '2024',
    rating: 'PG-13',
    duration: '2h 24m',
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    starRating: 4.3,
    thumbnailUrl: 'https://images.unsplash.com/photo-1558346547-4439467bd1d5?w=600&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1558346547-4439467bd1d5?q=80&w=2000&auto=format&fit=crop',
    director: 'David Reynolds',
    studio: 'Digital Frontier Studios',
    cast: [
      { 
        name: 'Ava Johnson', 
        character: 'Zoe Moore',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Lucas Zhang', 
        character: 'Kye Parker',
        image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Gabriel Cruz', 
        character: 'Nexus (AI Entity)',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop' 
      }
    ],
    relatedMovies: [
      { id: '305', title: 'Aurora\'s Legacy', thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&auto=format&fit=crop' },
      { id: '307', title: 'Cosmic Whispers', thumbnail: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&auto=format&fit=crop' },
      { id: '309', title: 'Time Fracture', thumbnail: 'https://images.unsplash.com/photo-1603574670812-d24560880210?w=400&auto=format&fit=crop' },
    ]
  },
  {
    id: '309',
    title: 'Time Fracture',
    description: 'When a catastrophic experiment at a particle accelerator creates fractures in time, a team of scientists finds themselves navigating a world where different time periods overlap. They must seal the fractures before history itself is permanently altered.',
    releaseYear: '2023',
    rating: 'PG-13',
    duration: '2h 08m',
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    starRating: 4.1,
    thumbnailUrl: 'https://images.unsplash.com/photo-1603574670812-d24560880210?w=600&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1603574670812-d24560880210?q=80&w=2000&auto=format&fit=crop',
    director: 'Jessica Park',
    studio: 'Rangbaj Studios',
    cast: [
      { 
        name: 'Nathan Hughes', 
        character: 'Dr. Daniel Foster',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Emily Chen', 
        character: 'Dr. Amara Patel',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Marcus Jones', 
        character: 'Colonel Raymond Davis',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop' 
      }
    ],
    relatedMovies: [
      { id: '301', title: 'Quantum Resonance', thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop' },
      { id: '306', title: 'Temporal Paradox', thumbnail: 'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=400&auto=format&fit=crop' },
      { id: '308', title: 'Digital Horizon', thumbnail: 'https://images.unsplash.com/photo-1558346547-4439467bd1d5?w=400&auto=format&fit=crop' },
    ]
  },
  {
    id: '310',
    title: 'Neon Dynasty',
    description: 'In a cyberpunk megacity dominated by powerful corporations, a street-smart hacker uncovers a conspiracy that could change the balance of power. With the help of a renegade AI, she navigates the dangerous underworld of cyber-enhanced gangs and corporate assassins to expose the truth.',
    releaseYear: '2024',
    rating: 'R',
    duration: '2h 18m',
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    starRating: 4.4,
    thumbnailUrl: 'https://images.unsplash.com/photo-1545586768-8a1591bd5eb8?w=600&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1545586768-8a1591bd5eb8?q=80&w=2000&auto=format&fit=crop',
    director: 'Ryu Tanaka',
    studio: 'Neon Edge Films',
    cast: [
      { 
        name: 'Mirai Zhang', 
        character: 'Jin "Cipher" Lee',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Marcus Reed', 
        character: 'Dexter "Ghost" Gray',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop' 
      },
      { 
        name: 'Olivia Chen', 
        character: 'EVA (AI System)',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop' 
      }
    ],
    relatedMovies: [
      { id: '305', title: 'Aurora\'s Legacy', thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&auto=format&fit=crop' },
      { id: '308', title: 'Digital Horizon', thumbnail: 'https://images.unsplash.com/photo-1558346547-4439467bd1d5?w=400&auto=format&fit=crop' },
      { id: '311', title: 'Synth Revolution', thumbnail: 'https://images.unsplash.com/photo-1501529301789-b48c1975542a?w=400&auto=format&fit=crop' },
    ]
  }
];
