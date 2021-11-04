import { Ratio } from 'config/constants/types'
import React from 'react'
import styled from 'styled-components'
import { Text } from 'definixswap-uikit'
import useTranslation from 'contexts/Localisation/useTranslation'

interface AssetRatioType {
  isHorizontal: boolean
  className?: string
  ratio: Ratio[] | any
}

const Coin = styled.div<{ isHorizontal?: boolean }>`
  display: flex;
  align-items: center;
  margin: 4px 0;
  padding: 0 8px;
  width: ${({ isHorizontal }) => (!isHorizontal ? '33.333%' : 'auto')};

  img {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: ${({ theme }) => theme.radii.circle};
    margin-right: 6px;
  }
`

const AssetRatio: React.FC<AssetRatioType> = ({ isHorizontal = false, className = '', ratio = [] }) => {
  const { t } = useTranslation()

  return (
    <div className={className}>
      <Text
        textStyle="R_12R"
        color="mediumgrey"
        className={!isHorizontal ? 'mb-2' : ''}
        textAlign={isHorizontal ? 'left' : 'center'}
      >
        {t('Asset Ratio')}
      </Text>
      <div className="flex flex-wrap" style={{ marginLeft: isHorizontal ? '-8px' : '' }}>
        {ratio
          .filter((r) => r.value)
          .map((m) => (
            <Coin isHorizontal={isHorizontal}>
              <img src={`/images/coins/${m.symbol || ''}.png`} alt={m.symbol} />
              <Text textStyle="R_14R">{m.value}%</Text>
            </Coin>
          ))}
      </div>
    </div>
  )
}

export default AssetRatio
