/* eslint-disable no-shadow */
import { useEffect, useState, useCallback, useContext } from 'react'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { useWallet, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import { provider } from 'web3-core'
import {
  getAbiERC20ByName,
  getAbiVaultPenaltyFacetByName,
  getAbiVaultFacetByName,
  getAbiRewardFacetByName,
  getAbiHerodotusByName,
} from 'hooks/hookHelper'
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import * as klipProvider from 'hooks/klipProvider'
import { soushHarvestBnb, soushHarvest } from 'utils/callHelpers'
import {
  fetchPrivateData,
  fetchPendingReward,
  fetchAllLockPeriods,
  fetchFarmUserDataAsync,
  updateUserBalance,
  updateUserPendingReward,
} from '../state/actions'
import VaultInfoFacet from '../config/abi/VaultInfoFacet.json'
import IKIP7 from '../config/abi/IKIP7.json'
import VaultFacet from '../config/abi/VaultFacet.json'
import RewardFacet from '../config/abi/RewardFacet.json'
import VaultPenaltyFacet from '../config/abi/VaultPenaltyFacet.json'
import VFinixMergeAbi from '../config/abi/VFinixMergeAbi.json'
import { getContract } from '../utils/caver'
import { getTokenBalance } from '../utils/erc20'
import { getFinixAddress, getVFinix } from '../utils/addressHelpers'
import useRefresh from './useRefresh'
import { State } from '../state/types'
import { useHerodotus, useSousChef } from './useContract'
/* eslint no-else-return: "error" */

// @ts-ignore
const useLongTermStake = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account, klaytn }: { account: string; klaytn: provider } = useWallet()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getTokenBalance(klaytn, tokenAddress, account)
      setBalance(new BigNumber(res))
    }

    if (account && klaytn) {
      fetchBalance()
    }
  }, [account, klaytn, tokenAddress, fastRefresh])

  return balance
}

export const useTotalSupply = () => {
  const { fastRefresh } = useRefresh()
  const [totalSupply, setTotalSupply] = useState<string>()

  useEffect(() => {
    async function fetchTotalSupply() {
      const callContract = getContract(IKIP7.abi, getVFinix())
      const total = await callContract.methods.totalSupply().call()
      setTotalSupply(new BigNumber(total).dividedBy(new BigNumber(10).pow(18)).toString())
    }

    fetchTotalSupply()
  }, [fastRefresh])

  return totalSupply
}

export const useTotalFinixLock = () => {
  const { fastRefresh } = useRefresh()
  const [totalFinixLock, setTotalFinixLock] = useState([])

  useEffect(() => {
    async function fetchTotalFinixLock() {
      const callContract = getContract(VaultFacet.abi, getVFinix())
      const finixLock = await callContract.methods.getTotalFinixLock().call()
      const finixLockMap = []
      for (let i = 0; i < 3; i++) {
        _.set(
          finixLockMap,
          `${i}`,
          numeral(
            new BigNumber(_.get(finixLock, `totalFinixLockAtLevel${i + 1}_`)).dividedBy(new BigNumber(10).pow(18)),
          ).format('0'),
        )
      }
      setTotalFinixLock(finixLockMap)
    }

    fetchTotalFinixLock()
  }, [fastRefresh])

  return totalFinixLock
}

export const useBalances = () => {
  const { fastRefresh } = useRefresh()
  const [balance, setBalanceOf] = useState(new BigNumber(0))
  const { account } = useWallet()

  useEffect(() => {
    async function fetchBalance() {
      const callContract = getContract(IKIP7.abi, getFinixAddress())
      try {
        const balanceOf = await callContract.methods.balanceOf(account).call()
        setBalanceOf(new BigNumber(balanceOf).dividedBy(new BigNumber(10).pow(18)))
      } catch (e) {
        setBalanceOf(null)
      }
    }

    fetchBalance()
  }, [fastRefresh, account])

  return balance
}

export const usePrivateData = () => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  const { account } = useWallet()
  const startIndex = useSelector((state: State) => state.longTerm.startIndex)
  const allLockPeriod = useSelector((state: State) => state.longTerm.allLockPeriods)

  useEffect(() => {
    if (account) {
      dispatch(fetchPrivateData(account, startIndex, allLockPeriod))
      dispatch(fetchPendingReward(account))
    }
  }, [fastRefresh, account, dispatch, startIndex, allLockPeriod])

  const lockAmount = useSelector((state: State) => state.longTerm.userLockAmount)
  const finixEarn = useSelector((state: State) => state.longTerm.finixEarn)
  const allDataLock = useSelector((state: State) => state.longTerm.allDataLock)
  const balancefinix = useSelector((state: State) => state.longTerm.balanceFinix)
  const balancevfinix = useSelector((state: State) => state.longTerm.balancevFinix)
  return { lockAmount, finixEarn, startIndex, allDataLock, balancefinix, balancevfinix }
}

export const useAllLock = () => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAllLockPeriods())
  }, [fastRefresh, dispatch])

  const allLockPeriod = useSelector((state: State) => state.longTerm.allLockPeriods)
  return { allLockPeriod }
}

export const usePendingReward = () => {
  const { slowRefresh } = useRefresh()
  const [pendingReward, setPendingReward] = useState(new BigNumber(0))
  const { account } = useWallet()

  useEffect(() => {
    async function fetchReward() {
      const callContract = getContract(RewardFacet.abi, getVFinix())
      try {
        const reward = await callContract.methods.pendingReward(account).call()
        setPendingReward(new BigNumber(reward).dividedBy(new BigNumber(10).pow(18)))
      } catch (e) {
        setPendingReward(null)
      }
    }

    fetchReward()
  }, [slowRefresh, account])

  return pendingReward
}

export const useAllowance = () => {
  const { slowRefresh } = useRefresh()
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account } = useWallet()

  useEffect(() => {
    async function fetchAllowance() {
      const callContract = getContract(IKIP7.abi, getFinixAddress())
      try {
        const res = await callContract.methods.allowance(account, getVFinix()).call()
        setAllowance(new BigNumber(res).dividedBy(new BigNumber(10).pow(18)))
      } catch (e) {
        setAllowance(null)
      }
    }

    fetchAllowance()
  }, [slowRefresh, account])

  return allowance
}

export const useLockTopup = () => {
  const { slowRefresh } = useRefresh()
  const [topUp, setTopUp] = useState([])
  const { account } = useWallet()
  const startIndex = useSelector((state: State) => state.longTerm.startIndex)

  useEffect(() => {
    async function fetchTopUp() {
      const callContract = getContract(VaultInfoFacet.abi, getVFinix())
      try {
        const res = await callContract.methods.locksDesc(account, 0, 0).call({ from: account })
        setTopUp(res.locksTopup)
      } catch (e) {
        setTopUp(null)
      }
    }

    fetchTopUp()
  }, [slowRefresh, account, startIndex])

  return topUp
}

const handleContractExecute = (_executeFunction, _account) => {
  return new Promise((resolve, reject) => {
    _executeFunction.estimateGas({ from: _account }).then((estimatedGasLimit) => {
      _executeFunction.send({ from: _account, gas: estimatedGasLimit }).then(resolve).catch(reject)
    })
  })
}

export const useUnLock = () => {
  const { account, connector } = useWallet()
  const { setShowModal } = useContext(KlipModalContext())

  const onUnLock = async (id) => {
    if (connector === 'klip') {
      klipProvider.genQRcodeContactInteract(
        getVFinix(),
        JSON.stringify(getAbiVaultFacetByName('unlock')),
        JSON.stringify([id]),
        setShowModal,
      )
      await klipProvider.checkResponse()
      setShowModal(false)
      return new Promise((resolve, reject) => {
        resolve('')
      })
    }
    const callContract = getContract(VaultFacet.abi, getVFinix())
    return new Promise((resolve, reject) => {
      handleContractExecute(callContract.methods.unlock(id), account).then(resolve).catch(reject)
    })
  }

  return { unLock: onUnLock }
}

export const useLock = (level, lockFinix, focus) => {
  const [status, setStatus] = useState(false)
  const [loadings, setLoading] = useState('')
  const { account, connector } = useWallet()
  const { setShowModal } = useContext(KlipModalContext())

  const stake = useCallback(async () => {
    setStatus(false)
    setLoading('loading')
    if (lockFinix) {
      try {
        if (connector === 'klip') {
          klipProvider.genQRcodeContactInteract(
            getVFinix(),
            JSON.stringify(getAbiVaultFacetByName('lock')),
            JSON.stringify([level, lockFinix]),
            setShowModal,
          )
          await klipProvider.checkResponse()
          setShowModal(false)
          setLoading('success')
          setStatus(true)
          setInterval(() => setLoading(''), 5000)
          setInterval(() => setStatus(false), 5000)
        } else {
          const callContract = getContract(VaultFacet.abi, getVFinix())
          await callContract.methods
            .lock(level, lockFinix)
            .estimateGas({ from: account })
            .then((estimatedGasLimit) => {
              callContract.methods
                .lock(level, lockFinix)
                .send({ from: account, gas: estimatedGasLimit })
                .then((resolve) => {
                  setLoading('success')
                  setStatus(true)
                  setInterval(() => setLoading(''), 5000)
                  setInterval(() => setStatus(false), 5000)
                })
                .catch((e) => {
                  setLoading('')
                  setStatus(false)
                })
            })
        }
      } catch (e) {
        setStatus(false)
      }
    } else {
      setStatus(false)
    }

    return status
  }, [account, level, lockFinix, status, connector, setShowModal])

  return { onStake: stake, status, loadings }
}

export const useHarvest = () => {
  const { account, connector } = useWallet()
  const { setShowModal } = useContext(KlipModalContext())

  const handleHarvest = useCallback(async () => {
    if (connector === 'klip') {
      klipProvider.genQRcodeContactInteract(
        getVFinix(),
        JSON.stringify(getAbiRewardFacetByName('harvest')),
        JSON.stringify([account]),
        setShowModal,
      )
      await klipProvider.checkResponse()
      setShowModal(false)
      return new Promise((resolve, reject) => {
        resolve('ok')
      })
    }
    const callContract = getContract(RewardFacet.abi, getVFinix())
    return new Promise((resolve, reject) => {
      handleContractExecute(callContract.methods.harvest(account), account).then(resolve).catch(reject)
    })
  }, [account, connector, setShowModal])

  return { handleHarvest }
}

export const useApprove = (max) => {
  const { account, connector } = useWallet()
  const { setShowModal } = useContext(KlipModalContext())

  const onApprove = useCallback(async () => {
    if (connector === 'klip') {
      klipProvider.genQRcodeContactInteract(
        getFinixAddress(),
        JSON.stringify(getAbiERC20ByName('approve')),
        JSON.stringify([getVFinix(), klipProvider.MAX_UINT_256_KLIP]),
        setShowModal,
      )
      const txHash = await klipProvider.checkResponse()
      setShowModal(false)
      return new Promise((resolve, reject) => {
        resolve(txHash)
      })
    }
    const callContract = getContract(IKIP7.abi, getFinixAddress())
    return new Promise((resolve, reject) => {
      handleContractExecute(callContract.methods.approve(getVFinix(), max), account).then(resolve).catch(reject)
    })
  }, [account, max, connector, setShowModal])

  return { onApprove }
}
export const useAprCardFarmHome = () => {
  const { account } = useWallet()
  const { slowRefresh } = useRefresh()
  const [apr, setApr] = useState<number>()

  useEffect(() => {
    async function fetchApr() {
      const rewardFacetContract = getContract(RewardFacet.abi, getVFinix())
      const finixContract = getContract(IKIP7.abi, getVFinix())
      const userVfinixInfoContract = getContract(VaultInfoFacet.abi, getVFinix())

      const [rewardPerBlockNumber, totalSupplyNumber, userVfinixAmount] = await Promise.all([
        await rewardFacetContract.methods.rewardPerBlock().call(),
        await finixContract.methods.totalSupply().call(),
        await userVfinixInfoContract.methods.locks(account, 0, 0).call(),
      ])
      const rewardPerBlock = new BigNumber(rewardPerBlockNumber).multipliedBy(86400).multipliedBy(365)
      const totalSupply = new BigNumber(totalSupplyNumber)

      let totalVfinixUser = new BigNumber(0)
      let totalfinixUser = new BigNumber(0)
      for (let i = 0; i < userVfinixAmount.length; i++) {
        const selector = userVfinixAmount[i]
        if (selector.isUnlocked === false && selector.isPenalty === false) {
          totalVfinixUser = totalVfinixUser.plus(selector.voteAmount)
          totalfinixUser = totalfinixUser.plus(selector.lockAmount)
        }
      }

      const aprUser = totalVfinixUser
        .dividedBy(totalSupply)
        .multipliedBy(rewardPerBlock)
        .dividedBy(totalfinixUser)
        .multipliedBy(100)
      // locks
      setApr(aprUser.toNumber())
    }

    fetchApr()
  }, [slowRefresh, account])

  return apr
}
export const useApr = () => {
  // const { account } = useWallet()
  const { slowRefresh } = useRefresh()
  const [apr, setApr] = useState<number>()

  useEffect(() => {
    async function fetchApr() {
      const finixLock = getContract(RewardFacet.abi, getVFinix())
      const finixContract = getContract(IKIP7.abi, getVFinix())
      const supply = await finixLock.methods.rewardPerBlock().call()
      const total = await finixContract.methods.totalSupply().call()
      const totalSupply = new BigNumber(total).dividedBy(new BigNumber(10).pow(18)).toNumber()
      const reward = new BigNumber(supply).dividedBy(new BigNumber(10).pow(18)).toNumber()
      setApr(((reward * 86400 * 365) / Number(totalSupply)) * 100)
    }

    fetchApr()
  }, [slowRefresh])

  return apr
}

export const useRank = () => {
  const { account } = useWallet()
  const { slowRefresh } = useRefresh()
  const [rank, setRank] = useState<number>()

  useEffect(() => {
    async function fetchRank() {
      if (account) {
        const userVfinixInfoContract = getContract(VaultInfoFacet.abi, getVFinix())
        const [userVfinixLocks] = await Promise.all([await userVfinixInfoContract.methods.locks(account, 0, 0).call()])
        let maxRank = -1
        for (let i = 0; i < _.get(userVfinixLocks, 'locks_').length; i++) {
          const selector = _.get(userVfinixLocks, 'locks_')[i]

          if (selector.isUnlocked === false && selector.isPenalty === false) {
            if (maxRank < selector.level) maxRank = selector.level
          }
        }
        setRank(maxRank)
      }
    }

    fetchRank()
  }, [slowRefresh, account])

  return rank
}

export const useLockCount = () => {
  const { slowRefresh } = useRefresh()
  const [lockCount, setLockCount] = useState(0)
  const { account } = useWallet()

  useEffect(() => {
    async function fetchLockCount() {
      const callContract = getContract(VaultFacet.abi, getVFinix())
      try {
        const res = await callContract.methods.lockCount(account).call()
        setLockCount(res)
      } catch (e) {
        setLockCount(null)
      }
    }

    fetchLockCount()
  }, [slowRefresh, account])

  return lockCount
}

export const useUnstakeId = () => {
  const id = useSelector((state: State) => {
    return state.longTerm.id
  })

  const level = useSelector((state: State) => {
    return state.longTerm.level
  })

  const amount = useSelector((state: State) => {
    return state.longTerm.amount
  })

  const isPenalty = useSelector((state: State) => {
    return state.longTerm.isPenalty
  })

  const canBeUnlock = useSelector((state: State) => {
    return state.longTerm.canBeUnlock
  })

  const penaltyRate = useSelector((state: State) => {
    return state.longTerm.penaltyRate
  })

  const periodPenalty = useSelector((state: State) => {
    return state.longTerm.periodPenalty
  })

  const totalFinixLock = useSelector((state: State) => {
    return state.longTerm.totalFinixLock
  })

  const totalvFinixSupply = useSelector((state: State) => {
    return state.longTerm.totalvFinixSupply
  })

  const finixLockMap = useSelector((state: State) => {
    return state.longTerm.finixLockMap
  })

  const totalSupplyAllTimeMint = useSelector((state: State) => {
    return state.longTerm.totalSupplyAllTimeMint
  })
  const multiplier = useSelector((state: State) => {
    return state.longTerm.multiplier
  })
  const days = useSelector((state: State) => {
    return state.longTerm.days
  })

  const vFinixPrice = useSelector((state: State) => {
    return state.longTerm.vFinixPrice
  })

  const lockCount = useSelector((state: State) => {
    return state.longTerm.lockCount
  })

  return {
    id,
    level,
    amount,
    isPenalty,
    canBeUnlock,
    penaltyRate,
    periodPenalty,
    totalFinixLock,
    totalvFinixSupply,
    finixLockMap,
    totalSupplyAllTimeMint,
    multiplier,
    days,
    vFinixPrice,
    lockCount,
    // lockAmount
  }
}

export const useClaim = () => {
  const { account, connector } = useWallet()
  const { setShowModal } = useContext(KlipModalContext())

  const handleClaim = async (id) => {
    if (connector === 'klip') {
      klipProvider.genQRcodeContactInteract(
        getVFinix(),
        JSON.stringify(getAbiVaultPenaltyFacetByName('claimWithPenalty')),
        JSON.stringify([id]),
        setShowModal,
      )
      const txHash = await klipProvider.checkResponse()
      setShowModal(false)
      return new Promise((resolve, reject) => {
        resolve(txHash)
      })
    }
    const callContract = getContract(VaultPenaltyFacet.abi, getVFinix())
    return new Promise((resolve, reject) => {
      handleContractExecute(callContract.methods.claimWithPenalty(id), account).then(resolve).catch(reject)
    })
  }

  return { onClaim: handleClaim }
}

// @ts-ignore
export const useSousHarvest = () => {
  const dispatch = useDispatch()
  const { account, connector } = useWallet()
  const herodotusContract = useHerodotus()
  const { setShowModal } = useContext(KlipModalContext())

  const handleHarvest = useCallback(
    async (sousId) => {
      if (connector === 'klip') {
        // setShowModal(true)

        if (sousId === 0) {
          klipProvider.genQRcodeContactInteract(
            herodotusContract._address,
            jsonConvert(getAbiHerodotusByName('leaveStaking')),
            jsonConvert(['0']),
            setShowModal,
          )
        } else {
          klipProvider.genQRcodeContactInteract(
            herodotusContract._address,
            jsonConvert(getAbiHerodotusByName('deposit')),
            jsonConvert([sousId, '0']),
            setShowModal,
          )
        }
        const tx = await klipProvider.checkResponse()

        setShowModal(false)
        dispatch(fetchFarmUserDataAsync(account))
        console.info(tx)
      }
      if (sousId === 0) {
        return new Promise((resolve, reject) => {
          herodotusContract.methods.leaveStaking('0').send({ from: account, gas: 300000 }).then(resolve).catch(reject)
        })
      } else if (sousId === 1) {
        return new Promise((resolve, reject) => {
          herodotusContract.methods
            .deposit(sousId, '0')
            .send({ from: account, gas: 400000 })
            .then(resolve)
            .catch(reject)
        })
      }

      dispatch(updateUserPendingReward(sousId, account))
      dispatch(updateUserBalance(sousId, account))
      return handleHarvest
    },
    [account, dispatch, herodotusContract, connector, setShowModal],
  )

  return { onReward: handleHarvest }
}

const jsonConvert = (data: any) => JSON.stringify(data)
// FARMS
export const useSuperHarvest = () => {
  const dispatch = useDispatch()
  const { account, connector } = useWallet()
  const herodotusContract = useHerodotus()
  const countTransactions = useSelector((state: State) => state.longTerm.countTransactions)

  const { setShowModal } = useContext(KlipModalContext())

  const handleHarvest = useCallback(
    async (farmPid) => {
      if (connector === 'klip') {
        if (farmPid === 0) {
          klipProvider.genQRcodeContactInteract(
            herodotusContract._address,
            jsonConvert(getAbiHerodotusByName('leaveStaking')),
            jsonConvert(['0']),
            setShowModal,
          )
        } else {
          klipProvider.genQRcodeContactInteract(
            herodotusContract._address,
            jsonConvert(getAbiHerodotusByName('deposit')),
            jsonConvert([farmPid, '0']),
            setShowModal,
          )
        }
        const tx = await klipProvider.checkResponse()

        setShowModal(false)
        dispatch(fetchFarmUserDataAsync(account))
        console.info(tx)
        return tx
      }

      dispatch(fetchFarmUserDataAsync(account))

      return new Promise((resolve, reject) => {
        herodotusContract.methods.deposit(farmPid, '0').send({ from: account, gas: 400000 }).then(resolve).catch(reject)
      })
    },
    [account, dispatch, herodotusContract, setShowModal, connector],
  )

  return { onSuperHarvest: handleHarvest }
}

export const useAllDataLock = () => {
  const { account } = useWallet()
  const { slowRefresh } = useRefresh()
  const [levelStake, setLevelStake] = useState([])
  const [allLock, setAllLock] = useState([])

  useEffect(() => {
    async function fetchApr() {
      if (account) {
        const userVfinixInfoContract = getContract(VaultInfoFacet.abi, getVFinix())
        const [userVfinixAmount] = await Promise.all([await userVfinixInfoContract.methods.locks(account, 0, 0).call()])
        const level = _.get(userVfinixAmount, 'locks_')
        const countLevel = []
        const idNTopup = []
        for (let i = 0; i < level.length; i++) {
          const selector = level[i]
          idNTopup.push({
            id: _.get(selector, 'id'),
            isUnlocked: _.get(selector, 'isUnlocked'),
            isPenalty: _.get(selector, 'isPenalty'),
            level: _.get(selector, 'level') * 1 + 1,
          })
          if (selector.isUnlocked === false && selector.isPenalty === false) {
            countLevel.push(_.get(selector, 'level'))
          }
        }
        setAllLock(idNTopup)

        const dup = countLevel.filter((val, i) => {
          return countLevel.indexOf(val) === i
        })
        setLevelStake(dup)
      }
    }

    fetchApr()
  }, [slowRefresh, account])

  return { levelStake, allLock }
}

export default useLongTermStake
