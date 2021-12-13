import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'
import { LeftPanel, TwoPanelLayout, MaxWidth } from 'uikit-dev/components/TwoPanelLayout'
import styled from 'styled-components'
import { Heading, useMatchBreakpoints, Text, Link } from 'uikit-dev'
// import StartVoting from './components/StartVoting'
import CardVoting from './components/CardVoting'
import VotingInfos from './VotingInfos'
import VotingProposal from './VotingProposal'

const TutorailsLink = styled(Link)`
  text-decoration-line: underline;
`

const Voting: React.FC = () => {
  const { path } = useRouteMatch()

  return (
    <>
      <Route exact path={path}>
        <Helmet>
          <title>Voting - Definix - Advance Your Crypto Assets</title>
        </Helmet>

        {/* <StartVoting /> */}
        <TwoPanelLayout>
          <LeftPanel isShowRightPanel={false}>
            <MaxWidth>
              <div className="mb-5">
                <div className="flex align-center mb-2">
                  <Heading as="h1" fontSize="32px !important" className="mr-3" textAlign="center">
                    Voting
                  </Heading>
                  <div className="mt-2 flex align-center justify-center">
                    <Text paddingRight="1">I’m new to this,</Text>
                    <TutorailsLink
                      href="https://sixnetwork.gitbook.io/definix-on-klaytn-en/long-term-staking-pool/how-to-stake-in-long-term-staking-pool"
                      target="_blank"
                    >
                      How to stake.
                    </TutorailsLink>
                  </div>
                </div>
                <CardVoting />
              </div>
            </MaxWidth>
          </LeftPanel>
        </TwoPanelLayout>
      </Route>

      <Route exact path={`${path}/detail`}>
        <VotingInfos />
      </Route>

      <Route exact path={`${path}/make-proposal`}>
        <VotingProposal />
      </Route>
    </>
  )
}

export default Voting