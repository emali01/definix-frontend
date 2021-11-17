import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { useFarmFromSymbol, useFarmUser } from 'state/hooks'
import useConverter from 'hooks/useConverter'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import {
  Flex,
  Card,
  CardBody,
  CardRibbon,
  IconButton,
  Box,
  ArrowBottomGIcon,
  ArrowTopGIcon,
  Divider,
  ColorStyles,
  useMatchBreakpoints,
} from 'definixswap-uikit'
import CardHeading from './CardHeading'
// import CardHeadingAccordion from './CardHeadingAccordion'
import { TotalLiquiditySection, MyBalanceSection, EarningsSection } from './DetailsSection'
import HarvestActionAirDrop from './HarvestActionAirDrop'
import StakeAction from './StakeAction'
import LinkListSection from './LinkListSection'
import { FarmCardProps } from './types'

const FarmCard: React.FC<FarmCardProps> = ({
  farm,
  myBalancesInWallet,
  klaytn,
  removed,
  account,
  onSelectAddLP,
  onSelectRemoveLP,
}) => {
  const { convertToPriceFromToken, convertToUSD } = useConverter()
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const [isOpenAccordion, setIsOpenAccordion] = useState(false)

  const lpTokenName = useMemo(() => {
    return (
      farm.lpSymbol &&
      farm.lpSymbol
        .toUpperCase()
        .replace(/(DEFINIX)|(LP)/g, '')
        .trim()
    )
  }, [farm.lpSymbol])

  const { pid } = useFarmFromSymbol(farm.lpSymbol)
  const { earnings, tokenBalance, stakedBalance, allowance } = useFarmUser(pid)

  const addLiquidityUrl = useMemo(() => {
    const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses } = farm
    const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses })
    return `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  }, [farm])

  const getTokenPrice = useCallback(
    (token) => {
      return convertToPriceFromToken(token, farm.quoteTokenSymbol)
    },
    [farm.quoteTokenSymbol, convertToPriceFromToken],
  )
  /**
   * total liquidity
   */
  const totalLiquidity: number = useMemo(() => farm.totalLiquidityValue, [farm.totalLiquidityValue])
  const totalLiquidityUSD = useMemo(() => convertToUSD(totalLiquidity), [totalLiquidity, convertToUSD])
  /**
   * my liquidity
   */
  const myLiquidity: BigNumber = useMemo(() => {
    const { lpTotalInQuoteToken, lpTotalSupply, quoteTokenBlanceLP, quoteTokenDecimals } = farm
    if (!lpTotalInQuoteToken) {
      return new BigNumber(0)
    }
    const ratio = new BigNumber(stakedBalance).div(new BigNumber(lpTotalSupply))
    const stakedTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
      .div(new BigNumber(10).pow(quoteTokenDecimals))
      .times(ratio)
      .times(new BigNumber(2))
    return getTokenPrice(stakedTotalInQuoteToken)
  }, [farm, stakedBalance, getTokenPrice])
  const myLiquidityUSD = useMemo(() => {
    return convertToUSD(myLiquidity)
  }, [convertToUSD, myLiquidity])

  const renderCardHeading = useCallback(
    () => <CardHeading farm={farm} lpLabel={lpTokenName} removed={removed} addLiquidityUrl={addLiquidityUrl} />,
    [addLiquidityUrl, farm, lpTokenName, removed],
  )

  const renderIconButton = useCallback(
    () => (
      <IconButton
        variant="transparent"
        startIcon={isOpenAccordion ? <ArrowTopGIcon /> : <ArrowBottomGIcon />}
        onClick={() => setIsOpenAccordion(!isOpenAccordion)}
      />
    ),
    [isOpenAccordion],
  )

  const renderTotalLiquiditySection = useCallback(
    () => <TotalLiquiditySection title="Total Liquidity" totalLiquidity={totalLiquidity} />,
    [totalLiquidity],
  )
  const renderMyBalanceSection = useCallback(
    () => <MyBalanceSection title="Balance" myBalances={myBalancesInWallet} />,
    [myBalancesInWallet],
  )
  const renderEarningsSection = useCallback(
    () => <EarningsSection title="Earned" tokenName={lpTokenName} earnings={earnings} />,
    [lpTokenName, earnings],
  )

  /**
   * stake action
   */
  const isApproved = useMemo(() => {
    return account && allowance && allowance.isGreaterThan(0)
  }, [account, allowance])
  const renderStakeAction = useCallback(
    (className?: string) => (
      <StakeAction
        isApproved={isApproved}
        myLiquidity={stakedBalance}
        myLiquidityUSD={myLiquidityUSD}
        farm={farm}
        klaytn={klaytn}
        account={account}
        className={className}
        onPresentDeposit={() => {
          onSelectAddLP({
            pid,
            tokenName: lpTokenName,
            tokenBalance,
            addLiquidityUrl,
            totalLiquidity: totalLiquidityUSD,
            myLiquidity: stakedBalance,
            myLiquidityUSD,
            farm,
            removed,
          })
        }}
        onPresentWithdraw={() => {
          onSelectRemoveLP({
            pid,
            tokenName: lpTokenName,
            tokenBalance,
            addLiquidityUrl,
            totalLiquidity: totalLiquidityUSD,
            myLiquidity: stakedBalance,
            myLiquidityUSD,
            farm,
            removed,
          })
        }}
      />
    ),
    [
      account,
      klaytn,
      farm,
      isApproved,
      stakedBalance,
      lpTokenName,
      pid,
      tokenBalance,
      addLiquidityUrl,
      totalLiquidityUSD,
      myLiquidityUSD,
      onSelectAddLP,
      onSelectRemoveLP,
      removed,
    ],
  )
  /**
   * harvest action
   */
  const renderHarvestActionAirDrop = useCallback(
    () => <HarvestActionAirDrop isMobile={isMobile} pid={pid} earnings={earnings} />,
    [isMobile, earnings, pid],
  )

  const renderLinkSection = useCallback(
    () => <LinkListSection isMobile={isMobile} lpAddresses={farm.lpAddresses} />,
    [isMobile, farm.lpAddresses],
  )

  useEffect(() => {
    setIsOpenAccordion(false)
  }, [])

  if (isMobile) {
    return (
      // <HorizontalMobileStyle className="mb-3">
      //   <CardHeadingAccordion
      //     farm={farm}
      //     lpLabel={lpTokenName}
      //     removed={removed}
      //     addLiquidityUrl={addLiquidityUrl}
      //     finixPrice={finixPrice}
      //     className=""
      //     isOpenAccordion={isOpenAccordion}
      //     setIsOpenAccordion={setIsOpenAccordion}
      //   />
      //   <div className={`accordion-content ${isOpenAccordion ? 'show' : 'hide'}`}>
      //     {renderStakeAction('pa-5')}
      //     {/* renderHarvestAction('pa-5') */}
      //     {renderHarvestActionAirDrop('pa-5 pt-0', false)}
      //     {renderDetailsSection('px-5 py-3', false)}
      //   </div>
      // </HorizontalMobileStyle>
      <Card ribbon={<CardRibbon variantColor={ColorStyles.RED} text="new" />} className="mt-s16">
        <CardBody>
          <Flex justifyContent="space-between">
            {renderCardHeading()}
            {renderIconButton()}
          </Flex>
          {renderEarningsSection()}
        </CardBody>
        {isOpenAccordion && (
          <Box backgroundColor={ColorStyles.LIGHTGREY_20} className="px-s20 py-s24">
            {renderHarvestActionAirDrop()}
            <Box className="py-s24">{renderStakeAction()}</Box>
            <Divider />
            <Box className="pt-s24">{renderTotalLiquiditySection()}</Box>
            <Box className="pt-s16">{renderMyBalanceSection()}</Box>
            <Box className="py-s32">{renderLinkSection()}</Box>
          </Box>
        )}
      </Card>
    )
  }

  return (
    <Card ribbon={<CardRibbon variantColor={ColorStyles.RED} text="new" />} className="mt-s16">
      <CardBody>
        <Flex justifyContent="space-between">
          <Box style={{ width: '26%' }}>{renderCardHeading()}</Box>
          <Box style={{ width: '13%' }}>{renderTotalLiquiditySection()}</Box>
          <Box style={{ width: '26%' }} className="mx-s24">
            {renderMyBalanceSection()}
          </Box>
          <Box style={{ width: '22%' }}>{renderEarningsSection()}</Box>
          {renderIconButton()}
        </Flex>
      </CardBody>
      {isOpenAccordion && (
        <Box backgroundColor={ColorStyles.LIGHTGREY_20} className="py-s24 px-s32">
          <Flex justifyContent="space-between">
            <Box style={{ width: '20%' }}>{renderLinkSection()}</Box>
            <Box style={{ width: '40%' }} className="mx-s24">
              {isApproved && renderHarvestActionAirDrop()}
            </Box>
            <Box style={{ width: '30%' }}>{renderStakeAction()}</Box>
          </Flex>
        </Box>
      )}
    </Card>
  )
}

export default FarmCard