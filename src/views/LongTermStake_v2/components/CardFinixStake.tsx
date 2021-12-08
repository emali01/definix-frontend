import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { Card, Flex, Divider } from 'definixswap-uikit'
import { useApr, useAllLock } from '../../../hooks/useLongTermStake'

import VFinixAprButton from './VFinixAprButton'
import BalanceFinix from './BalanceFinix'
import ApproveFinix from './ApproveFinix'
import EstimateVFinix from './EstimateVFinix'
import { IsMobileType } from './types'

const FlexCard = styled(Flex)`
  flex-direction: column;
  align-items: center;
`

const CardFinixStake: React.FC<IsMobileType> = ({ isMobile }) => {
  const [days, setDays] = useState<number>(365)
  const apr = useApr()
  const { allLockPeriod } = useAllLock()
  const minimum = _.get(allLockPeriod, '0.minimum')

  const data = [
    {
      multiple: 1,
      day: 90,
      apr: apr * 1,
      minStake: minimum['0'],
    },
    {
      multiple: 2,
      day: 180,
      apr: apr * 2,
      minStake: minimum['1'],
    },
    {
      multiple: 4,
      day: 365,
      apr: apr * 4,
      minStake: minimum['2'],
    },
  ]

  return (
    <>
      <Card p={isMobile ? 'S_20' : 'S_40'} mt="S_16">
        <FlexCard>
          <VFinixAprButton isMobile={isMobile} days={days} setDays={setDays} data={data} />
          {isMobile && <Divider width="100%" backgroundColor="lightGrey50" />}
          <BalanceFinix isMobile={isMobile} days={days} data={data} />
          <Divider width="100%" backgroundColor="lightGrey50" />
          <ApproveFinix isMobile={isMobile} />
          <EstimateVFinix isMobile={isMobile} />
        </FlexCard>
      </Card>
    </>
  )
}

export default CardFinixStake
