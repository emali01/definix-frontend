import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import BigNumber from 'bignumber.js'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Route, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { useRebalanceAddress, useRebalances, useRebalanceBalances } from 'state/hooks'
import { Box, Flex, Text, Toggle, useModal } from 'definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import { getAddress } from 'utils/addressHelpers'

import ListPageHeader from 'components/ListPageHeader'
import NoResultArea from 'components/NoResultArea'
import DisclaimersModal from './components/DisclaimersModal'
import ExploreCard from './components/ExploreCard'
import ExploreDetail from './ExploreDetail'
import Invest from './Invest'
import Withdraw from './Withdraw'

import { fetchBalances, fetchRebalanceBalances } from '../../state/wallet'
import { Rebalance } from '../../state/types'

const FilterWrap = styled(Flex)`
  position: absolute;
  bottom: 0;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.S_28}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    position: relative;
    margin-bottom: ${({ theme }) => theme.spacing.S_16}px;
  }
`

const Explore: React.FC = () => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  const [isInvested, setIsInvested] = useState(false)
  const [selectedRebalance, setSelectedRebalance] = useState<Rebalance | undefined>()
  const rebalances = useRebalances()
  const targetRebalance = useRebalanceAddress(selectedRebalance ? getAddress(selectedRebalance.address) : undefined)
  const dispatch = useDispatch()
  const { account } = useWallet()
  const rebalanceBalances = useRebalanceBalances(account)
  const [onPresentDisclaimersModal] = useModal(<DisclaimersModal isConfirm />, false)
  const withBalance = useMemo(() => {
    return rebalances.map((r) => ({
      ...r,
      balance: rebalanceBalances?.[getAddress(r.address)] || new BigNumber(0),
      // rebalanceBalances?.[getAddress(r.address)] || new BigNumber(0)
    }))
  }, [rebalanceBalances, rebalances])

  const filteredFarms = useMemo(() => {
    return withBalance.filter(({ balance }) => (isInvested ? balance?.toNumber() > 0 : true))
  }, [isInvested, withBalance])

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

  useEffect(() => {
    if (new Date(localStorage.getItem('disclaimerSkipped') || 0).getTime() < new Date().getTime() - 1209600000)
      onPresentDisclaimersModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Route exact path={path}>
        <>
          <Box position="relative">
            <ListPageHeader type="rebalancing" />
            <FilterWrap>
              <Flex alignItems="center">
                <Text textStyle="R_14R" color="deepgrey" mr="S_8">
                  {t('Staked only Farm')}
                </Text>
                <Toggle checked={isInvested} onChange={() => setIsInvested(!isInvested)} />
              </Flex>
            </FilterWrap>
          </Box>

          {filteredFarms?.length ? (
            filteredFarms.map((rebalance) => {
              return (
                <ExploreCard
                  key={rebalance.title}
                  isHorizontal
                  rebalance={rebalance}
                  balance={rebalance.balance}
                  onClickViewDetail={() => {
                    setSelectedRebalance(rebalance)
                  }}
                />
              )
            })
          ) : (
            <NoResultArea useCardLayout message={t('There are no farms in deposit.')} />
          )}
        </>
      </Route>

      <Route exact path={`${path}/detail`}>
        <ExploreDetail rebalance={selectedRebalance && targetRebalance} />
      </Route>

      <Route exact path={`${path}/invest`}>
        <Invest rebalance={selectedRebalance && targetRebalance} />
      </Route>

      <Route exact path={`${path}/withdraw`}>
        <Withdraw rebalance={selectedRebalance && targetRebalance} />
      </Route>
    </>
  )
}

export default Explore
