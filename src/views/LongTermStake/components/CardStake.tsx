import React, { useState, useEffect, useCallback } from 'react'
import useTheme from 'hooks/useTheme'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import numeral from 'numeral'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import _ from 'lodash'
import moment from 'moment'
import { Card, Button, useMatchBreakpoints, Text, Heading, useModal } from 'uikit-dev'
import ConnectModal from 'uikit-dev/widgets/WalletModal/ConnectModal'
import definixLongTerm from 'uikit-dev/images/for-ui-v2/long-term-stake-opacity.png'
import badgeLock from 'uikit-dev/images/for-ui-v2/badge-lock.png'
import {
  useBalances,
  useAllowance,
  useApr,
  useTotalSupply,
  useAllLockPeriods,
  useLock,
  useApprove,
  usePrivateData,
  useUnstakeId,
} from '../../../hooks/useLongTermStake'
import StakePeriodButton from './StakePeriodButton'

const FinixStake = styled(Card)`
  width: 100%;
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;

  a {
    display: block;
  }
`

const Balance = styled(Card)`
  display: flex;
  flex-flow: row nowrap;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0.75rem 0.75rem 0.75rem;
  background-color: ${'#E4E4E425'};
  background-size: cover;
  background-repeat: no-repeat;
  margin-top: 0.5rem !important;
  right: 0;
  position: relative;
  border: ${({ theme }) => !theme.isDark && '1px solid #ECECEC'};
  box-shadow: unset;

  a {
    display: block;
  }
`

const Coin = styled.div`
  justify-content: flex-end;
  align-items: center;

  img {
    width: auto;
    height: 30px;
    margin: 0px 12px 0px 6px;
  }
`

const Input = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const StylesButton = styled(Button)`
  padding: 11px 12px 11px 12px;
  border: ${({ theme }) => theme.isDark && '1px solid #707070'};
  border-radius: 8px;
  font-size: 12px;
  background-color: ${({ theme }) => (theme.isDark ? '#ffff0000' : '#EFF4F5')};
  height: 38;
  margin-right: 6px;
  color: ${({ theme }) => (theme.isDark ? theme.colors.textSubtle : '#1587C9')};

  &:hover:not(:disabled):not(.button--disabled):not(:active) {
    background-color: ${({ theme }) => (theme.isDark ? '#ffff0000' : '#EFF4F5')};
    border: ${({ theme }) => theme.isDark && '1px solid #707070'};
    color: ${({ theme }) => (theme.isDark ? theme.colors.textSubtle : '#1587C9')};
  }
`
const InputBox = styled.div`
  display: flex;
  flex-flow: row nowrap;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.backgroundBox};
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const NumberInput = styled.input`
  border: none;
  background-color: #ffffff00;
  font-size: 22px;
  outline: none;
  color: ${({ theme }) => (theme.isDark ? '#fff' : '#000000')};
  width: 100%;
`

const Apr = styled(Text)`
  position: relative;
  line-height: 1;
  text-align-last: center;
  font-weight: 500;
  font-size: 28px;
  text-shadow: #00000050 0px 2px 4px;
`

const CardStake = () => {
  const [period, setPeriod] = useState(0)
  const { isDark } = useTheme()
  const { isXl } = useMatchBreakpoints()
  const isMobileOrTablet = !isXl
  const { connect, account } = useWallet()
  const [date, setDate] = useState(moment(new Date()).format('DD-MM-YYYY HH:mm:ss'))
  const [onPresentConnectModal] = useModal(<ConnectModal login={connect} />)
  const balanceOf = useBalances()
  const allowance = useAllowance()
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const totalSupply = useTotalSupply()
  const rewardperblock = useApr()
  const allLock = useAllLockPeriods()
  const [value, setValue] = useState('')
  const [letvel, setLevel] = useState(0)
  const apr = ((rewardperblock * 86400 * 365) / Number(totalSupply)) * 100
  const [vFINIX, setVFINIX] = useState(0)
  const [lockFinix, setLockFinix] = useState('')
  const [click, setClick] = useState(false)
  const [percent, setPercent] = useState(0)
  const [isDisabled, setIsDisabled] = useState(false)
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [transactionHash, setTransactionHash] = useState('')
  const MAX_INT = '115792089237316195423570985008687907853269984665640564039457584007913129639935'
  const { onApprove } = useApprove(MAX_INT)
  const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)

  function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      setValue(nextUserInput)
    }
  }
  const handleChange = (e) => {
    enforcer(e.target.value.replace(/,/g, '.'))
  }

  const _minimum1 = new BigNumber(_.get(allLock, '0._minimum1')).dividedBy(new BigNumber(10).pow(18)).toNumber()
  const _minimum2 = new BigNumber(_.get(allLock, '0._minimum2')).dividedBy(new BigNumber(10).pow(18)).toNumber()
  const _minimum3 = new BigNumber(_.get(allLock, '0._minimum3')).dividedBy(new BigNumber(10).pow(18)).toNumber()

  useEffect(() => {
    if (period === 1) {
      const asMinutes = moment.duration({ seconds: _.get(allLock, '0.period1_') }).asMinutes()
      let now = new Date()
      now.setMinutes(now.getMinutes() + asMinutes)
      now = new Date(now)
      setLevel(0)
      setDate(moment(now).format('DD-MM-YYYY HH:mm:ss'))
    } else if (period === 2) {
      const asMinutes = moment.duration({ seconds: _.get(allLock, '0.period2_') }).asMinutes()
      let now = new Date()
      now.setMinutes(now.getMinutes() + asMinutes)
      now = new Date(now)
      setLevel(1)
      setDate(moment(now).format('DD-MM-YYYY HH:mm:ss'))
    } else if (period === 4) {
      const asMinutes = moment.duration({ seconds: _.get(allLock, '0.period3_') }).asMinutes()
      let now = new Date()
      now.setMinutes(now.getMinutes() + asMinutes)
      now = new Date(now)
      setLevel(2)
      setDate(moment(now).format('DD-MM-YYYY HH:mm:ss'))
    }
    setVFINIX(numeral(Number(value.replace(',', '')) * period).format('0,0.00'))
    setLockFinix(new BigNumber(parseFloat(value)).times(new BigNumber(10).pow(18)).toFixed())
  }, [period, allLock, value])

  const { onStake, status } = useLock(letvel, lockFinix, click)

  useEffect(() => {
    if (status) {
      setVFINIX(0)
      setValue('')
      setDate('00-00-00 00:00:00')
      setPeriod(0)
    }
  }, [status])

  useEffect(() => {
    if (value === '0.00') {
      setIsDisabled(true)
    } else if (value === '') {
      setIsDisabled(true)
    } else if (Number(value) > Number(balanceOf)) {
      setIsDisabled(true)
    } else if (period === 0) {
      setIsDisabled(true)
    } else if (period === 1 && Number(value) < _minimum1) {
      setIsDisabled(true)
    } else if (period === 2 && Number(value) < _minimum2) {
      setIsDisabled(true)
    } else if (period === 4 && Number(value) < _minimum3) {
      setIsDisabled(true)
    } else {
      setIsDisabled(false)
    }
  }, [value, period, balanceOf, _minimum1, _minimum2, _minimum3])

  const renderApprovalOrStakeButton = () => {
    return isApproved || transactionHash !== '' ? (
      <Button fullWidth disabled={isDisabled} className="align-self-center" radii="small" onClick={onStake}>
        Stake
      </Button>
    ) : (
      <Button fullWidth className="align-self-center" radii="small" onClick={handleApprove}>
        Approve Contract
      </Button>
    )
  }

  useEffect(() => {
    const percentOf = percent * Number(balanceOf)
    if (percentOf) {
      setValue(percentOf.toString())
    }
  }, [percent, balanceOf])

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      if (txHash) {
        setTransactionHash(_.get(txHash, 'transactionHash'))
      }
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, setRequestedApproval])

  const handleCol = () => {
    return percent === 1 ? 'col-6' : 'col-4'
  }

  const handlePercent = () => {
    return percent === 1 ? 'col-4' : 'col-8'
  }

  return (
    <div className={`align-stretch mt-5 ${isMobileOrTablet ? 'flex-wrap' : ''}`}>
      <FinixStake className="flex">
        <div className={`pa-5 ${isMobileOrTablet ? 'col-12' : 'col-8 pr-0'}`}>
          <Heading as="h1" fontSize="20px !important" className="mb-4">
            Stake FINIX get vFINIX
          </Heading>
          <Text className="mt-4" color="textSubtle">
            Please select duration
          </Text>
          <StakePeriodButton period={period} setPeriod={setPeriod} />
          <div className="flex mt-4">
            <Text className="col-6" color="textSubtle">
              Deposit
            </Text>
            <Text className="col-6 text-right" color="textSubtle">
              Balance: {numeral(balanceOf).format('0,0.00000')}
            </Text>
          </div>
          <Balance>
            <div className={`${isMobileOrTablet ? 'col-12' : handleCol()}`}>
              <NumberInput placeholder="0.00" value={value} onChange={handleChange} pattern="^[0-9]*[,]?[0-9]*$" />
            </div>
            <Input className={`${isMobileOrTablet ? 'col-12' : handlePercent()}`}>
              {percent !== 1 && (
                <div className="flex align-center justify-end" style={{ width: isMobileOrTablet ? '100%' : 'auto' }}>
                  <StylesButton size="sm" onClick={() => setPercent(0.25)}>
                    25%
                  </StylesButton>
                  <StylesButton size="sm" onClick={() => setPercent(0.5)}>
                    50%
                  </StylesButton>
                  <StylesButton size="sm" onClick={() => setPercent(1)}>
                    MAX
                  </StylesButton>
                </div>
              )}
              <Coin>
                <img src={`/images/coins/${'FINIX'}.png`} alt="" />
              </Coin>
              <Heading as="h1" fontSize="18px !important">
                FINIX
              </Heading>
            </Input>
          </Balance>
          <div className="flex mt-4">
            <Text className="col-6" color={isDark ? 'white' : '#000000'}>
              Estimated Period End
            </Text>
            <Text className="col-6 text-right" color="#30ADFF">
              {date}
            </Text>
          </div>
          <div className="flex mt-2">
            <Text className="col-6" color={isDark ? 'white' : '#000000'}>
              vFINIX earn
            </Text>
            <div className="flex flex-row justify-end w-100">
              <Text className="text-right" color="#30ADFF">
                {vFINIX}
              </Text>
              <Text className="text-right ml-1" color={isDark ? 'white' : '#000000'}>
                vFINIX
              </Text>
            </div>
          </div>
          {!isDisabled && (
            <Text className="mt-2" fontSize="10px !important" color={isDark ? 'white' : 'textSubtle'}>
              x vFINIX will be received and the staking period will end in {date}. Unstaking before the period ends your
              FINIX amount will be locked x days and x% will be deducted from total balance.
            </Text>
          )}
          <div className="flex mt-4">
            {!account ? (
              <Button
                fullWidth
                className="align-self-center"
                radii="small"
                onClick={() => {
                  onPresentConnectModal()
                }}
              >
                Connect Wallet
              </Button>
            ) : (
              renderApprovalOrStakeButton()
            )}
          </div>
        </div>
        {!isMobileOrTablet && (
          <div className="col-4 pb-4">
            <img
              src={badgeLock}
              alt=""
              className="px-4"
              style={{ position: 'absolute', width: 'auto', height: '136px' }}
            />
            <div className="mt-4">
              <Apr color="white">APR</Apr>
              <Heading
                as="h1"
                style={{
                  position: 'relative',
                  textAlignLast: 'center',
                  textShadow: '#00000050 0px 2px 4px',
                }}
                color="white"
                fontSize="36px !important"
              >
                {`${numeral(apr || 0).format('0,0.[00]')}%`}
              </Heading>
            </div>

            <img src={definixLongTerm} alt="" className="pl-3 mt-8" />
          </div>
        )}
      </FinixStake>
    </div>
  )
}

export default CardStake
