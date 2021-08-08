import useI18n from 'hooks/useI18n'
import React from 'react'
import styled from 'styled-components'
import { Text } from 'uikit-dev'

export interface ExpandableSectionProps {
  klaytnAddress?: string
  removed?: boolean
  totalValueFormated?: string
  lpLabel?: string
  addLiquidityUrl?: string
  isHorizontal?: boolean
  className?: string
  stakedBalanceValueFormated?: string
}

const Wrapper = styled.div<{ isHorizontal?: boolean }>`
  background: ${({ isHorizontal, theme }) => (!isHorizontal ? theme.colors.cardFooter : 'transparent')};
  border-top: ${({ theme, isHorizontal }) => (!isHorizontal ? `1px solid ${theme.colors.border}` : 'none')};
  border-bottom-left-radius: ${({ theme, isHorizontal }) => (!isHorizontal ? theme.radii.card : '0')};
  border-bottom-right-radius: ${({ theme, isHorizontal }) => (!isHorizontal ? theme.radii.card : '0')};
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  removed,
  totalValueFormated,
  isHorizontal = false,
  className = '',
  stakedBalanceValueFormated,
}) => {
  const TranslateString = useI18n()

  return (
    <Wrapper isHorizontal={isHorizontal} className={className}>
      {!removed && (
        <>
          <div className="flex align-baseline flex-wrap justify-space-between mb-1">
            <Text color="textSubtle">{TranslateString(23, 'My Liquidity')}</Text>

            <div className="flex flex-wrap justify-end" style={{ marginRight: '-6px' }}>
              <Text bold className="flex-shrink">
                {stakedBalanceValueFormated}
              </Text>
              {/* <LinkView /> */}
            </div>
          </div>

          <div className="flex align-baseline flex-wrap justify-space-between">
            <Text color="textSubtle">{TranslateString(23, 'Total Liquidity')}</Text>

            <div className="flex flex-wrap justify-end" style={{ marginRight: '-6px' }}>
              <Text bold className="flex-shrink">
                {totalValueFormated}
              </Text>
              {/* <LinkView /> */}
            </div>
          </div>
        </>
      )}
    </Wrapper>
  )
}

export default DetailsSection
