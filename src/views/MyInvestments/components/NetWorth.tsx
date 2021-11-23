import BigNumber from 'bignumber.js'
import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import _ from 'lodash'
import styled from 'styled-components'

import { BLOCKS_PER_YEAR } from 'config'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import { getAddress } from 'utils/addressHelpers'
import useBlock from 'hooks/useBlock'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import {
  useBalances,
  useRebalances,
  useRebalanceBalances,
  useFarms,
  useFarmsIsFetched,
  useRebalancesIsFetched,
  useWalletFetched,
  useWalletRebalanceFetched,
  usePools,
  usePoolsIsFetched,
  usePriceFinixUsd,
  usePriceKethKlay,
  usePriceKethKusdt,
  usePriceKlayKusdt,
  usePriceSixUsd,
} from 'state/hooks'
import { Heading, Skeleton, Text } from 'uikit-dev'
import { getBalanceNumber } from 'utils/formatBalance'
import { fetchBalances, fetchRebalanceBalances } from '../../../state/wallet'

import CardValue from './CardValue'
import EarningBoxTemplate from './EarningBoxTemplate'

const StatAll = styled.div`
  padding: 12px 16px;
  margin: 0 8px;
  border-radius: ${({ theme }) => theme.radii.default};
  background: ${({ theme }) => theme.colors.white};

  h2 {
    margin: 4px 0;
  }
`

const StatSkeleton = () => {
  return <Skeleton animation="pulse" variant="rect" height="26px" className="my-1" />
}

const NetWorth = ({ isMobile }) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)

  const { account } = useWallet()
  const rebalances = useRebalances()
  const balances = useBalances(account) || {}
  const rebalanceBalances = useRebalanceBalances(account) || {}
  const stakedRebalances = rebalances.filter(
    (r) =>
      (
        rebalanceBalances[typeof r.address === 'string' ? r.address : getAddress(r.address)] || new BigNumber(0)
      ).toNumber() > 0,
  )
  const isPoolFetched = usePoolsIsFetched()
  const isFarmFetched = useFarmsIsFetched()
  const isRebalanceFetched = useRebalancesIsFetched()
  const isRebalanceBalanceFetched = useWalletRebalanceFetched()
  const isBalanceFetched = useWalletFetched()

  useEffect(() => {
    if (isFarmFetched && isPoolFetched && isRebalanceFetched && isRebalanceBalanceFetched && isBalanceFetched) {
      setIsLoading(false)
    }
  }, [isPoolFetched, isFarmFetched, isRebalanceFetched, isRebalanceBalanceFetched, isBalanceFetched])

  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  useEffect(() => {
    if (account) {
      const addressObject = {}
      rebalances.forEach((rebalance) => {
        const assets = rebalance.ratio
        assets.forEach((a) => {
          addressObject[getAddress(a.address)] = true
        })
      })
      dispatch(
        fetchBalances(account, [
          ...Object.keys(addressObject),
          ...rebalances.map((rebalance) => getAddress(rebalance.address)),
        ]),
      )
      dispatch(fetchRebalanceBalances(account, rebalances))
    }
  }, [dispatch, account, rebalances])

  // Farms
  const farmsLP = useFarms()
  const klayPrice = usePriceKlayKusdt()
  const sixPrice = usePriceSixUsd()
  const finixPrice = usePriceFinixUsd()
  const ethPriceUsd = usePriceKethKusdt()
  const activeFarms = farmsLP.filter((farms) => farms.pid !== 0 && farms.pid !== 1 && farms.multiplier !== '0X')
  const stackedOnlyFarms = activeFarms.filter(
    (farms) => farms.userData && new BigNumber(farms.userData.stakedBalance).isGreaterThan(0),
  )

  // Pools
  const pools = usePools(account)
  const farms = useFarms()
  const sixPriceUSD = usePriceSixUsd()
  const klayPriceUSD = usePriceKlayKusdt()
  const ethPriceKlay = usePriceKethKlay()
  const block = useBlock()

  const priceToKlay = (tokenName: string, tokenPrice: BigNumber, quoteToken: QuoteToken): BigNumber => {
    const tokenPriceKLAYTN = new BigNumber(tokenPrice)
    if (tokenName === 'KLAY') {
      return new BigNumber(1)
    }
    if (tokenPrice && quoteToken === QuoteToken.KUSDT) {
      return tokenPriceKLAYTN.div(klayPriceUSD)
    }
    return tokenPriceKLAYTN
  }

  const poolsWithApy = pools.map((pool) => {
    const isKlayPool = pool.poolCategory === PoolCategory.KLAYTN
    const rewardTokenFarm = farms.find((f) => f.tokenSymbol === pool.tokenName)
    let stakingTokenFarm = farms.find((s) => s.tokenSymbol === pool.stakingTokenName)
    switch (pool.sousId) {
      case 0:
        stakingTokenFarm = farms.find((s) => s.pid === 0)
        break
      case 1:
        stakingTokenFarm = farms.find((s) => s.pid === 1)
        break
      case 2:
        stakingTokenFarm = farms.find((s) => s.pid === 2)
        break
      case 3:
        stakingTokenFarm = farms.find((s) => s.pid === 3)
        break
      case 4:
        stakingTokenFarm = farms.find((s) => s.pid === 4)
        break
      case 5:
        stakingTokenFarm = farms.find((s) => s.pid === 5)
        break
      case 6:
        stakingTokenFarm = farms.find((s) => s.pid === 6)
        break
      default:
        break
    }

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
    const tokenPerLp = new BigNumber(totalLP).div(new BigNumber(highestToken))
    const priceUsdTemp = tokenPerLp.times(2).times(new BigNumber(sixPriceUSD))
    const estimatePrice = priceUsdTemp.times(new BigNumber(pool.totalStaked).div(new BigNumber(10).pow(18)))

    switch (pool.sousId) {
      case 0: {
        const totalRewardPerBlock = new BigNumber(stakingTokenFarm.finixPerBlock)
          .times(stakingTokenFarm.BONUS_MULTIPLIER)
          .div(new BigNumber(10).pow(18))
        const finixRewardPerBlock = totalRewardPerBlock.times(stakingTokenFarm.poolWeight)
        const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)
        const currentTotalStaked = getBalanceNumber(pool.totalStaked)
        apy = finixRewardPerYear.div(currentTotalStaked).times(100)
        break
      }
      case 1: {
        const totalRewardPerBlock = new BigNumber(stakingTokenFarm.finixPerBlock)
          .times(stakingTokenFarm.BONUS_MULTIPLIER)
          .div(new BigNumber(10).pow(18))
        const finixRewardPerBlock = totalRewardPerBlock.times(stakingTokenFarm.poolWeight)
        const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)
        const currentTotalStaked = getBalanceNumber(pool.totalStaked)
        const finixInSix = new BigNumber(currentTotalStaked).times(sixPriceUSD).div(finixPrice)
        apy = finixRewardPerYear.div(finixInSix).times(100)
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
    return {
      ...pool,
      isFinished: pool.sousId === 0 || pool.sousId === 1 ? false : pool.isFinished || block > pool.endBlock,
      apy,
      estimatePrice,
    }
  })

  const stackedOnlyPools = poolsWithApy.filter(
    (pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0),
  )

  // Net Worth
  const getNetWorth = (d) => {
    if (typeof d.ratio === 'object') {
      const thisBalance = d.enableAutoCompound ? rebalanceBalances : balances
      const currentBalance = _.get(thisBalance, getAddress(d.address), new BigNumber(0))
      return currentBalance.times(d.sharedPrice || new BigNumber(0))
    }
    if (typeof d.pid === 'number') {
      // farm
      const stakedBalance = _.get(d, 'userData.stakedBalance', new BigNumber(0))
      const ratio = new BigNumber(stakedBalance).div(new BigNumber(d.lpTotalSupply))
      const stakedTotalInQuoteToken = new BigNumber(d.quoteTokenBlanceLP)
        .div(new BigNumber(10).pow(d.quoteTokenDecimals))
        .times(ratio)
        .times(new BigNumber(2))
      // const displayBalance = rawStakedBalance.toLocaleString()
      let totalValue
      totalValue = stakedTotalInQuoteToken
      if (!d.lpTotalInQuoteToken) {
        totalValue = new BigNumber(0)
      }
      if (d.quoteTokenSymbol === QuoteToken.KLAY) {
        totalValue = klayPrice.times(stakedTotalInQuoteToken)
      }
      if (d.quoteTokenSymbol === QuoteToken.FINIX) {
        totalValue = finixPrice.times(stakedTotalInQuoteToken)
      }
      if (d.quoteTokenSymbol === QuoteToken.KETH) {
        totalValue = ethPriceUsd.times(stakedTotalInQuoteToken)
      }
      if (d.quoteTokenSymbol === QuoteToken.SIX) {
        totalValue = sixPrice.times(stakedTotalInQuoteToken)
      }

      const earningRaw = _.get(d, 'userData.earnings', 0)
      const earning = new BigNumber(earningRaw).div(new BigNumber(10).pow(18))
      const totalEarning = finixPrice.times(earning)
      return new BigNumber(totalValue).plus(totalEarning)
    }
    if (typeof d.sousId === 'number') {
      const stakedBalance = _.get(d, 'userData.stakedBalance', new BigNumber(0))
      const stakedTotal = new BigNumber(stakedBalance).div(new BigNumber(10).pow(18))
      let totalValue
      totalValue = stakedTotal
      if (d.stakingTokenName === QuoteToken.KLAY) {
        totalValue = klayPrice.times(stakedTotal)
      }
      if (d.stakingTokenName === QuoteToken.FINIX) {
        totalValue = finixPrice.times(stakedTotal)
      }
      if (d.stakingTokenName === QuoteToken.KETH) {
        totalValue = ethPriceUsd.times(stakedTotal)
      }
      if (d.stakingTokenName === QuoteToken.SIX) {
        totalValue = sixPrice.times(stakedTotal)
      }
      const earningRaw = _.get(d, 'userData.pendingReward', 0)
      const earning = new BigNumber(earningRaw).div(new BigNumber(10).pow(18))
      const totalEarning = finixPrice.times(earning)
      return new BigNumber(totalValue).plus(totalEarning)
    }
    return new BigNumber(0)
  }

  const worthFarm = stackedOnlyFarms.reduce((all, f) => all + Number(getNetWorth(f)), 0)

  const worthPool = stackedOnlyPools.reduce((all, p) => all + Number(getNetWorth(p)), 0)

  const worthRebalance = stakedRebalances.reduce((all, r) => all + Number(getNetWorth(r)), 0)

  const netWorthList = useMemo(() => {
    return [
      {
        title: t('Farm'),
        price: worthFarm,
      },
      {
        title: t('Pool'),
        price: worthPool,
      },
      {
        title: t('Rebalancing'),
        price: worthRebalance,
      },
      // {
      //   title: t('Long-term Stake'),
      //   value: '100,000,000.123456',
      //   price: '000000',
      // },
    ]
  }, [t, worthFarm, worthPool, worthRebalance])

  return (
    <>
      <EarningBoxTemplate
        isMobile={isMobile}
        hasAccount={!!account}
        total={{
          title: t('Total Deposit'),
          price: netWorthList.reduce((result, item) => result + item.price, 0),
        }}
        valueList={netWorthList}
      />

      {/* <div className="flex">
        <StatAll>
          <Heading color="textSubtle">Net worth</Heading>
          {isLoading ? (
            <Skeleton animation="pulse" variant="rect" height="26px" width="60%" />
          ) : (
            <Heading fontSize="24px !important">
              {(() => {
                const allNetWorth = [...stackedOnlyFarms, ...stackedOnlyPools, ...stakedRebalances].map((f) => {
                  return getNetWorth(f)
                })
                // eslint-disable-next-line
                const totalNetWorth =
                  _.compact(allNetWorth).length > 0
                    ? _.compact(allNetWorth).reduce((fv, sv) => {
                        return fv.plus(sv)
                      })
                    : new BigNumber(0)
                return totalNetWorth && Number(totalNetWorth) !== 0
                  ? `$${Number(totalNetWorth).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                  : '-'
              })()}
            </Heading>
          )}
        </StatAll>
        <div className="flex">
          <StatAll>
            <Text color="textSubtle">Farm</Text>
            {isFarmFetched ? (
              <>
                <Heading fontSize="24px !important" color="textInvert">
                  <CardValue value={worthFarm} lineHeight="1.5" color="textInvert" prefix="$" bold={false} decimals={2} />
                </Heading>
              </>
            ) : (
              <StatSkeleton />
            )}
          </StatAll>
        </div>
        <div className="flex">
          <StatAll>
            <Text color="textSubtle">Pool</Text>
            {isPoolFetched ? (
              <>
                <Heading fontSize="24px !important" color="textInvert">
                  <CardValue value={worthPool} lineHeight="1.5" color="textInvert" prefix="$" bold={false} decimals={2} />
                </Heading>
              </>
            ) : (
              <StatSkeleton />
            )}
          </StatAll>
        </div>
        <div className="flex">
          <StatAll>
            <Text color="textSubtle">Rebalancing</Text>
            {isRebalanceFetched ? (
              <>
                <Heading fontSize="24px !important" color="textInvert">
                  <CardValue
                    value={worthRebalance}
                    lineHeight="1.5"
                    color="textInvert"
                    prefix="$"
                    bold={false}
                    decimals={2}
                  />
                </Heading>
              </>
            ) : (
              <StatSkeleton />
            )}
          </StatAll>
        </div>
      </div> */}
    </>
  )
}

export default NetWorth
