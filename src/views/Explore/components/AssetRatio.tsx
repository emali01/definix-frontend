import React from 'react'
import styled from 'styled-components'
import { Text } from 'uikit-dev'
import currency from '../mockCurrency'

interface AssetRatioType {
  isHorizontal: boolean
  className?: string
}

const Coin = styled.div`
  display: flex;
  align-items: center;
  margin: 4px 16px 4px 0;

  img {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: ${({ theme }) => theme.radii.circle};
    margin-right: 6px;
  }
`

const AssetRatio: React.FC<AssetRatioType> = ({ isHorizontal = false, className = '' }) => {
  return (
    <div className={className}>
      <Text fontSize="12px" color="textSubtle" textAlign={isHorizontal ? 'left' : 'center'}>
        Asset ratio
      </Text>
      <div className="flex flex-wrap">
        {currency.map((m) => (
          <Coin>
            <img src={m.img} alt="" />
            <Text>{m.percent}</Text>
          </Coin>
        ))}
      </div>
    </div>
  )
}

export default AssetRatio
