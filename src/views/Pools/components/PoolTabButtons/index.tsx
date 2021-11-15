import React, { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Text, Toggle, Flex, ColorStyles, DropdownSet, DropdownItem } from 'definixswap-uikit'

const PoolTabButtons = ({ stackedOnly, setStackedOnly, liveOnly, setLiveOnly, orderOptions, orderBy }) => {
  const { t } = useTranslation()
  const handleClickOrderOption = useCallback((index: number) => {
    orderBy(orderOptions[index])
  }, [orderBy, orderOptions])

  return (
    <Box className="mt-s40">
      <Flex justifyContent="space-between" alignItems="center">
        <Flex>
          <DropdownSet
            options={orderOptions}
            onItemClick={handleClickOrderOption}
          />

          <Flex alignItems="center" className="mx-s24">
            <Text textStyle="R_14R" color={ColorStyles.DEEPGREY} className="mr-s8">
              {t('Staked only')}
            </Text>
            <Toggle checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} />
          </Flex>

          <Flex alignItems="center">
            <Text textStyle="R_14R" color={ColorStyles.DEEPGREY} className="mr-s8">
              Finished
            </Text>
            <Toggle checked={!liveOnly} onChange={() => setLiveOnly(!liveOnly)} />
          </Flex>
        </Flex>
        <Box>search box</Box>
      </Flex>
    </Box>
  )
}

export default PoolTabButtons
