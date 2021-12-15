/* eslint-disable no-nested-ternary */
import React, { useState, useMemo, useEffect } from 'react'
import { Card, Text, Heading, useMatchBreakpoints, Button } from 'uikit-dev'
import { ExternalLink } from 'react-feather'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import numeral from 'numeral'
import { getAddress } from 'utils/addressHelpers'
import CopyToClipboard from 'uikit-dev/widgets/WalletModal/CopyToClipboard'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import CircularProgress from '@material-ui/core/CircularProgress'
import PaginationCustom from './Pagination'
import exploreIcon from '../../../uikit-dev/images/for-ui-v2/voting/icon-explore.png'

const EmptyData = ({ text }) => (
  <TR>
    <TD colSpan={6}>
      <div className="flex align-center justify-center" style={{ height: '400px' }}>
        <Text textAlign="center" color="textSubtle">
          {text}
        </Text>
      </div>
    </TD>
  </TR>
)

const LoadingData = () => (
  <TR>
    <TD colSpan={6}>
      <div className="flex align-center justify-center" style={{ height: '400px' }}>
        <CircularProgress size={16} color="inherit" className="mr-2" />
        <Text>Loading...</Text>
      </div>
    </TD>
  </TR>
)

const CardTable = styled(Card)`
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;
  overflow: auto;

  a {
    display: block;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
`

const TBody = styled.div`
  overflow: auto;
  position: relative;
`

const TR = styled.tr`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 24px;

  th {
    border-top: 1px solid${({ theme }) => theme.colors.border};
  }

  &:last-child {
    border: none;
  }

  &.isMe {
    position: sticky;
    bottom: 1px;
    left: 0;
    background: #f7f7f8;
    border-top: 1px solid: ${({ theme }) => theme.colors.border};
  }
`
const TD = styled.td<{ align?: string }>`
  width: 100%;
  vertical-align: middle;
  align-self: ${'center'};
`

const TransactionTable = ({ rows, empText, isLoading, total }) => {
  const [cols] = useState(['Address', 'Choice', 'Voting Power'])
  const [currentPage, setCurrentPage] = useState(1)
  const pages = useMemo(() => Math.ceil(total / 10), [total])
  const onPageChange = (e, page) => {
    setCurrentPage(page)
  }
  return (
    <CardTable>
      <Table>
        <TR>
          {cols.map((c) => (
            <TD key={c}>
              <Text color="textSubtle" fontSize="12px" bold>
                {c}
              </Text>
            </TD>
          ))}
        </TR>

        {isLoading ? (
          <LoadingData />
        ) : isEmpty(rows) ? (
          <>
            {console.log('rows', rows)}
            <EmptyData text={empText} />
          </>
        ) : (
          <TBody>
            {/* {console.log('rows',rows)} */}
            {rows !== null &&
              rows.map((r) => (
                <TR key={`tsc-${r.block_number}`}>
                  <TD>
                    <div className="flex align-center">
                      <Text color="#30ADFF" bold paddingRight="8px">
                        0x0000000000
                        {/* {r.user_address.substring(0, 6)}...{r.user_address.substring(r.user_address.length - 4)} */}
                      </Text>
                      <img src={exploreIcon} alt="exploreIcon" width={16} />
                    </div>
                  </TD>
                  <TD>
                    <Text color="text" bold>
                      Yes, agree with you.
                    </Text>
                  </TD>
                  <TD>
                    <div className="flex align-center">
                      <Text color="text" bold paddingRight="8px">
                        23,143
                      </Text>
                      <img src={exploreIcon} alt="exploreIcon" width={16} />
                    </div>
                  </TD>
                </TR>
              ))}
            <TR>
              <TD className="text-right">
                <PaginationCustom
                  page={currentPage}
                  count={pages}
                  onChange={onPageChange}
                  size="small"
                  hidePrevButton
                  hideNextButton
                />
              </TD>
            </TR>
          </TBody>
        )}
      </Table>
    </CardTable>
  )
}

const VotingList = ({ rbAddress }) => {
  const address = getAddress(rbAddress)
  const { account } = useWallet()

  const [isLoading, setIsLoading] = useState(false)
  const [currentTab, setCurrentTab] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const [transactions, setTransactions] = useState([
    {
      id: 1234,
      address: '0x00000',
      choise: 'Yes, agree with you.',
      voting_power: '99,999',
    },
  ])
  const [total, setTotal] = useState(0)
  const pages = useMemo(() => Math.ceil(total / 10), [total])
  const { isDark } = useTheme()
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg

  const setDefault = (tab) => {
    setCurrentTab(tab)
    setCurrentPage(1)
    setTransactions([
      {
        id: 1234,
        address: '0x00000',
        choise: 'Yes, agree with you.',
        voting_power: '99,999',
      },
    ])
    setTotal(0)
  }

  const onPageChange = (e, page) => {
    setCurrentPage(page)
  }
  useEffect(() => {
    return () => {
      setDefault(0)
    }
  }, [])
  return (
    <>
      <Card className="mb-4">
        <div className="pa-4 pt-3 bd-b">
          <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
            Votes (1)
          </Text>
        </div>
        <TransactionTable
          rows={transactions}
          isLoading={isLoading}
          empText={
            'Don`t have any transactions in this votes.'
            // currentTab === 0
            //   ? 'Don`t have any transactions in this votes.'
            //   : 'You haven`t made any transactions in this votes.'
          }
          total
        />
        {/* <PaginationCustom
              page={currentPage}
              count={pages}
              size="small"
              hidePrevButton
              hideNextButton
              className="px-4 py-2"
              onChange={onPageChange}
            /> */}
      </Card>
    </>
  )
}

export default VotingList