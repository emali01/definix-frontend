import React from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from 'definixswap-uikit'
import styled from 'styled-components'

import { IsMobileType } from './types'

const FlexBalance = styled(Flex)`
  flex-direction: row;
  align-items: flex-end;
  background-color: ${({ theme }) => theme.colors.black20};
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;

  ${({ theme }) => theme.mediaQueries.mobile} {
    flex-direction: column;
    align-items: flex-start;
  }
`

const FlexFinix = styled(Flex)`
  width: 50%;
  flex-direction: column;

  &:last-child {
    padding-left: 40px;
    border-left: 1px solid ${({ theme }) => theme.colors.brown};
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    width: 100%;

    &:first-child {
      padding-bottom: 16px;
    }
    &:last-child {
      padding-top: 16px;
      padding-left: 0;
      border-left: none;
      border-top: 1px solid ${({ theme }) => theme.colors.brown};
    }
  }
`

const MyBalance: React.FC<IsMobileType> = ({ isMobile }) => {
  const { t } = useTranslation()

  const data = [
    {
      title: t('Your vFINIX Balance'),
      value: '100,000,000.123456',
      token: t('vFINIX'),
    },
    {
      title: t('Your Total FINIX Stake'),
      value: '100,000,000.123456',
      token: t('FINIX'),
    },
  ]

  return (
    <>
      <FlexBalance px={isMobile ? 'S_20' : 'S_40'} pt={isMobile ? 'S_20' : 'S_24'} pb={isMobile ? 'S_20' : 'S_32'}>
        {data.map((v) => {
          return (
            <FlexFinix>
              <Text mb="S_6" textStyle={`${isMobile ? 'R_12R' : 'R_14R'}`} color="mediumgrey">
                {v.title}
              </Text>
              <Flex alignItems="center">
                <Text textStyle={`${isMobile ? 'R_16B' : 'R_16M'}`} color="white">
                  {v.value}
                </Text>
                <Text ml="S_6" textStyle="R_12B" color="white">
                  {v.token}
                </Text>
              </Flex>
            </FlexFinix>
          )
        })}
      </FlexBalance>
    </>
  )
}

export default MyBalance
