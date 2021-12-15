/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Box, BoxProps } from '@fingerlabs/definixswap-uikit-v2'
import { Rebalance } from '../../../state/types'

interface CardHeadingType extends BoxProps {
  isHorizontal?: boolean
  onlyTitle?: boolean
  className?: string
  rebalance: Rebalance | any
  componentType?: string
}

const FocusImg = styled.img<{ isMediumSize: boolean }>`
  border-radius: 6px;
  width: ${({ isMediumSize }) => (isMediumSize ? '100%' : '160px')};
  height: auto;
  object-fit: contain;
  background: ${({ theme }) => theme.colors.backgroundBox};
`

export const CardImage = ({
  isMediumSize = true,
  imageUrl,
  title,
}: {
  isMediumSize: boolean
  imageUrl: string
  title: string
}) => <FocusImg src={imageUrl} alt={title} isMediumSize={isMediumSize} />

export const CardTitle: React.FC<{ title: string; textStyle?: string }> = ({ title, textStyle = 'R_16B' }) => {
  const { t } = useTranslation()
  return (
    <Text textStyle={textStyle} textTransform="uppercase">
      {t(title)}
    </Text>
  )
}

const CardHeading: React.FC<CardHeadingType> = ({
  isHorizontal = false,
  className = '',
  onlyTitle = false,
  rebalance = {},
  ...props
}) => {
  const { t } = useTranslation()

  return (
    <Flex justifyContent="space-between" className={className} {...props}>
      <Flex
        flexDirection={isHorizontal ? 'column' : 'row'}
        justifyContent={isHorizontal ? 'center' : ''}
        alignItems={!isHorizontal && onlyTitle ? 'center' : 'start'}
      >
        <Box mr={isHorizontal ? '' : 'S_32'} mb={isHorizontal ? 'S_24' : ''}>
          <CardImage imageUrl={rebalance.icon[0]} title={rebalance.title} isMediumSize={isHorizontal} />
        </Box>

        {onlyTitle ? (
          <Box mb="S_4">
            <CardTitle title={t(rebalance.title)} textStyle="R_20B" />
          </Box>
        ) : (
          <div>
            <Box mb="S_4">
              <CardTitle title={t(rebalance.title)} />
            </Box>
            <Text textStyle="R_12R" color="textSubtle">
              {t(rebalance.description)}
            </Text>
          </div>
        )}
      </Flex>
    </Flex>
  )
}

export default CardHeading
