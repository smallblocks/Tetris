import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'tetris',
  title: 'Tetris',
  license: 'MIT',
  wrapperRepo: 'https://github.com/smallblocks/tetris',
  upstreamRepo: 'https://github.com/smallblocks/tetris',
  supportSite: 'https://github.com/smallblocks/tetris/issues',
  marketingSite: 'https://github.com/smallblocks/tetris',
  donationUrl: null,
  docsUrl: 'https://github.com/smallblocks/tetris#readme',
  description: {
    short: 'Classic Tetris for SATSCADE',
    long: `The classic block-stacking puzzle game for your sovereign arcade.

Clear lines, score points, and compete for high scores. Features keyboard and touch controls, ghost piece preview, and level progression.

Requires SATSCADE to be installed first.`,
  },
  volumes: ['main'],
  images: {
    main: {
      source: { dockerTag: 'localhost/tetris:latest' },
      arch: ['x86_64', 'aarch64'],
    },
  },
  alerts: {
    install: 'SATSCADE must be installed first',
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    satscade: {
      description: 'SATSCADE arcade launcher',
      optional: false,
    },
  },
})
