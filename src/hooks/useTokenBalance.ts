import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import finixABI from 'config/abi/finix.json'
import { getContract } from 'utils/web3'
import { getTokenBalance } from 'utils/erc20'
import { getFinixAddress } from 'utils/addressHelpers'
import useWeb3 from './useWeb3'
import useRefresh from './useRefresh'

const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTokenBalance(ethereum, tokenAddress, account)
      setBalance(new BigNumber(res))
    }

    if (account && ethereum) {
      fetchBalance()
    }
  }, [account, ethereum, tokenAddress, fastRefresh])

  return balance
}

export const useTotalSupply = () => {
  const { slowRefresh } = useRefresh()
  const finixBurned = useBurnedBalance(getFinixAddress())
  const [totalSupply, setTotalSupply] = useState<BigNumber>()

  useEffect(() => {
    async function fetchTotalSupply() {
      const finixContract = getContract(finixABI, getFinixAddress())
      const supply = await finixContract.methods.totalSupply().call()
      setTotalSupply(new BigNumber(supply).minus(finixBurned))
    }

    fetchTotalSupply()
  }, [slowRefresh, finixBurned])

  return totalSupply
}

export const useBurnedBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { slowRefresh } = useRefresh()
  const web3 = useWeb3()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTokenBalance(
        web3.currentProvider,
        tokenAddress,
        '0x000000000000000000000000000000000000dEaD',
      )
      setBalance(new BigNumber(res))
    }

    fetchBalance()
  }, [web3, tokenAddress, slowRefresh])

  return balance
}

export default useTokenBalance
