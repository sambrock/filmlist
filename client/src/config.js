module.exports = {
  site: {
    defaultTitle: 'FILMLIST',
  },

  tmdbImageUrl: {
    poster: 'https://image.tmdb.org/t/p/w300_and_h450_bestv2',
    backdrop: 'https://image.tmdb.org/t/p/w500',
    backdropLarge: 'https://image.tmdb.org/t/p/original',
    profile: 'https://www.themoviedb.org/t/p/w138_and_h175_face',
  },

  springConfig: { velocity: 0, clamp: true, tension: 150 },
  springConfigFast: { velocity: 100, clamp: true, tension: 350 },

  userActions: [
    { id: 1, text: 'in watchlist', icon: 'add' },
    { id: 2, text: 'seen', icon: 'check' },
    { id: 3, text: 'not interested', icon: 'not_interested' },
    { id: 4, text: 'removed', icon: 'clear' },
  ],

  backdrops: {
    register: [
      { movie: 'Paris, Texas', year: 1984, director: 'Wim Wenders', backdropPath: '/2834YQ1Zq8UP6fwJIVZtnhYU0Cs.jpg' },
      {
        movie: 'Portrait of a Lady on Fire',
        year: 2019,
        director: 'Céline Sciamma',
        backdropPath: '/xhuGwXvm5o2G9ms9YxP23NXjbl7.jpg',
      },
      {
        movie: 'The Empire Strikes Back',
        year: 1980,
        director: 'Irvin Kershner',
        backdropPath: '/azIbQpeKKNF9r85lBSRrNnMK0Si.jpg',
      },
      {
        movie: 'A Clockwork Orange',
        year: 1971,
        director: 'Stankley Kubrick',
        backdropPath: '/a6r0DnAQdnR0758H1V4tbhHdB8Q.jpg',
      },
      { movie: 'Moonlight', year: 2016, director: 'Barry Jenkins', backdropPath: '/A9KPbYTQvWsp51Lgz85ukVkFrKf.jpg' },
    ],
    login: [
      {
        movie: 'Mulholland Drive',
        year: 2001,
        director: 'David Lynch',
        backdropPath: '/91KNvuQXrWq5vehtQpciCOiOyJe.jpg',
      },
      {
        movie: 'Seven Samurai',
        year: 1954,
        director: 'Akira Kurosawa',
        backdropPath: '/sJNNMCc6B7KZIY3LH3JMYJJNH5j.jpg',
      },
      {
        movie: 'The Grand Budapest Hotel',
        year: 2013,
        director: 'Wes Anderson',
        backdropPath: '/5vPW6MPAyCFd84FEQQgtPDmVDPQ.jpg',
      },
      { movie: 'Hot Fuzz', year: 2007, director: 'Edgar Wright', backdropPath: '/s0GxC0QXr2sOVXOokbydC2g0ZhF.jpg' },
      {
        movie: 'There Will Be Blood',
        year: 2007,
        director: 'Paul Thomas Anderson',
        backdropPath: '/xFuRZtuTbTY3S1QLY8Y9XYH1JCk.jpg',
      },
      { movie: 'Little Women', year: 2019, director: 'Greta Gerwig', backdropPath: '/3uTxPIdVEXxHpsHOHdJC24QebBV.jpg' },
      {
        movie: '2001: A Space Odyssey',
        year: 1968,
        director: 'Stanley Kubrick',
        backdropPath: '/czrTZnZgSwtIofk0UYrRMicVgHB.jpg',
      },
    ],
  },

  transitions: {
    default: { ease: [0.43, 0.13, 0.23, 0.96] },
    movieDetailsVariant: {
      hidden: { y: 0 },
      show: { y: 0, transition: { staggerChildren: 0.1, staggerDirection: 1 } },
    },
    movieDetailsChildren: {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] } },
    },
  },
};
