/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { Card, Heading, Button } from '../../../uikit-dev'
import TopicList from './TopicList'
import CardTab from './CardTab'
// import SelectType, { TypeChartName } from './SelectType'

const Proposals = styled(Card)`
  width: 100%;
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;
  margin-top: 1.5rem !important;

  a {
    display: block;
  }
`

const Tabs = styled(Card)`
  width: 100%;
  position: relative;
  content: '';
  border-radius: 0px;
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;

  a {
    display: block;
  }
`

const Header = styled.div`
  display: flex !important;
  padding: 1.5rem !important;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  align-items: center;
`

const StyledButtonCore = styled(Button)`
  background-color: #30adff;
  border: 1px solid #57575b;
  color: #ffffff;
  border-radius: 6px;
  padding: 18px 20px;

  &:hover {
    cursor: default;
  }
`

const CardProposals = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [currentTabHeader, setCurrentTabHeader] = useState(0)
  // const [chartName, setChartName] = useState<TypeChartName>('Core')

  useEffect(
    () => () => {
      setCurrentTab(0)
    },
    [],
  )

  return (
    <>
      <Proposals>
        <Tabs className="bd-b">
          <CardTab
            menus={['Core']}
            currentTabHeader={currentTabHeader}
            setCurrentTabHeader={setCurrentTabHeader}
            className="px-5"
            isHeader
          />
        </Tabs>
        <Tabs>
          <CardTab
            menus={['Vote Now', 'Soon', 'Closed']}
            current={currentTab}
            setCurrent={setCurrentTab}
            className="px-5"
            isHeader={false}
          />
          {currentTab === 0 ? (
            <TopicList isActive="vote" />
          ) : currentTab === 1 ? (
            <TopicList isActive="soon" />
          ) : (
            <TopicList isActive="closed" />
          )}
        </Tabs>
      </Proposals>
    </>
  )
}

export default CardProposals