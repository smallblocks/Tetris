import { sdk } from './sdk'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const ui = await sdk.ServiceInterface.ui(effects, {
    name: 'Tetris',
    id: 'webui',
    description: 'Play Tetris',
    hasPrimary: true,
    masked: false,
    schemeOverride: null,
    username: null,
  }).addAddress({
    internalPort: 80,
    hostId: 'webui',
    scheme: 'http',
    sslScheme: 'https',
  })

  return [ui]
})
