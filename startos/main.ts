import { sdk } from './sdk'

const webPort = 80

export const main = sdk.setupMain(async ({ effects }) => {
  console.info('Starting Tetris!')

  const subcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'main' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: '/data',
      readonly: false,
    }),
    'tetris-web',
  )

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer,
    exec: {
      command: ['node', 'server.js'],
      env: {
        PORT: '80',
      },
    },
    ready: {
      display: 'Game Ready',
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, webPort, {
          successMessage: 'Tetris is ready',
          errorMessage: 'Tetris is not responding',
        }),
    },
    requires: [],
  })
})
