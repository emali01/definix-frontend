import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Button } from 'definixswap-uikit'
import styled from 'styled-components'

import ImgTokenFinix from '../../../assets/images/img-token-finix.png'
import ImgTokenFinix2x from '../../../assets/images/img-token-finix@2x.png'
import ImgTokenFinix3x from '../../../assets/images/img-token-finix@3x.png'
import IconAlert from '../../../assets/images/ico-16-alert.png'
import IconAlert2x from '../../../assets/images/ico-16-alert@2x.png'
import IconAlert3x from '../../../assets/images/ico-16-alert@3x.png'
import IconCheck from '../../../assets/images/ico-16-check-b.png'
import IconCheck2x from '../../../assets/images/ico-16-check-b@2x.png'
import IconCheck3x from '../../../assets/images/ico-16-check-b@3x.png'

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

const ApprovedButton = styled(Button)`
  opacity: 0.6;
`

const ApproveFinix: React.FC<IsMobileType> = ({ isMobile }) => {
  const { t } = useTranslation()
  const [approve, setApprove] = useState<boolean>(false)
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
            <img
              style={{ marginRight: `${isMobile ? '10px' : '12px'}` }}
              width={32}
              height={32}
              src={ImgTokenFinix}
              srcSet={`${ImgTokenFinix2x} 2x, ${ImgTokenFinix3x} 3x`}
              alt="Token-Finix"
            />
            <Text textStyle="R_16M" color="mediumgrey">
              {t('FINIX')}
            </Text>
          </Flex>
          {approve ? (
            <ApprovedButton width={`${isMobile ? '100%' : '186px'}`} variant="line" disabled>
              <img
                style={{ marginRight: '6px' }}
                width={16}
                height={16}
                src={IconCheck}
                srcSet={`${IconCheck2x} 2x, ${IconCheck3x} 3x`}
                alt="Icon-Check"
              />
              {t('Approved to FINIX')}
            </ApprovedButton>
          ) : (
            <Button width={`${isMobile ? '100%' : '186px'}`} variant="brown">
              {t('Approved to FINIX')}
            </Button>
          )}
        </FlexApprroveBtn>
        <Flex flexDirection="column">
          <Button mb="S_12" disabled={!approve}>
            {t('Stake')}
          </Button>
          {error && (
            <Flex alignItems="center">
              <img
                width={16}
                height={16}
                src={IconAlert}
                srcSet={`${IconAlert2x} 2x, ${IconAlert3x} 3x`}
                alt="Icon-Alert"
              />
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
