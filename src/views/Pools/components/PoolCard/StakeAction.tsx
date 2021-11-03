import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import BigNumber from 'bignumber.js'
import UnlockButton from 'components/UnlockButton'
import { useSousApprove } from 'hooks/useApprove'
import { useERC20 } from 'hooks/useContract'
import useI18n from 'hooks/useI18n'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { AddIcon, Button, Heading, MinusIcon, Text } from 'uikit-dev'
import { getBalanceNumber } from 'utils/formatBalance'
import numeral from 'numeral'
import { StakeActionProps } from './types'

const IconButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  svg {
    width: 20px;
  }
`

const StakeAction: React.FC<StakeActionProps> = ({
  sousId,
  isOldSyrup,
  tokenName,
  stakingTokenAddress,
  stakedBalance,
  needsApproval,
  isFinished,
  onUnstake,
  onPresentDeposit,
  onPresentWithdraw,
  className = '',
}) => {
  const TranslateString = useI18n()

  const [requestedApproval, setRequestedApproval] = useState(false)
  const [readyToStake, setReadyToStake] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)

  const { account } = useWallet()
  const stakingTokenContract = useERC20(stakingTokenAddress)

  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const displayBalance = numeral(rawStakedBalance || 0).format('0,0.0[0000000000]')

  const { onApprove } = useSousApprove(stakingTokenContract, sousId)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, setRequestedApproval])

  return (
    <div className={className}>
      <Text textAlign="left" className="mb-2" color="textSubtle">{`${tokenName} ${TranslateString(
        1074,
        'Staked',
      )}`}</Text>
      {account ? (
        <>
          {needsApproval && !isOldSyrup ? (
            <Button fullWidth radii="small" disabled={isFinished || requestedApproval} onClick={handleApprove}>
              Approve Contract
            </Button>
          ) : (
            <div className="flex align-center">
              <Heading
                fontSize="20px !important"
                textAlign="left"
                color={getBalanceNumber(stakedBalance) === 0 ? 'textDisabled' : 'text'}
                className="col-6 pr-3"
              >
                {displayBalance}
              </Heading>

              <div className="col-6">
                {
                  !readyToStake && stakedBalance.eq(new BigNumber(0)) && !isFinished ? (
                    <Button
                      onClick={() => {
                        setReadyToStake(true)
                      }}
                      fullWidth
                      radii="small"
                    >
                      {TranslateString(999, 'Stake LP')}
                    </Button>
                  ) : (
                    <IconButtonWrapper>
                      <Button
                        variant="secondary"
                        disabled={stakedBalance.eq(new BigNumber(0)) || pendingTx}
                        onClick={
                          isOldSyrup
                            ? async () => {
                                setPendingTx(true)
                                await onUnstake('0')
                                setPendingTx(false)
                              }
                            : onPresentWithdraw
                        }
                        className="btn-secondary-disable col-6 mr-1"
                      >
                        <MinusIcon color="primary" />
                      </Button>

                      {!isOldSyrup && !isFinished && (
                        <Button
                          variant="secondary"
                          disabled={isFinished && sousId !== 0}
                          onClick={onPresentDeposit}
                          className="btn-secondary-disable col-6 ml-1"
                        >
                          <AddIcon color="primary" />
                        </Button>
                      )}
                    </IconButtonWrapper>
                  )
                }
              </div>
            </div>
          )}
        </>
      ) : (
        <UnlockButton fullWidth radii="small" />
      )}
    </div>
  )
}

export default StakeAction
