import BigNumber from 'bignumber.js'
import _ from 'lodash'
import { useCallback } from 'react'
import { BLOCKS_PER_YEAR } from 'config'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import { usePriceFinixUsd, usePriceKethKusdt, usePriceSixUsd, usePriceKlayKusdt, usePriceKethKlay } from 'state/hooks'
import useConverter from 'hooks/useConverter'
import useBlock from 'hooks/useBlock'
import { getBalanceNumber } from 'utils/formatBalance'

const usePoolsList = ({ farms, pools }) => {
  const { convertToPoolAPR } = useConverter()
  const sixPriceUSD = usePriceSixUsd()
  const finixPriceUSD = usePriceFinixUsd()
  const klayPriceUSD = usePriceKlayKusdt()
  const kethPriceUsd = usePriceKethKusdt()
  const ethPriceKlay = usePriceKethKlay()
  const block = useBlock()

  const getStakingTokenFarm = useCallback(
    (pool) => {
      let stakingTokenFarm = farms.find((farm) => farm.tokenSymbol === pool.stakingTokenName)
      if (pool.sousId >= 0 && pool.sousId <= 6) {
        stakingTokenFarm = farms.find((farm) => farm.pid === pool.sousId)
      }
      return stakingTokenFarm
    },
    [farms],
  )

  const priceToKlay = useCallback(
    (tokenName: string, tokenPrice: BigNumber, quoteToken: QuoteToken): BigNumber => {
      const tokenPriceKLAYTN = new BigNumber(tokenPrice)
      if (tokenName === 'KLAY') {
        return new BigNumber(1)
      }
      if (tokenPrice && quoteToken === QuoteToken.KUSDT) {
        return tokenPriceKLAYTN.div(klayPriceUSD)
      }
      return tokenPriceKLAYTN
    },
    [klayPriceUSD],
  )

  const getHighestToken = useCallback((stakingTokenFarm) => {
    let highestToken
    if (stakingTokenFarm.tokenSymbol === QuoteToken.SIX) {
      highestToken = stakingTokenFarm.tokenAmount
    } else if (stakingTokenFarm.quoteTokenSymbol === QuoteToken.SIX) {
      highestToken = stakingTokenFarm.quoteTokenAmount
    } else if (stakingTokenFarm.tokenAmount > stakingTokenFarm.quoteTokenAmount) {
      highestToken = stakingTokenFarm.tokenAmount
    } else {
      highestToken = stakingTokenFarm.quoteTokenAmount
    }
    return highestToken
  }, [])

  const getKlayBundle = useCallback((stakingTokenFarm) => {
    return (stakingTokenFarm.bundleRewards || []).find((br) => br.rewardTokenInfo.name === QuoteToken.WKLAY)
  }, [])

  const getTotalValue = useCallback(
    (currentTotalStaked, stakingTokenFarm) => {
      let totalValue = new BigNumber(currentTotalStaked)
      if (stakingTokenFarm.quoteTokenSymbol === QuoteToken.KLAY) {
        totalValue = klayPriceUSD.times(new BigNumber(currentTotalStaked))
      }
      if (stakingTokenFarm.quoteTokenSymbol === QuoteToken.FINIX) {
        totalValue = finixPriceUSD.times(new BigNumber(currentTotalStaked))
      }
      if (stakingTokenFarm.quoteTokenSymbol === QuoteToken.KETH) {
        totalValue = kethPriceUsd.times(new BigNumber(currentTotalStaked))
      }
      if (stakingTokenFarm.quoteTokenSymbol === QuoteToken.SIX) {
        totalValue = sixPriceUSD.times(new BigNumber(currentTotalStaked))
      }
      return totalValue
    },
    [klayPriceUSD, finixPriceUSD, kethPriceUsd, sixPriceUSD],
  )

  const getPoolsList = useCallback(() => {
    return pools.map((pool) => {
      const isKlayPool = pool.poolCategory === PoolCategory.KLAYTN
      const rewardTokenFarm = farms.find((f) => f.tokenSymbol === pool.tokenName)
      const stakingTokenFarm = getStakingTokenFarm(pool)

      // tmp mulitplier to support ETH farms
      // Will be removed after the price api
      const tempMultiplier = stakingTokenFarm?.quoteTokenSymbol === 'KETH' ? ethPriceKlay : 1

      // /!\ Assume that the farm quote price is KLAY
      const stakingTokenPriceInKLAY = isKlayPool
        ? new BigNumber(1)
        : new BigNumber(stakingTokenFarm?.tokenPriceVsQuote).times(tempMultiplier)
      const rewardTokenPriceInKLAY = priceToKlay(
        pool.tokenName,
        rewardTokenFarm?.tokenPriceVsQuote,
        rewardTokenFarm?.quoteTokenSymbol,
      )

      const totalRewardPricePerYear = rewardTokenPriceInKLAY.times(pool.tokenPerBlock).times(BLOCKS_PER_YEAR)
      const totalStakingTokenInPool = stakingTokenPriceInKLAY.times(getBalanceNumber(pool.totalStaked))
      let apy = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
      const totalLP = new BigNumber(stakingTokenFarm.lpTotalSupply).div(new BigNumber(10).pow(18))
      const highestToken = getHighestToken(stakingTokenFarm)
      const tokenPerLp = new BigNumber(totalLP).div(new BigNumber(highestToken))
      const priceUsdTemp = tokenPerLp.times(2).times(new BigNumber(sixPriceUSD))
      const estimatePrice = priceUsdTemp.times(new BigNumber(pool.totalStaked).div(new BigNumber(10).pow(18)))

      let klayApy = new BigNumber(0)
      switch (pool.sousId) {
        case 0: {
          const totalRewardPerBlock = new BigNumber(stakingTokenFarm.finixPerBlock)
            .times(stakingTokenFarm.BONUS_MULTIPLIER)
            .div(new BigNumber(10).pow(18))
          const finixRewardPerBlock = totalRewardPerBlock.times(stakingTokenFarm.poolWeight)
          const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)
          const currentTotalStaked = getBalanceNumber(pool.totalStaked)
          apy = finixRewardPerYear.div(currentTotalStaked).times(100)
          if ((stakingTokenFarm.bundleRewards || []).length > 0) {
            const klayBundle = getKlayBundle(stakingTokenFarm)
            if (klayBundle) {
              // @ts-ignore
              const klayRewardPerBlock = new BigNumber([klayBundle.rewardPerBlock]).div(new BigNumber(10).pow(18))
              const klayRewardPerYear = klayRewardPerBlock.times(BLOCKS_PER_YEAR)
              const yieldValue = klayPriceUSD.times(klayRewardPerYear)
              const totalValue = getTotalValue(currentTotalStaked, stakingTokenFarm)
              klayApy = yieldValue.div(totalValue).times(100)
            }
          }
          break
        }
        case 1: {
          const totalRewardPerBlock = new BigNumber(stakingTokenFarm.finixPerBlock)
            .times(stakingTokenFarm.BONUS_MULTIPLIER)
            .div(new BigNumber(10).pow(18))
          const finixRewardPerBlock = totalRewardPerBlock.times(stakingTokenFarm.poolWeight)
          const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)
          const currentTotalStaked = getBalanceNumber(pool.totalStaked)
          const finixInSix = new BigNumber(currentTotalStaked).times(sixPriceUSD).div(finixPriceUSD)
          apy = finixRewardPerYear.div(finixInSix).times(100)
          if ((stakingTokenFarm.bundleRewards || []).length > 0) {
            const klayBundle = getKlayBundle(stakingTokenFarm)
            if (klayBundle) {
              // @ts-ignore
              const klayRewardPerBlock = new BigNumber([klayBundle.rewardPerBlock]).div(new BigNumber(10).pow(18))
              const klayRewardPerYear = klayRewardPerBlock.times(BLOCKS_PER_YEAR)
              const yieldValue = klayPriceUSD.times(klayRewardPerYear)
              const totalValue = getTotalValue(currentTotalStaked, stakingTokenFarm)
              klayApy = yieldValue.div(totalValue).times(100)
            }
          }
          break
        }
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        default:
          break
      }
      const finixApy = apy
      const sumApy = BigNumber.sum(finixApy, klayApy)
      return {
        ...pool,
        isFinished: pool.sousId === 0 || pool.sousId === 1 ? false : pool.isFinished || block > pool.endBlock,
        apy: sumApy,
        farm: stakingTokenFarm,
        apyValue: convertToPoolAPR(sumApy),
        totalStakedValue: getBalanceNumber(pool.totalStaked),
      }
    })
  }, [
    block,
    ethPriceKlay,
    farms,
    finixPriceUSD,
    getHighestToken,
    getKlayBundle,
    getStakingTokenFarm,
    getTotalValue,
    klayPriceUSD,
    pools,
    priceToKlay,
    sixPriceUSD,
    convertToPoolAPR,
  ])

  return !_.compact(pools.map((pool) => pool.totalStaked)).length ? [] : getPoolsList()
}

export default usePoolsList