import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Button, useModal, ImgTokenFinixIcon, CheckBIcon, AlertIcon } from 'definixswap-uikit-v2'
import styled from 'styled-components'

import StakeModal from './StakeModal'
import { IsMobileType } from './types'

const FlexApprove = styled(Flex)`
  flex-direction: column;
  margin-top: 32px;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.mobile} {
    margin-top: 24px;
  }
`

const FlexApprroveBtn = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;

  ${({ theme }) => theme.mediaQueries.mobile} {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 32px;
  }
`

const ApproveFinix: React.FC<IsMobileType> = ({ isMobile }) => {
  const { t } = useTranslation()
  const [onPresentStakeModal] = useModal(
    <StakeModal balance="1,000" period="90" end="08-Nov-21 14:57:20 GMT+9" earn="1,000" onOK={() => null} />,
    false,
  )
  const [approve, setApprove] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    // 에러 조건 만들고 그에 맞는 메시지 넣기
    setError(`${t('Error message')}`)
  }, [t])

  return (
    <>
      <FlexApprove>
        <FlexApprroveBtn>
          <Flex mb={`${isMobile && 'S_8'}`} alignItems="center">
            <ImgTokenFinixIcon viewBox="0 0 48 48" width="32px" height="32px" />
            <Text ml={`${isMobile ? 'S_10' : 'S_12'}`} textStyle="R_16M" color="mediumgrey">
              {t('FINIX')}
            </Text>
          </Flex>
          <Button width={`${isMobile ? '100%' : '186px'}`} variant={`${approve ? 'line' : 'brown'}`} disabled={approve}>
            {approve && (
              <Flex mr="S_6">
                <CheckBIcon opacity="0.5" viewBox="0 0 16 16" width="16px" height="16px" />
              </Flex>
            )}
            {approve
              ? t('Approved to {{Token}}', { Token: t('FINIX') })
              : t('Approve {{Token}}', { Token: t('FINIX') })}
          </Button>
        </FlexApprroveBtn>
        <Flex flexDirection="column">
          <Button mb="S_12" disabled={!approve} onClick={onPresentStakeModal}>
            {t('Stake')}
          </Button>
          {error && (
            <Flex alignItems="center">
              <AlertIcon viewBox="0 0 16 16" width="16px" height="16px" />
              <Text ml="S_4" textStyle="R_14R" color="red">
                {error}
              </Text>
            </Flex>
          )}
        </Flex>
      </FlexApprove>
    </>
  )
}

export default ApproveFinix
