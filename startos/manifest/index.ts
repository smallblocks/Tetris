import { Manifest } from '@start9labs/start-sdk'

export const manifest = {
  id: 'tetris',
  title: 'Tetris',
  version: '0.1.0',
  releaseNotes: 'Initial release - Classic Tetris for SATSCADE',
  license: 'mit',
  wrapperRepo: 'https://github.com/smallblocks/tetris',
  upstreamRepo: 'https://github.com/smallblocks/tetris',
  supportSite: 'https://github.com/smallblocks/tetris/issues',
  marketingSite: 'https://github.com/smallblocks/tetris',
  description: {
    short: 'Classic Tetris for SATSCADE',
    long: 'The classic block-stacking puzzle game. Clear lines, score points, and compete for high scores on your sovereign arcade.',
  },
  assets: [],
  volumes: ['main'],
  images: ['main'],
  dependencies: {
    satscade: {
      description: 'SATSCADE arcade launcher',
      optional: false,
    },
  },
  hardwareRequirements: {
    ram: null,
    arch: null,
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
} satisfies Manifest
