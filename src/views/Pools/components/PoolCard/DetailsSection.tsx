import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import React, { useMemo } from 'react'
import { Flex, Text, ColorStyles, Label } from 'definixswap-uikit'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import useConverter from 'hooks/useConverter'

const TotalStakedSection: React.FC<{
  title: string
  tokenName: string
  totalStaked: BigNumber
}> = ({ title, tokenName, totalStaked }) => {
  const { convertToUSD, convertToPriceFromSymbol } = useConverter()

  const price = useMemo(() => {
    return convertToPriceFromSymbol(tokenName)
  }, [convertToPriceFromSymbol, tokenName])

  const totalStakedValue = useMemo(() => {
    return getBalanceNumber(totalStaked)
  }, [totalStaked])

  const totalStakedPrice = useMemo(() => {
    return convertToUSD(new BigNumber(totalStakedValue).multipliedBy(price), 2)
  }, [convertToUSD, totalStakedValue, price])

  return (
    <>
      <Text color={ColorStyles.MEDIUMGREY} textStyle="R_12R" className="mb-s8">
        {title}
      </Text>
      <Flex alignItems="end">
        <Text color={ColorStyles.BLACK} textStyle="R_18M">
          {totalStakedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </Text>
        <Text color={ColorStyles.DEEPGREY} textStyle="R_12M" style={{ paddingLeft: '2px' }}>
          {tokenName}
        </Text>
      </Flex>
      <Text color={ColorStyles.MEDIUMGREY} textStyle="R_14R">
        = {totalStakedPrice}
      </Text>
    </>
  )
}

const MyBalanceSection: React.FC<{
  title: string
  tokenName: string
  myBalance: BigNumber
}> = ({ title, tokenName, myBalance }) => {
  const myBalanceValue = useMemo(() => {
    return numeral(myBalance.toNumber()).format('0,0.[000000]')
  }, [myBalance])  

  return (
    <>
      <Text color={ColorStyles.MEDIUMGREY} textStyle="R_12R" className="mb-s8">
        {title}
      </Text>
      <Flex alignItems="center">
        <Label type="token">{tokenName}</Label>
        <Text color={ColorStyles.BLACK} textStyle="R_18M" style={{ paddingLeft: '2px' }}>
          {myBalanceValue}
        </Text>
      </Flex>
    </>
  )
}

const EarningsSection: React.FC<{
  title: string
  tokenName: string
  earnings: BigNumber
}> = ({ title, tokenName, earnings }) => {
  const { convertToUSD, convertToPriceFromSymbol } = useConverter()

  const price = useMemo(() => {
    return convertToPriceFromSymbol(tokenName)
  }, [convertToPriceFromSymbol, tokenName])

  const earningsValue = useMemo(() => {
    return getBalanceNumber(earnings)
  }, [earnings])

  const earningsPrice = useMemo(() => {
    return convertToUSD(new BigNumber(earningsValue).multipliedBy(price), 2)
  }, [earningsValue, price, convertToUSD])

  return (
    <>
      <Text color={ColorStyles.MEDIUMGREY} textStyle="R_12R" className="mb-s8">
        {title}
      </Text>
      <Flex alignItems="end">
        <Text color={ColorStyles.BLACK} textStyle="R_18M">
          {earningsValue.toLocaleString()}
        </Text>
        <Text color={ColorStyles.DEEPGREY} textStyle="R_12M" style={{ paddingLeft: '2px' }}>
          {tokenName}
        </Text>
      </Flex>
      <Text color={ColorStyles.MEDIUMGREY} textStyle="R_14R">
        = {earningsPrice}
      </Text>
    </>
  )
}

export { TotalStakedSection, MyBalanceSection, EarningsSection }
