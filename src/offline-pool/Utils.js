/* eslint-disable no-param-reassign */
import BigNumber from 'bignumber.js'
import Caver from 'caver-js'
import DefinixPair from './contracts/DefinixPair.json'
import IERC20 from './contracts/IERC20.json'

const caver = new Caver('https://kaikas.baobab.klaytn.net:8651/')

class Utils {
  static getPairData = async (_pairAddress) => {
    // eslint-disable-next-line
    const pairContract = new caver.contract(DefinixPair)

    const pairResults = await Promise.all([
      pairContract.methods.token0().call(),
      pairContract.methods.token1().call(),
      pairContract.methods.getReserves().call(),
    ])

    // eslint-disable-next-line
    const erc0 = new caver.contract(IERC20)
    // eslint-disable-next-line
    const erc1 = new caver.contract(IERC20)

    const tokenResults = await Promise.all([
      erc0.methods.symbol().call(),
      erc0.methods.decimals().call(),
      erc0.methods.balanceOf(_pairAddress).call(),
      erc1.methods.symbol().call(),
      erc1.methods.decimals().call(),
      erc1.methods.balanceOf(_pairAddress).call(),
    ])

    return {
      token0: pairResults[0],
      token1: pairResults[1],
      reserve0: pairResults[2][0],
      reserve1: pairResults[2][1],
      symbol0: tokenResults[0],
      symbol1: tokenResults[3],
      decimals0: tokenResults[1],
      decimals1: tokenResults[4],
      balanceOf0: tokenResults[2],
      balanceOf1: tokenResults[5],
    }
  }

  static transferFrom = (_context, _token, _from, _to, _amount) => {
    Utils._require(_from.balances[_token] && _from.balances[_token].isGreaterThan(_amount), 'INSUFFICIENT BALANCE')
    if (!_to.balances[_token]) {
      _to.balances[_token] = new BigNumber(0)
    }
    _from.balances[_token] = _from.balances[_token].minus(_amount)
    _to.balances[_token] = _to.balances[_token].plus(_amount)

    _context.addRollBackOperation(() => {
      _to.balances[_token] = _to.balances[_token].minus(_amount)
      _from.balances[_token] = _from.balances[_token].plus(_amount)
    })
  }

  static _require = (context, cond, message) => {
    if (!cond) {
      context.rollback()
      throw new Error(message)
    }
  }
}

export default Utils
