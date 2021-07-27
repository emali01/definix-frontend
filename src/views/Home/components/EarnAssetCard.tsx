import React from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import orderBy from 'lodash/orderBy'
import { Heading, Card, CardBody, Flex, ArrowForwardIcon } from 'uikit-dev'
import { NavLink } from 'react-router-dom'
import pools from 'config/constants/pools'
import { Pool } from 'state/types'

const StyledFarmStakingCard = styled(Card)`
  background: linear-gradient(#53dee9, #7645d9);
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }
`
const CardMidContent = styled(Heading).attrs({ size: 'xl' })`
  line-height: 44px;
`
const EarnAssetCard = () => {
  const { t } = useTranslation()
  const activeNonFinixPools = pools.filter((pool) => !pool.isFinished && !pool.tokenName.includes('FINIX'))
  const latestPools: Pool[] = orderBy(activeNonFinixPools, ['sortOrder', 'pid'], ['desc', 'desc']).slice(0, 3)
  // Always include FINIX
  const assets = ['FINIX', ...latestPools.map((pool) => pool.tokenName)].join(', ')

  return (
    <StyledFarmStakingCard>
      <CardBody>
        <Heading color="contrast" size="lg">
          {t('Earn')}
        </Heading>
        <CardMidContent color="invertedContrast">{assets}</CardMidContent>
        <Flex justifyContent="space-between">
          <Heading color="contrast" size="lg">
            {t('in Pools')}
          </Heading>
          <NavLink exact activeClassName="active" to="/syrup" id="pool-cta">
            <ArrowForwardIcon mt={30} color="primary" />
          </NavLink>
        </Flex>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default EarnAssetCard
