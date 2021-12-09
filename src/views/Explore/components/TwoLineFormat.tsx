import React from 'react'
import { Flex, FlexProps, Helper, Text } from 'definixswap-uikit-v2'
import { isNil } from 'lodash'

interface TwoLineFormatType extends FlexProps {
  className?: string
  title: string
  subTitle?: string
  titleColor?: string
  titleMarginBottom?: number
  value: string
  percent?: string
  hint?: string
  large?: boolean
  days?: string
  alignRight?: boolean
  percentClass?: string
  valueClass?: string
  currentInvestPercentDiff?: string
  diffAmounts?: string
  subfix?: React.ReactNode
}

const TwoLineFormat: React.FC<TwoLineFormatType> = ({
  className = '',
  title,
  subTitle,
  titleColor,
  titleMarginBottom,
  value,
  percent,
  hint,
  large = false,
  days,
  alignRight = false,
  percentClass = 'success',
  valueClass,
  currentInvestPercentDiff,
  diffAmounts,
  subfix,
  ...props
}) => {
  const textStyle = large
    ? {
        emphasize: 'R_20M',
        subTitle: 'R_14R',
        text: 'R_12M',
      }
    : {
        emphasize: 'R_18M',
        subTitle: 'R_12R',
        text: 'R_12M',
      }
  return (
    <Flex flexDirection="column" className={className} {...props}>
      <Flex
        alignItems="center"
        justifyContent={alignRight ? 'flex-end' : 'inherit'}
        mb={titleMarginBottom ?? (large ? 'S_4' : 'S_2')}
      >
        <Text textStyle={textStyle.subTitle} color={titleColor || 'mediumgrey'}>
          {title}
        </Text>

        {subTitle && (
          <Text textStyle={textStyle.subTitle} ml="S_8" as="span">
            {subTitle}
          </Text>
        )}

        {hint && <Helper text={hint} ml="S_8" />}
      </Flex>

      <Flex alignItems="baseline" justifyContent={alignRight ? 'flex-end' : 'inherit'}>
        <Text textStyle={textStyle.emphasize} color={valueClass}>
          {value}
        </Text>
        {!isNil(diffAmounts) && diffAmounts !== '0' && (
          <Text textStyle={textStyle.text} color={percentClass} ml="S_8">
            {diffAmounts}
          </Text>
        )}
        {!isNil(currentInvestPercentDiff) && currentInvestPercentDiff !== '(0%)' && (
          <Text textStyle={textStyle.subTitle} color={percentClass} ml="S_8">
            {currentInvestPercentDiff}
          </Text>
        )}
        {percent && (
          <Text textStyle="R_12M" color={percentClass} ml="S_8">
            {percent}
          </Text>
        )}
        {days && (
          <Text textStyle={textStyle.text} ml="S_8">
            {days}
          </Text>
        )}

        {subfix && subfix}
      </Flex>
    </Flex>
  )
}

export default TwoLineFormat
