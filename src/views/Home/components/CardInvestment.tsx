import React, { useMemo } from 'react'
import { Card, CardBody, ColorStyles, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import Earned from 'views/MyInvestments/components/Earned'

const CardInvestment = () => {
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])

  return (
    <Card bg={ColorStyles.DEEPBROWN} isOverflowHidden>
      <CardBody p="0">
        <Earned isMain isMobile={isMobile} theme="dark" />
      </CardBody>
    </Card>
  )
}

export default CardInvestment