import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useVeloHarvest } from 'hooks/useHarvest'
import useI18n from 'hooks/useI18n'
import numeral from 'numeral'
import React, { useState } from 'react'
import { usePriceFinixUsd } from 'state/hooks'
import styled from 'styled-components'
import { Button, Heading, Text } from 'uikit-dev'

import { getBalanceNumber } from 'utils/formatBalance'
import { HarvestActionProps } from './types'

const MiniLogo = styled.img`
  width: 20px;
  height: auto;
  margin-right: 8px;
  display: inline-block;
`

const HarvestAction: React.FC<HarvestActionProps> = ({
  earnings,
  tokenDecimals,
  needsApproval,
  isOldSyrup,
  className = '',
  veloAmount,
  pairPrice,
  veloId,
}) => {
  const TranslateString = useI18n()
  const [pendingTx, setPendingTx] = useState(false)
  const finixPrice = usePriceFinixUsd()
  const { account } = useWallet()
  const { onRewardVelo } = useVeloHarvest(veloId)

  const rawEarningsBalance = getBalanceNumber(earnings, 5)
  const displayBalance = rawEarningsBalance.toLocaleString()

  return (
    <div className={className}>
      <Text textAlign="left" className="mb-2 flex align-center" color="textSubtle">
        <MiniLogo src="/images/coins/velo.png" alt="" />
        {`VELO ${TranslateString(1072, 'Earned')}`}
      </Text>

      <div className="flex align-center justify-space-between">
        <Heading
          fontSize="24px !important"
          color={getBalanceNumber(earnings, tokenDecimals) === 0 ? 'textDisabled' : 'text'}
          className="col-6 pr-3"
          textAlign="left"
        >
          {/* {getBalanceNumber(earnings, tokenDecimals).toFixed(2)} */}
          {displayBalance}
        </Heading>

        <Button
          fullWidth
          disabled={!account || (needsApproval && !isOldSyrup) || !earnings.toNumber() || pendingTx}
          className="col-6"
          radii="small"
          onClick={async () => {
            setPendingTx(true)

            await onRewardVelo()

            setPendingTx(false)
          }}
        >
          {TranslateString(562, 'Harvest')}
        </Button>
      </div>

      <Text color="textSubtle" textAlign="left" className="mt-1">
        = ${numeral(pairPrice * rawEarningsBalance * finixPrice.toNumber()).format('0,0.0000')}
        {/* {numeral(earnings.toNumber() * finixPrice.toNumber()).format('0,0.0000')} */}
      </Text>
      <br />
      <br />
      <div style={{ display: 'flex' }}>
        <Text color="textSubtle" textAlign="left" className="col-6">
          Total VELO Rewards
        </Text>
        <Text color="textSubtle" textAlign="right" className="col-6">
          {numeral(veloAmount).format('0,0')}/300,000 VELO
        </Text>
      </div>
    </div>
  )
}

export default HarvestAction
