import React from 'react'
import { Text } from 'uikit-dev'
import { useWallet } from 'klaytn-use-wallet'
import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'
import usePoolEarning from 'hooks/usePoolEarning'
import { usePriceKlayKusdt } from 'state/hooks'
import styled from 'styled-components'
import CardValue from './CardValue'
import CardBusdValue from './CardBusdValue'

const Block = styled.div`
  margin-bottom: 24px;
}
`

const FinixHarvestPool = () => {
  const TranslateString = useI18n()
  const { account } = useWallet()
  const poolEarnings = usePoolEarning()

  const earningsPoolSum = poolEarnings.reduce((accum, earning) => {
    return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)

  const earningsBusd = new BigNumber(earningsPoolSum).multipliedBy(usePriceKlayKusdt()).toNumber()

  if (!account) {
    return (
      <Text fontSize="24px !important" color="textDisabled" style={{ lineHeight: '76px' }}>
        {TranslateString(298, 'Locked')}
      </Text>
    )
  }

  return (
    <Block>
      <CardValue value={earningsPoolSum} lineHeight="1.5" />
      <CardBusdValue value={earningsBusd} />
    </Block>
  )
}

export default FinixHarvestPool