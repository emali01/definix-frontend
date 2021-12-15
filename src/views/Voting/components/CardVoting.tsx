import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { Card, Heading, Text, Button } from 'uikit-dev'
import definixVoting from 'uikit-dev/images/for-ui-v2/voting/voting-banner.png'
import CardProposals from './CardProposals'
import VotingPartProposal from './VotingPartProposal'

const BannerVoting = styled(Card)`
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  padding: 28px 24px;
  position: relative;
  overflow: visible;

  &:before {
    content: '';
    width: 50%;
    height: 100%;
    background: url(${definixVoting});
    background-size: contain;
    background-position: right bottom;
    background-repeat: no-repeat;
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0.2;
    margin-right: 4%;
    border-bottom-right-radius: ${({ theme }) => theme.radii.card};
  }

  h2 {
    font-size: 20px !important;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 50px 0px 50px 5%;
    align-items: center;

    &:before {
      opacity: 0.2;
      width: 40%;
    }

    h2 {
      font-size: 32px !important;
      width: 80%;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    align-items: center;

    &:before {
      opacity: 0.2;
    }

    h2 {
      font-size: 32px !important;
      width: 80%;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 50px 2% 50px 12%;
    align-items: center;

    &:before {
      opacity: 1;
      width: 20%;
      margin-right: 14%;
      background-position: center;
    }

    h2 {
      font-size: 32px !important;
      width: 70%;
    }
  }
`

const DetailBanner = styled(Text)`
  width: 80%;
  font-size: 14px !important;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px !important;
    width: 60%;
  }
`

const CardVoting = () => {
  return (
    <>
      <BannerVoting>
        <div>
          <Heading color="primary">DRIVE FORWARD TOGETHER WITH DECENTRALIZED VOTING</Heading>
          <DetailBanner>
            Community Proposal is a great way to say your words and to reflects the community feeling about your ideas.
          </DetailBanner>
        </div>
        <Button variant="success" radii="small" size="sm" marginTop="10px" as={Link} to="/voting/make-proposal">
          Make a Proposals
        </Button>
      </BannerVoting>
      <CardProposals />
      <VotingPartProposal rbAddress />
    </>
  )
}

export default CardVoting
