/* eslint-disable no-nested-ternary */
import React, { useCallback, useMemo } from 'react'
import { Card, CardBody, Divider, Flex, VDivider } from 'definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import CardHeading from './CardHeading'
import RiskOMeter from './RiskOMeter'
import SharePrice from './SharePrice'
import TotalAssetValue from './TotalAssetValue'
import YieldAPR from './YieldAPR'
import TotalValue from './TotalValue'
import Shares from './Shares'

export enum SummaryItem {
  TOTAL_ASSET_VALUE = 'TotalAssetValue',
  YIELD_APR = 'YieldAPR',
  SHARE_PRICE = 'SharePrice',
  SHARE_PRICE_W_YIELD = 'SharePriceWithYield',
  RISK_O_METER = 'RiskOMeter',
  SHARES = 'Shares',
  TOTAL_VALUE = 'TotalValue',
}

interface SummaryCardProp {
  rebalance: any
  items: SummaryItem[]
  isMobile?: boolean
  currentBalanceNumber?: number
  typeB?: boolean
}

const SummaryCard: React.FC<SummaryCardProp> = ({ items, rebalance, currentBalanceNumber, isMobile, typeB }) => {
  const { t } = useTranslation()
  const width = useMemo(() => (typeB ? 'auto' : `${100 / items.length}%`), [items.length, typeB])
  const half = useMemo(() => Math.ceil(items.length / 2), [items.length])

  const renderItem = useCallback(
    (itemType) => {
      if (itemType === SummaryItem.TOTAL_ASSET_VALUE) {
        return <TotalAssetValue value={rebalance.totalAssetValue} small={isMobile} />
      }
      if (itemType === SummaryItem.YIELD_APR) {
        return (
          <YieldAPR
            finixRewardPerYear={rebalance?.finixRewardPerYear}
            totalAssetValue={rebalance?.totalAssetValue}
            small={isMobile}
          />
        )
      }
      if (itemType === SummaryItem.SHARE_PRICE || itemType === SummaryItem.SHARE_PRICE_W_YIELD) {
        return (
          <SharePrice
            price={rebalance.sharedPrice}
            diff={itemType === SummaryItem.SHARE_PRICE_W_YIELD ? rebalance.sharedPricePercentDiff : null}
            small={isMobile}
          />
        )
      }
      if (itemType === SummaryItem.RISK_O_METER) {
        return <RiskOMeter grade={t('Medium')} small={isMobile} />
      }
      if (itemType === SummaryItem.SHARES) {
        return <Shares balance={currentBalanceNumber} small={isMobile} />
      }
      if (itemType === SummaryItem.TOTAL_VALUE) {
        return <TotalValue balance={currentBalanceNumber} price={rebalance.sharedPrice} small={isMobile} />
      }
      return null
    },
    [
      currentBalanceNumber,
      isMobile,
      rebalance?.finixRewardPerYear,
      rebalance.sharedPrice,
      rebalance.sharedPricePercentDiff,
      rebalance.totalAssetValue,
      t,
    ],
  )

  return (
    <Card mb="S_16">
      <CardBody p={isMobile ? 'S_20' : typeB ? 'S_40' : 'S_32'}>
        <CardHeading rebalance={rebalance} isHorizontal={isMobile} mb={isMobile ? 'S_28' : 'S_24'} onlyTitle={typeB} />
        {!typeB && !isMobile && <Divider mb="S_24" />}
        <Flex flexWrap="wrap" {...(typeB && { justifyContent: 'space-between' })}>
          {items.map((item, index) => {
            const divider = ((b, i, m) => {
              if (b) {
                return m ? i % 2 === 1 : i > 0
              }
              return !m && i > 0
            })(typeB, index, isMobile)
            return (
              <Flex width={isMobile ? '50%' : width} mb={isMobile && index + 1 <= half ? 'S_20' : ''}>
                {/* {index > 0 && !isMobile && <VDivider mr={typeB ? 'S_24' : 'S_32'} />} */}
                {divider && <VDivider mr={isMobile ? 'S_20' : 'S_24'} />}
                {renderItem(item)}
              </Flex>
            )
          })}

          {/* <TwoLineFormat
                  className={isMobile ? 'col-6' : 'col-3'}
                  title="Investors"
                  value={numeral(rebalance.activeUserCountNumber).format('0,0')}
                /> */}
        </Flex>
      </CardBody>
    </Card>
  )
}

export default SummaryCard
