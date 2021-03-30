import {
  getPancakeProfileAddress,
  getPancakeRabbitsAddress,
  getBunnyFactoryAddress,
  getBunnySpecialAddress,
} from 'utils/addressHelpers'
import { getContract } from 'utils/web3'
import profileABI from 'config/abi/definixProfile.json'
import definixRabbitsAbi from 'config/abi/definixRabbits.json'
import bunnyFactoryAbi from 'config/abi/bunnyFactory.json'
import bunnySpecialAbi from 'config/abi/bunnySpecial.json'

export const getProfileContract = () => {
  return getContract(profileABI, getPancakeProfileAddress())
}

export const getPancakeRabbitContract = () => {
  return getContract(definixRabbitsAbi, getPancakeRabbitsAddress())
}

export const getBunnyFactoryContract = () => {
  return getContract(bunnyFactoryAbi, getBunnyFactoryAddress())
}

export const getBunnySpecialContract = () => {
  return getContract(bunnySpecialAbi, getBunnySpecialAddress())
}

export default null
