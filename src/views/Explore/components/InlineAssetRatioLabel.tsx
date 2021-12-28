import React, { useMemo } from 'react'
import numeral from 'numeral'
import { Flex, Text, VDivider } from '@fingerlabs/definixswap-uikit-v2'
import { getTokenName } from 'utils/getTokenSymbol'
import CoinWrap from './CoinWrap'

const InlineAssetRatioLabel = ({ coin, column = false, small = false, ...props }) => {
  const thisName = getTokenName(coin?.symbol)
  const size = useMemo(
    () =>
      small
        ? {
            textM: 'R_14M',
            textR: 'R_14R',
          }
        : {
            textM: 'R_16M',
            textR: 'R_16R',
          },
    [small],
  )
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      py="S_8"
      flexDirection={column ? 'column' : 'row'}
      {...props}
    >
      <Flex flexGrow={1} width={column ? '100%' : ''} alignItems="center">
        <CoinWrap size="lg" symbol={coin.symbol} spacing="10px">
          <Text textStyle={size.textM}>{thisName}</Text>
        </CoinWrap>
        <Text textStyle={size.textR} color="textSubtle" ml="auto" textAlign="right">
          {coin.valueRatioCal.toFixed(2)}%
        </Text>
      </Flex>
      {!column && !small && <VDivider mx="S_20" my="5px" />}
      <Text textStyle={size.textM} color="deepgrey" minWidth={column ? '100%' : '140px'} textAlign="right">
        {coin.valueRatioCal && coin.amount ? numeral(coin.amount.toNumber()).format('0,0.[000000]') : '-'}
      </Text>
    </Flex>
  )
}

export default InlineAssetRatioLabel
