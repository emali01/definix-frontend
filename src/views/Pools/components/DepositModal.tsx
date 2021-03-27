import BigNumber from 'bignumber.js'
import ModalActions from 'components/ModalActions'
import ModalInput from 'components/ModalInput'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, LinkExternal, Modal } from 'uikit-dev'
import { getFullDisplayBalance } from 'utils/formatBalance'
import useI18n from '../../../hooks/useI18n'

interface DepositModalProps {
  max: BigNumber
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
}

const DepositModal: React.FC<DepositModalProps> = ({ max, onConfirm, onDismiss, tokenName = '' }) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  return (
    <Modal title={`${TranslateString(316, 'Stake')} ${tokenName}`} onDismiss={onDismiss} isRainbow>
      <ModalInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
      />
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss}>
          {TranslateString(462, 'Cancel')}
        </Button>
        <Button
          disabled={pendingTx}
          onClick={async () => {
            setPendingTx(true)
            await onConfirm(val)
            setPendingTx(false)
            onDismiss()
          }}
        >
          {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Confirm')}
        </Button>
      </ModalActions>
      <div className="flex justify-center mb-2">
        <LinkExternal href="https://youngexchange.definix.com/#/swap" style={{ alignSelf: 'center' }}>
          Buy {tokenName}
        </LinkExternal>
      </div>
    </Modal>
  )
}

export default DepositModal
