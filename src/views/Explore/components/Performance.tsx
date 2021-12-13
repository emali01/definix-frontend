import React from 'react'
import numeral from 'numeral'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Box, Divider, Flex, useMatchBreakpoints, VDivider } from 'definixswap-uikit-v2'

import { Rebalance } from '../../../state/types'

import FullChart from './FullChart'
import SelectTime from './SelectTime'
import TwoLineFormat from './TwoLineFormat'

interface PerformanceType {
  rebalance: Rebalance | any
  isLoading: boolean
  returnPercent: number
  graphData: any
  timeframe: string
  setTimeframe: (timeframe: string) => void
  maxDrawDown: number
  sharpRatio: number
}

const Performance: React.FC<PerformanceType> = ({
  rebalance,
  isLoading,
  returnPercent,
  graphData,
  timeframe,
  setTimeframe,
  maxDrawDown,
  sharpRatio,
}) => {
  const { t } = useTranslation()
  const { isMaxXl } = useMatchBreakpoints()
  const isMobile = isMaxXl
  const size = isMobile
    ? {
        width: '50%',
        paddingX: 'S_20',
        paddingY: 'S_20',
        bottomSectionPaddingTop: 'S_20',
        bottomSectionPaddingX: 'S_8'
      }
    : {
        width: '33.3333333%',
        paddingX: 'S_32',
        paddingY: 'S_32',
        bottomSectionPaddingTop: 'S_24',
        bottomSectionPaddingX: 'S_24'
      }

  return (
    <Box px={size.paddingX} py={size.paddingY}>
      <div className="flex flex-wrap align-center justify-space-between mb-3">
        <div className="flex flex-wrap align-center justify-space-between mb-3">
          <SelectTime timeframe={timeframe} setTimeframe={setTimeframe} />
        </div>
        <div className={`flex ${isMobile ? 'mt-3 justify-end' : ''}`}>
          {false && (
            <TwoLineFormat
              title="24H Performance"
              value={`$${numeral(get(rebalance, 'twentyHperformance', 0)).format('0,0.[00]')}`}
              valueClass={(() => {
                if (get(rebalance, 'twentyHperformance', 0) < 0) return 'failure'
                if (get(rebalance, 'twentyHperformance', 0) > 0) return 'success'
                return ''
              })()}
              className="mr-6"
            />
          )}
        </div>
      </div>

      <FullChart
        fundName={rebalance.title}
        isLoading={isLoading}
        graphData={graphData}
        tokens={[...rebalance.ratio.filter((rt) => rt.value)]}
      />
      <Divider />
      <Flex flexWrap="wrap" pt={size.bottomSectionPaddingTop} px={size.bottomSectionPaddingX}>
        <Flex alignItems="center" width={size.width}>
          <TwoLineFormat
            large={!isMobile}
            title={t('Sharpe Ratio')}
            value={`${numeral(sharpRatio).format('0,0.00')}`}
            hint="The average return ratio compares to the risk-taking activities earned per unit rate of the total risk."
          />
        </Flex>
        <Flex alignItems="center" width={size.width}>
          <VDivider mr="S_24" />
          <TwoLineFormat
            large={!isMobile}
            title={t('Max Drawdown')}
            value={`${Math.abs(numeral(maxDrawDown).format('0,0.00'))}%`}
            hint="The differentiation between the historical peak and low point through the portfolio."
          />
        </Flex>
        <Flex alignItems="center" width={size.width} mt={isMobile ? 'S_20' : ''}>
          {isMobile || <VDivider mx="S_24" />}
          <TwoLineFormat
            large={!isMobile}
            title={t('Return')}
            value={`${numeral(returnPercent || 0).format('0,0.[00]')}%`}
            hint="Estimated return on investment measures approximately over a period of time."
          />
        </Flex>
      </Flex>
    </Box>
  )
}

export default Performance
