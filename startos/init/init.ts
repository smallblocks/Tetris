import { sdk } from '../sdk'

export const init = sdk.setupInit(async ({ effects }) => {
  console.info('Tetris initialized')
})
