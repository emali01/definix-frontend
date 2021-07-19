import React from 'react'
import { Card, Text } from 'uikit-dev'
import Helper from 'uikit-dev/components/Helper'

interface WithDrawalFeesType {
  className?: string
}

const WithDrawalFees: React.FC<WithDrawalFeesType> = ({ className = '' }) => {
  return (
    <Card className={`pa-4 ${className}`}>
      <Text bold className="mb-1">
        WITHDRAWAL FEES
      </Text>

      <div className="flex">
        <div className="col-4 flex align-center">
          <Text fontSize="12px">Management fee</Text>
          <Helper text="xxx" className="mx-2" position="top" />
          <Text>0.2%</Text>
        </div>
        <div className="col-4 flex align-center">
          <Text fontSize="12px">FINIX buy back fee</Text>
          <Helper text="xxx" className="mx-2" position="top" />
          <Text>0.3%</Text>
        </div>
        <div className="col-4 flex align-center">
          <Text fontSize="12px">Bounty Fee</Text>
          <Helper text="xxx" className="mx-2" position="top" />
          <Text>0.3%</Text>
        </div>
      </div>

      <div className="flex mt-2">
        <Text fontSize="12px">(</Text>
        <Text fontSize="12px" color="primary" className="mr-1">
          +0.5% fee
        </Text>
        <Text fontSize="12px">for EARLY WITHDRAWALS within 1 day)</Text>
      </div>
    </Card>
  )
}

export default WithDrawalFees
