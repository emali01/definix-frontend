import React from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Button, Card, Heading, Text } from 'uikit-dev'
import astro from 'uikit-dev/images/Airdrop/Definix-on-KLAYTN-06.jpg'
import definixLogo from 'uikit-dev/images/Definix-advance-crypto-assets.png'
import { Route, useRouteMatch } from 'react-router-dom'

const StyledBanner = styled(Card)`
  width: 100%;
  // background: ${({ theme }) => theme.colors.white};
  background: url(${astro});
  padding: 48px 24px;
  position: relative;
  overflow: visible;
  background-size: cover;

  &:before {
    content: '';
    width: 50%;
    height: calc(100% + 24px);
    background-repeat: no-repeat;
    position: absolute;
    top: -24px;
    right: 0;
    opacity: 0.2;
  }

  h2 {
    font-size: 24px;
  }
  h3 {
    font-size: 12px !important;
    margin-bottom: 4px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 48px 50% 48px 24px;

    &:before {
      opacity: 1;
    }

    h2 {
      font-size: 32px !important;
    }
    h3 {
      font-size: 16px !important;
    }
  }
`
const StyleAirDrop = {
  fontSize: 12,
}
const StyleKlaytnBlockchain = {
  color: '#895E38',
  fontSize: 21,
}

const CardAirdropKlay = ({ showBtn = false, className = '' }) => {
  const { path } = useRouteMatch()
  const { t } = useTranslation()
  return (
    <StyledBanner className={className}>
      <Heading className="mb-2" color="#3F4042">
        <img src={definixLogo} width="200px" alt="" /> <span style={StyleAirDrop}>{t('is now on')}</span>
      </Heading>
      <Heading fontSize="18px" color="#895E38" className="mb-2">
        {t('Klaytn Blockchain')}
      </Heading>
      <Text style={{ float: 'left', marginTop: '8px', marginRight: '8px' }} color="#3F4042" fontSize="15px">
        <b>{t('Get free ')}</b>
      </Text>
      <Heading fontSize="18px" color="#3F4042" className="mb-2">
        11 KLAY
        {/* {t('11 KLAY')} */}
      </Heading>
      {/* {showBtn && ( */}
      {/* <Route path={`${path}/airdropklay`}> */}
      <Button as="a" href="/airdropklay" size="sm" variant="primary" className="btn-secondary-disable mt-3">
        {t('Get Airdrop')}
      </Button>
      {/* </Route> */}
      {/* )} */}
    </StyledBanner>
  )
}
export default CardAirdropKlay
