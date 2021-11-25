import React from 'react'
import { Flex, Helper, Text } from 'definixswap-uikit'

interface SpaceBetweenFormatType {
  title?: string
  titleElm?: any
  value?: string
  valueElm?: any
  className?: string
  valueColor?: string
  hint?: string
}

const SpaceBetweenFormat: React.FC<SpaceBetweenFormatType> = ({
  className = '',
  title,
  titleElm,
  value,
  valueElm,
  valueColor = 'text',
  hint = '',
}) => {
  return (
    <Flex justifyContent="space-between" alignItems="center" className={className}>
      {titleElm || (
        <Flex pr="S_16">
          <Text fontSize="14px">{title}</Text>
          {hint && <Helper text={hint} className="ml-s4" position="top" />}
        </Flex>
      )}
      {valueElm || (
        <Text color={valueColor} fontWeight="500">
          {value}
        </Text>
      )}
    </Flex>
  )
}

export default SpaceBetweenFormat
