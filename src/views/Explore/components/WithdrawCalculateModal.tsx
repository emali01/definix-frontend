import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { useDispatch } from 'react-redux'
import { get } from 'lodash'
import { provider } from 'web3-core'
import { AbiItem } from 'web3-utils'
import { useTranslation } from 'react-i18next'
import rebalanceAbi from 'config/abi/rebalance.json'
import { Box, Button, Divider, Flex, Modal, ModalBody, ModalFooter, Text, useMatchBreakpoints } from 'definixswap-uikit-v2'
import { useWallet, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import * as klipProvider from 'hooks/klipProvider'
import { getAbiRebalanceByName } from 'hooks/hookHelper'
import { getCustomContract } from 'utils/erc20'
import { getAddress } from 'utils/addressHelpers'
import { useToast } from 'state/hooks'
import { fetchBalances, fetchRebalanceBalances } from '../../../state/wallet'

import CardHeading from './CardHeading'
import SpaceBetweenFormat from './SpaceBetweenFormat'
import InlineAssetRatioLabel from './InlineAssetRatioLabel'

const WithdrawCalculateModal = ({
  setTx,
  currentInput,
  isSimulating,
  toAllAssets,
  rebalance,
  selectedToken,
  currentBalance,
  tokenList,
  estimatedValue,
  onNext,
  onDismiss = () => null,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { toastSuccess, toastError } = useToast()

  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = !isXl && !isXxl
  const { setShowModal } = React.useContext(KlipModalContext())
  const { account, klaytn, connector } = useWallet()
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const handleLocalStorage = async (tx) => {
    const rebalanceAddress: string = getAddress(get(rebalance, 'address'))
    const { transactionHash } = tx
    const myInvestTxns = JSON.parse(
      localStorage.getItem(`my_invest_tx_${account}`) ? localStorage.getItem(`my_invest_tx_${account}`) : '{}',
    )

    if (myInvestTxns[rebalanceAddress]) {
      myInvestTxns[rebalanceAddress].push(transactionHash)
    } else {
      myInvestTxns[rebalanceAddress] = [transactionHash]
    }

    localStorage.setItem(`my_invest_tx_${account}`, JSON.stringify(myInvestTxns))
  }

  const onWithdraw = async () => {
    const rebalanceContract = getCustomContract(
      klaytn as provider,
      rebalanceAbi as unknown as AbiItem,
      getAddress(rebalance.address),
    )
    setIsWithdrawing(true)
    try {
      const thisInput = currentBalance.isLessThan(new BigNumber(currentInput))
        ? currentBalance
        : new BigNumber(currentInput)
      const usdToken = get(rebalance, 'usdToken.0', {})

      const lpAmount = thisInput.times(new BigNumber(10).pow(18)).toJSON()
      const outputRatios = (rebalance?.tokens || []).map((token, index) => {
        const tokenAddress = typeof token.address === 'string' ? token.address : getAddress(token.address)
        return selectedToken[tokenAddress]
          ? (((rebalance || {}).tokenRatioPoints || [])[index] || new BigNumber(0)).toNumber()
          : 0
      })
      const outputUSDRatio = selectedToken[
        typeof usdToken.address === 'string' ? usdToken.address : getAddress(usdToken.address)
      ]
        ? (((rebalance || {}).usdTokenRatioPoint || [])[0] || new BigNumber(0)).toNumber()
        : 0

      if (connector === 'klip') {
        klipProvider.genQRcodeContactInteract(
          getAddress(rebalance.address),
          JSON.stringify(getAbiRebalanceByName('removeFund')),
          JSON.stringify([lpAmount, toAllAssets, outputRatios, outputUSDRatio]),
          setShowModal,
        )
        const tx = await klipProvider.checkResponse()
        setTx(tx)
        handleLocalStorage(tx)
      } else {
        const tx = await rebalanceContract.methods
          .removeFund(lpAmount, toAllAssets, outputRatios, outputUSDRatio)
          .send({ from: account, gas: 5000000 })
        setTx(tx)
        handleLocalStorage(tx)
      }
      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, assetAddresses))
      dispatch(fetchRebalanceBalances(account, [rebalance]))
      toastSuccess(t('{{Action}} Complete', { Action: t('actionWithdraw') }))
      onNext()
      onDismiss()
      setIsWithdrawing(false)
    } catch (e) {
      toastError(t('{{Action}} Failed', { Action: t('actionWithdraw') }))
      setIsWithdrawing(false)
    }
  }
  return (
    <Modal title={t('Confirm Withdraw')} mobileFull onDismiss={onDismiss}>
      <ModalBody>
        <CardHeading
          rebalance={rebalance}
          isHorizontal={isMobile}
          onlyTitle
          className={`bd-b ${isMobile ? 'pb-s24' : 'pb-s32'}`}
        />
        <Text color="text" textStyle="R_16M" className="mt-s24 mb-s12">
          {t('Withdrawal Amount')}
        </Text>
        <Box className="bd pa-s24 pt-s12" borderRadius="8px" width="438px">
          {tokenList.map((c) => (
            <InlineAssetRatioLabel small key={c.symbol} coin={c} column={isMobile} />
          ))}
          <Divider mt="S_12" mb="S_20" />
          <Flex color="text" alignItems="center" justifyContent="flex-end" mb="S_16">
            <Text textStyle="R_16M" className="flex-auto">
              {t('Total Withdraw')}
            </Text>
            <Text color="black" textStyle="R_18B" ml="auto">
              {currentInput}
            </Text>
            <Text textStyle="R_14R" ml="S_4">
              {t('SHR')}
            </Text>
          </Flex>
          <Flex flexDirection="column" color="textSubtle" textStyle="R_14R">
            <SpaceBetweenFormat title={t('Estimated Value')} value={estimatedValue} />
          </Flex>
        </Box>
      </ModalBody>
      <ModalFooter>
        <Button mt="S_40" width="100%" isLoading={isSimulating || isWithdrawing} onClick={onWithdraw}>
          {t('Withdraw')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default WithdrawCalculateModal
