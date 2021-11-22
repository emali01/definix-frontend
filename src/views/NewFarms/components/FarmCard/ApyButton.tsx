import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { CalculatorIcon, IconButton, useModal, ButtonScales } from 'definixswap-uikit'
import ApyCalculatorModal from './ApyCalculatorModal'

export interface ApyButtonProps {
  lpLabel?: string
  apy?: BigNumber
  addLiquidityUrl?: string
}

const ApyButton: React.FC<ApyButtonProps> = ({ lpLabel, apy, addLiquidityUrl }) => {
  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal lpLabel={lpLabel} apy={apy} addLiquidityUrl={addLiquidityUrl} />,
  )

  return (
    <IconButton onClick={onPresentApyModal} scale={ButtonScales.ICON} variant="text" p={0} style={{ height: '26px' }}>
      <CalculatorIcon />
    </IconButton>
  )
}

export default ApyButton
