import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Flex, Text } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'

import { IsMobileType } from './types'

const Wrap = styled(Flex)`
  position: relative;
  border-bottom: 2px solid #e0e0e066;
`

const Tabs = styled(Flex)`
  position: relative;
  width: 100%;
`

const Tab = styled(Link)<{ isMobile: boolean; focus?: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '50%' : 'auto')};
  height: ${({ isMobile }) => (isMobile ? '56px' : '66px')};
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: ${({ focus }) => (focus ? '2px solid #53515f' : 'none')};
  padding: 0 ${({ isMobile }) => (isMobile ? '24px' : '48px')};
  text-align: center;
`

const TabStake: React.FC<IsMobileType> = ({ isMobile }) => {
  const { t } = useTranslation()

  return (
    <Wrap height={`${isMobile ? '56px' : '66px'}`}>
      <Tabs>
        <Tab to="long-term-stake" isMobile={isMobile} focus>
          <Text textStyle={`${isMobile ? 'R_16B' : 'R_14B'}`} color="black">
            {t('Long-term Stake')}
          </Text>
        </Tab>
        <Tab to="super-stake" isMobile={isMobile}>
          <Text textStyle={`${isMobile ? 'R_16B' : 'R_14B'}`} color="mediumgrey">
            {t('Super Stake')}
          </Text>
        </Tab>
      </Tabs>
    </Wrap>
  )
}

export default TabStake
