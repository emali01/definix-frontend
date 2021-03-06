import BigNumber from 'bignumber.js'
import ModalInput from 'components/ModalInput'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Modal } from 'uikit-dev'
import useI18n from '../../../hooks/useI18n'
import { getFullDisplayBalance } from '../../../utils/formatBalance'

interface WithdrawModalProps {
  max: BigNumber
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  renderCardHeading?: (className?: string) => JSX.Element
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onConfirm, onDismiss, max, renderCardHeading }) => {
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
    // console.log(fullBalance)
    // console.log(new BigNumber(fullBalance).toFixed(7).toString())
    // console.log(new BigNumber(fullBalance).toFixed(7).toString().slice(0, -1))
    setVal(fullBalance)
  }, [fullBalance, setVal])

  return (
    <Modal
      title=""
      onBack={onDismiss}
      onDismiss={onDismiss}
      isRainbow={false}
      bodyPadding="0 32px 32px 32px"
      hideCloseButton
      classHeader="bd-b-n"
    >
      {renderCardHeading('mb-5')}

      <ModalInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol="FINIX"
        inputTitle={TranslateString(1070, 'Unstake')}
      />

      <Button
        fullWidth
        className="mt-5"
        radii="card"
        disabled={pendingTx}
        onClick={async () => {
          setPendingTx(true)
          await onConfirm(val)
          setPendingTx(false)
          onDismiss()
        }}
      >
        {pendingTx ? TranslateString(488, 'Pending') : TranslateString(464, `Remove FINIX`)}
      </Button>
    </Modal>
  )
}

export default WithdrawModal
