import { sdk } from '../sdk'

export const uninit = sdk.setupUninit(async ({ effects }) => {
  console.info('Tetris uninitialized')
})
