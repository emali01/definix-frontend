import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from '@kanthakarn-test/klaytn-use-wallet'
import { Contract } from 'web3-eth-contract'
import { useFinix, useLottery } from './useContract'
import { getAllowance } from '../utils/erc20'

// Retrieve lottery allowance
export const useLotteryAllowance = () => {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const lotteryContract = useLottery()
  const finixContract = useFinix()

  useEffect(() => {
    const fetchAllowance = async () => {
      const res = await getAllowance(finixContract, lotteryContract, account)
      setAllowance(new BigNumber(res))
    }

    if (account && finixContract && finixContract) {
      fetchAllowance()
    }
    const refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, finixContract, lotteryContract])

  return allowance
}

// Retrieve IFO allowance
export const useIfoAllowance = (tokenContract: Contract, spenderAddress: string, dependency?: any) => {
  const { account }: { account: string } = useWallet()
  const [allowance, setAllowance] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await tokenContract.methods.allowance(account, spenderAddress).call()
        setAllowance(new BigNumber(res))
      } catch (e) {
        setAllowance(null)
      }
    }
    fetch()
  }, [account, spenderAddress, tokenContract, dependency])

  return allowance
}
