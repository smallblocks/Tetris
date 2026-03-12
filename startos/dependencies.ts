import { sdk } from './sdk'

// Depends on SATSCADE arcade launcher
export const setDependencies = sdk.setupDependencies(async () => ({
  satscade: {
    kind: 'running',
    versionRange: '*',
    healthChecks: [],
  },
}))
