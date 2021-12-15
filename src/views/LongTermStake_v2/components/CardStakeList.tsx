import React, { useState, useEffect } from 'react'
import { Card, Flex } from '@fingerlabs/definixswap-uikit-v2'
import { useLockCount, usePrivateData } from 'hooks/useLongTermStake'
import styled from 'styled-components'

import StakeListHead from './StakeListHead'
import StakeListContentPc from './StakeListContentPc'
import StakeListContentMobile from './StakeListContentMobile'
import StakeListPagination from './StakeListPagination'
import { IsMobileType } from './types'

const FlexCard = styled(Flex)`
  flex-direction: column;
  align-items: center;
`

const CardStakeList: React.FC<IsMobileType> = ({ isMobile }) => {
  const { lockAmount, allDataLock } = usePrivateData()
  const lockCount = useLockCount()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemPerPage, setItemPerPage] = useState<number>(4)

  useEffect(() => {
    setItemPerPage(isMobile ? 3 : 4)
  }, [isMobile])

  return (
    <>
      {lockAmount ? (
        <Card p={isMobile ? 'S_20' : 'S_40'} mt="S_16">
          <FlexCard>
            {!isMobile && <StakeListHead />}
            {isMobile ? (
              <StakeListContentMobile isMobile={isMobile} allDataLock={allDataLock.slice(0, itemPerPage)} />
            ) : (
              <StakeListContentPc isMobile={isMobile} allDataLock={allDataLock.slice(0, itemPerPage)} />
            )}
            <StakeListPagination
              isMobile={isMobile}
              itemPerPage={itemPerPage}
              dataLength={Number(lockCount)}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </FlexCard>
        </Card>
      ) : (
        <></>
      )}
    </>
  )
}

export default CardStakeList
