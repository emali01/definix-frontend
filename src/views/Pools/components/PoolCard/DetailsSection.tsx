import useI18n from 'hooks/useI18n'
import numeral from 'numeral'
import React from 'react'
import styled from 'styled-components'
import { ChevronRightIcon, Link, Text } from 'uikit-dev'
import { getBalanceNumber } from 'utils/formatBalance'
import { DetailsSectionProps } from './types'

const Wrapper = styled.div<{ isHorizontal?: boolean }>`
  background: ${({ isHorizontal, theme }) => (!isHorizontal ? theme.colors.cardFooter : 'transparent')};
  border-top: ${({ theme, isHorizontal }) => (!isHorizontal ? `1px solid ${theme.colors.border}` : 'none')};
  border-bottom-left-radius: ${({ theme, isHorizontal }) => (!isHorizontal ? theme.radii.card : '0')};
  border-bottom-right-radius: ${({ theme, isHorizontal }) => (!isHorizontal ? theme.radii.card : '0')};
`

const DetailsSection: React.FC<DetailsSectionProps> = ({
  tokenName,
  totalStaked,
  klaytnScopeAddress,
  isHorizontal = false,
  className = '',
}) => {
  const TranslateString = useI18n()

  const LinkView = ({ linkClassName = '' }) => (
    <Link
      external
      href={`https://scope.klaytn.com/account/${klaytnScopeAddress}`}
      bold={false}
      className={`flex-shrink ${linkClassName}`}
      color="textSubtle"
      fontSize="12px"
    >
      {TranslateString(356, 'View on KlaytnScope')}
      <ChevronRightIcon color="textSubtle" />
    </Link>
  )

  return (
    <Wrapper isHorizontal={isHorizontal} className={className}>
      <div className="flex align-baseline flex-wrap justify-space-between">
        <Text color="textSubtle">Total {tokenName} Staked</Text>

        <Text bold className="flex-shrink">
          {numeral(getBalanceNumber(totalStaked)).format('0,0.0000')} {tokenName}
        </Text>
      </div>

      <div className="flex justify-end mt-1" style={{ marginRight: '-6px' }}>
        <LinkView />
      </div>
    </Wrapper>
  )
}

export default DetailsSection