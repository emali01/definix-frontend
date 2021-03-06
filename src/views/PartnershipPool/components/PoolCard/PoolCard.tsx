import BigNumber from 'bignumber.js'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import { useStakeVelo } from 'hooks/useStake'
import { useSousUnstakeVelo } from 'hooks/useUnstake'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { getAddress } from 'utils/addressHelpers'
import { useMatchBreakpoints } from 'uikit-dev'
import PoolContext from 'views/PartnershipPool/PoolContext'
import DepositModal from '../DepositModal'
import PartnerPoolSash from '../PartnerPoolSash'
import WithdrawModal from '../WithdrawModal'
import CardHeading from './CardHeading'
import CardHeadingAccordion from './CardHeadingAccordion'
import DetailsSection from './DetailsSection'
import HarvestAction from './HarvestAction'
import StakeAction from './StakeAction'
import { PoolCardVeloProps } from './types'
import CountDown from './Countdown'

const CardStyle = styled.div`
  background: ${(props) => props.theme.card.background};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.shadows.elevation1};
`

const VerticalStyle = styled(CardStyle)`
  display: flex;
  position: relative;
  align-self: baseline;
  flex-direction: column;
  justify-content: space-around;
  text-align: center;
`

const HorizontalStyle = styled(CardStyle)`
  display: flex;
  position: relative;
`

const HorizontalMobileStyle = styled(CardStyle)`
  position: relative;

  .accordion-content {
    &.hide {
      display: none;
    }

    &.show {
      display: block;
    }
  }
`

const PoolCard: React.FC<PoolCardVeloProps> = ({ pool, isHorizontal = false, veloAmount = 0, veloId }) => {
  const {
    sousId,
    tokenName,
    stakingTokenName,
    stakingTokenAddress,
    apy,
    tokenDecimals,
    poolCategory,
    totalStaked,
    isFinished,
    userData,
    stakingLimit,
    contractAddress,
    pairPrice,
  } = pool

  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const isOldSyrup = stakingTokenName === QuoteToken.SYRUP

  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const [isOpenAccordion, setIsOpenAccordion] = useState(false)

  const allowance = new BigNumber(userData?.allowance || 0)
  const earnings = useMemo(() => new BigNumber(userData?.pendingReward || 0), [userData?.pendingReward])
  const stakedBalance = useMemo(() => new BigNumber(userData?.stakedBalance || 0), [userData?.stakedBalance])
  const stakingTokenBalance = useMemo(
    () => new BigNumber(userData?.stakingTokenBalance || 0),
    [userData?.stakingTokenBalance],
  )
  const convertedLimit = new BigNumber(stakingLimit).multipliedBy(new BigNumber(10).pow(tokenDecimals))

  const accountHasStakedBalance = stakedBalance?.toNumber() > 0

  const needsApproval = !accountHasStakedBalance && !allowance.toNumber() && !isBnbPool

  const { onPresent } = useContext(PoolContext)

  const { onStake } = useStakeVelo(veloId)
  // const x = useContract()
  const { onUnstake } = useSousUnstakeVelo(veloId)

  const renderCardHeading = useCallback(
    (className?: string) => (
      <CardHeading
        tokenName={tokenName}
        isOldSyrup={isOldSyrup}
        apy={apy}
        isHorizontal={isHorizontal}
        className={className}
        veloId={veloId}
      />
    ),
    [apy, isHorizontal, isOldSyrup, tokenName, veloId],
  )

  const renderDepositModal = useCallback(() => {
    onPresent(
      <DepositModal
        max={stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit) ? convertedLimit : stakingTokenBalance}
        onConfirm={onStake}
        tokenName={stakingLimit ? `${stakingTokenName} (${stakingLimit} max)` : stakingTokenName}
        renderCardHeading={renderCardHeading}
      />,
    )
  }, [convertedLimit, onStake, onPresent, renderCardHeading, stakingLimit, stakingTokenBalance, stakingTokenName])

  const renderWithdrawModal = useCallback(() => {
    onPresent(<WithdrawModal max={stakedBalance} onConfirm={onUnstake} renderCardHeading={renderCardHeading} />)
  }, [onPresent, onUnstake, renderCardHeading, stakedBalance])

  const renderStakeAction = useCallback(
    (className?: string) => (
      <StakeAction
        sousId={sousId}
        isOldSyrup={isOldSyrup}
        tokenName={tokenName}
        stakingTokenAddress={stakingTokenAddress}
        stakedBalance={stakedBalance}
        needsApproval={needsApproval}
        isFinished={isFinished}
        onUnstake={onUnstake}
        onPresentDeposit={renderDepositModal}
        onPresentWithdraw={renderWithdrawModal}
        className={className}
        apolloAddress={getAddress(contractAddress)}
        veloId={veloId}
      />
    ),
    [
      isFinished,
      isOldSyrup,
      needsApproval,
      onUnstake,
      renderDepositModal,
      renderWithdrawModal,
      sousId,
      stakedBalance,
      stakingTokenAddress,
      tokenName,
      contractAddress,
      veloId,
    ],
  )

  const renderHarvestAction = useCallback(
    (className?: string) => (
      <HarvestAction
        sousId={sousId}
        isBnbPool={isBnbPool}
        earnings={earnings}
        tokenDecimals={tokenDecimals}
        needsApproval={needsApproval}
        isOldSyrup={isOldSyrup}
        className={className}
        veloAmount={veloAmount}
        contractAddrss={getAddress(contractAddress)}
        pairPrice={pairPrice.toNumber()}
        veloId={veloId}
      />
    ),
    [
      earnings,
      isBnbPool,
      isOldSyrup,
      veloId,
      needsApproval,
      sousId,
      tokenDecimals,
      veloAmount,
      contractAddress,
      pairPrice,
    ],
  )

  const renderDetailsSection = useCallback(
    (className?: string, isHor?: boolean) => (
      <DetailsSection
        tokenName={tokenName}
        bscScanAddress=""
        totalStaked={totalStaked}
        isHorizontal={isHor}
        className={className}
      />
    ),
    [tokenName, totalStaked],
  )

  useEffect(() => {
    setIsOpenAccordion(false)
  }, [])

  if (isHorizontal) {
    if (isMobile) {
      return (
        <>
          <div style={{ display: 'flex' }}>
            <CountDown showCom={veloId === 2} margin="auto" />
          </div>

          <HorizontalMobileStyle className="mb-3">
            {veloId === 2 && <PartnerPoolSash />}
            <CardHeadingAccordion
              tokenName={tokenName}
              isOldSyrup={isOldSyrup}
              apy={apy}
              className=""
              isOpenAccordion={isOpenAccordion}
              setIsOpenAccordion={setIsOpenAccordion}
              veloId={veloId}
            />

            <div className={`accordion-content ${isOpenAccordion ? 'show' : 'hide'}`}>
              {renderStakeAction('pa-5')}
              {renderHarvestAction('pa-5')}
              {/* {renderHarvestActionAirDrop('pa-5 pt-0', false)} */}
              {renderDetailsSection('px-5 py-3', false)}
            </div>
          </HorizontalMobileStyle>
        </>
      )
    }
    const showCountdown = veloId === 2
    return (
      <div>
        <div style={{ display: 'flex' }}>
          <CountDown showCom={showCountdown} />
        </div>
        <HorizontalStyle className="flex align-stretch px-5 py-6 mb-5">
          {veloId === 2 && <PartnerPoolSash />}
          {renderCardHeading('col-3 pos-static')}

          <div className="col-4 bd-x flex flex-column justify-space-between px-5">
            {renderStakeAction('pb-4')}
            {renderDetailsSection('', true)}
          </div>

          {renderHarvestAction('col-5 pl-5 flex-grow')}
          {/* {renderHarvestActionAirDrop('col-5 pl-5 flex-grow', true)} */}
        </HorizontalStyle>
      </div>
    )
  }
  const showCountdown = veloId === 2
  return (
    <div style={{ margin: 'auto' }}>
      <div style={{ display: 'flex' }}>
        <CountDown showCom={showCountdown} margin="auto" />
      </div>
      <VerticalStyle className="mb-7">
        {veloId === 2 && <PartnerPoolSash />}
        <div className="flex flex-column flex-grow">
          {renderCardHeading('pt-7')}
          {renderStakeAction('pa-5')}
          {renderHarvestAction('pa-5')}
          {/* {renderHarvestActionAirDrop('pa-5 pt-0', false)} */}
        </div>
        {renderDetailsSection('px-5 py-3', false)}
      </VerticalStyle>
    </div>
  )
}

export default PoolCard
