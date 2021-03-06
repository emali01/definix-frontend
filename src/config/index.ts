import BigNumber from 'bignumber.js/bignumber'

export const ChainId = {
  MAINNET: parseInt(process.env.REACT_APP_MAINNET_ID || '0') || 0,
  TESTNET: parseInt(process.env.REACT_APP_TESTNET_ID || '0') || 0,
}

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const IS_GENESIS = false
export const FINIX_PER_BLOCK = new BigNumber(1.08)
export const BLOCKS_PER_YEAR = new BigNumber(10512000)
export const BSC_BLOCK_TIME = 3
export const FINIX_POOL_PID = 7
export const BASE_EXCHANGE_URL = 'https://exchange.definix.com'
export const BASE_ADD_LIQUIDITY_URL = `${BASE_EXCHANGE_URL}/#/add`
export const BASE_LIQUIDITY_POOL_URL = `${BASE_EXCHANGE_URL}/#/pool`
export const LOTTERY_MAX_NUMBER_OF_TICKETS = 50
export const LOTTERY_TICKET_PRICE = 1
