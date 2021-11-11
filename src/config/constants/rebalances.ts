import { RebalanceConfig } from './types'
import { BTCB, ETH } from './tokens'

export const customRouter = {
  definix: {
    56: process.env.REACT_APP_ROUTER_ADDRESS_MAINNET,
    97: process.env.REACT_APP_ROUTER_ADDRESS_TESTNET,
  },
  pancake: {
    56: process.env.REACT_APP_PANCAKEV2_ROUTER_ADDRESS_MAINNET,
    97: process.env.REACT_APP_PANCAKEV2_ROUTER_ADDRESS_TESTNET,
  },
  apeswap: {
    56: process.env.REACT_APP_APESWAP_ROUTER_ADDRESS_MAINNET,
    97: process.env.REACT_APP_APESWAP_ROUTER_ADDRESS_TESTNET,
  },
}

export const customFactory = {
  definix: {
    56: process.env.REACT_APP_MAINNET_FACTORY_ADDRESS,
    97: process.env.REACT_APP_TESTNET_FACTORY_ADDRESS,
  },
  pancake: {
    56: process.env.REACT_APP_MAINNET_PANCAKEV2_FACTORY_ADDRESS,
    97: process.env.REACT_APP_TESTNET_PANCAKEV2_FACTORY_ADDRESS,
  },
  apeswap: {
    56: process.env.REACT_APP_MAINNET_APESWAP_FACTORY_ADDRESS,
    97: process.env.REACT_APP_TESTNET_APESWAP_FACTORY_ADDRESS,
  },
}

export const customInitCodeHash = {
  definix: {
    56: process.env.REACT_APP_MAINNET_INIT_CODE_HASH,
    97: process.env.REACT_APP_TESTNET_INIT_CODE_HASH,
  },
  pancake: {
    56: process.env.REACT_APP_MAINNET_PANCAKEV2_INIT_CODE_HASH,
    97: process.env.REACT_APP_TESTNET_PANCAKEV2_INIT_CODE_HASH,
  },
  apeswap: {
    56: process.env.REACT_APP_MAINNET_APESWAP_INIT_CODE_HASH,
    97: process.env.REACT_APP_TESTNET_APESWAP_INIT_CODE_HASH,
  },
}

const rebalances: RebalanceConfig[] = [
  {
    title: 'Bullish Giant',
    description: 'xxxxxdescriptionxxxxxxxx',
    fullDescription: 'xxxxxx full descriptionxxxxxxxx',
    icon: ['/images/vaults/satoshi_1.png', '/images/vaults/satoshi_2.png'],
    address: {
      56: '0xF71f0EA92957ef3916E9AE46e8DA295f437eACE9',
      97: '0xEF15cF01E344CfA4BaCa336c5f0607a8D55D12B8',
    },
    router: [customRouter.definix, customRouter.definix],
    factory: [customFactory.definix, customFactory.definix],
    initCodeHash: [customInitCodeHash.definix, customInitCodeHash.definix],
    fee: {
      management: 0.2,
      buyback: 1.5,
      bounty: 0.3,
    },
    ratio: [
      {
        symbol: 'BTCB',
        value: 70,
        color: '#ef9244',
        address: BTCB,
      },
      {
        symbol: 'ETH',
        value: 30,
        color: '#6D6D6D',
        address: ETH,
      },
    ],
    factsheet: {
      name: 'Satoshi and Friends',
      inceptionDate: '',
      manager: '',
      vault: '',
      management: '',
      finixBuyBackFee: '',
      bountyFee: '',
    },
  },
]

export default rebalances
