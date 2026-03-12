export const manifest = {
  id: 'tetris' as const,
  title: 'Tetris',
  license: 'MIT',
  wrapperRepo: 'https://github.com/smallblocks/tetris',
  upstreamRepo: 'https://github.com/smallblocks/tetris',
  supportSite: 'https://github.com/smallblocks/tetris/issues',
  marketingSite: 'https://github.com/smallblocks/tetris',
  donationUrl: null,
  description: {
    short: 'Classic Tetris for SATSCADE',
    long: 'The classic block-stacking puzzle game. Clear lines, score points, and compete for high scores on your sovereign arcade.',
  },
  images: {
    main: 'main',
  },
  volumes: {
    main: 'main',
  },
  assets: [],
  dependencies: {
    satscade: {
      description: 'SATSCADE arcade launcher',
      optional: false,
    },
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  hardwareRequirements: {},
}
