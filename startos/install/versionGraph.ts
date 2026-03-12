import { sdk } from '../sdk'

export const versionGraph = sdk.VersionGraph.of({
  '0.1.0': {
    install: sdk.Migration.of({ down: null }),
  },
})
