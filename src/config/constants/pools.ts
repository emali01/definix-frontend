import { PoolConfig, QuoteToken, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 1,
    tokenName: 'FINIX',
    stakingTokenName: QuoteToken.FINIX,
    stakingTokenAddress:
      process.env.REACT_APP_CHAIN_ID === '97'
        ? process.env.REACT_APP_FINIX_ADDRESS_TESTNET
        : process.env.REACT_APP_FINIX_ADDRESS_MAINNET,
    contractAddress: {
      97: process.env.REACT_APP_HERODOTUS_TESTNET,
      56: process.env.REACT_APP_HERODOTUS_MAINNET,
    },
    poolCategory: PoolCategory.CORE,
    projectLink: 'https://definix.com/',
    harvest: true,
    tokenPerBlock: '10',
    sortOrder: 1,
    isFinished: false,
    tokenDecimals: 18,
  },
  // {
  //   sousId: 1,
  //   tokenName: 'SIX',
  //   stakingTokenName: QuoteToken.SIX,
  //   stakingTokenAddress:
  //     process.env.REACT_APP_CHAIN_ID === '97'
  //       ? process.env.REACT_APP_SIX_ADDRESS_TESTNET
  //       : process.env.REACT_APP_SIX_ADDRESS_MAINNET,
  //   contractAddress: {
  //     97: process.env.REACT_APP_GENESIS_CONTRACT_ADDRESS_TESTNET,
  //     56: process.env.REACT_APP_GENESIS_CONTRACT_ADDRESS_MAINNET,
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   projectLink: 'https://definix.com/',
  //   harvest: true,
  //   tokenPerBlock: '10',
  //   sortOrder: 1,
  //   isFinished: false,
  //   tokenDecimals: 18,
  // },
  // {
  //   sousId: 2,
  //   tokenName: 'FINIX-SIX',
  //   stakingTokenName: QuoteToken.SIXFINIX,
  //   stakingTokenAddress: '0xC4B4aC94a73aF2a4788acA0204ce0bE779999dC9',
  //   contractAddress: {
  //     97: '0x23335F144Eb74Dd296010dFbf733dB09bA6679e6',
  //     56: '0x23335F144Eb74Dd296010dFbf733dB09bA6679e6',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   projectLink: 'https://definix.com/',
  //   harvest: true,
  //   tokenPerBlock: '10',
  //   sortOrder: 1,
  //   isFinished: false,
  //   tokenDecimals: 18,
  // },
  // {
  //   sousId: 3,
  //   tokenName: 'FINIX-BUSD',
  //   stakingTokenName: QuoteToken.FINIXBUSD,
  //   stakingTokenAddress: '0x9d19afdc03A710cf54f6B3d3764C7d3B26AC892F',
  //   contractAddress: {
  //     97: '0x8A145c660cb0738D0407b32E146B9B08774A278C',
  //     56: '0x8A145c660cb0738D0407b32E146B9B08774A278C',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   projectLink: 'https://definix.com/',
  //   harvest: true,
  //   tokenPerBlock: '10',
  //   sortOrder: 1,
  //   isFinished: false,
  //   tokenDecimals: 18,
  // },
  // {
  //   sousId: 4,
  //   tokenName: 'FINIX-BNB',
  //   stakingTokenName: QuoteToken.FINIXBNB,
  //   stakingTokenAddress: '0xB2A2048de5afb312Fcf076aBf505952c12916f0d',
  //   contractAddress: {
  //     97: '0xB08242d847b15631bd49d914B60B816Fc45007F1',
  //     56: '0xB08242d847b15631bd49d914B60B816Fc45007F1',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   projectLink: 'https://definix.com/',
  //   harvest: true,
  //   tokenPerBlock: '10',
  //   sortOrder: 1,
  //   isFinished: false,
  //   tokenDecimals: 18,
  // },
  // {
  //   sousId: 5,
  //   tokenName: 'SIX-BUSD',
  //   stakingTokenName: QuoteToken.SIXBUSD,
  //   stakingTokenAddress: '0xea79E7d41D143050c23c1E01AC2990a506ef060A',
  //   contractAddress: {
  //     97: '0x1C817C133BB8f0b3826DAdd37338339D75A706Db',
  //     56: '0x1C817C133BB8f0b3826DAdd37338339D75A706Db',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   projectLink: 'https://definix.com/',
  //   harvest: true,
  //   tokenPerBlock: '10',
  //   sortOrder: 1,
  //   isFinished: false,
  //   tokenDecimals: 18,
  // },
  // {
  //   sousId: 6,
  //   tokenName: 'USDT-BUSD',
  //   stakingTokenName: QuoteToken.USDTBUSD,
  //   stakingTokenAddress: '0xC01cF935e122931B688656d5a7bB3f9ab28C83D3',
  //   contractAddress: {
  //     97: '0x1b4AEc66ef4f942dA16845D22cE2656D759D0A15',
  //     56: '0x1b4AEc66ef4f942dA16845D22cE2656D759D0A15',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   projectLink: 'https://definix.com/',
  //   harvest: true,
  //   tokenPerBlock: '10',
  //   sortOrder: 1,
  //   isFinished: false,
  //   tokenDecimals: 18,
  // },
]

export default pools
