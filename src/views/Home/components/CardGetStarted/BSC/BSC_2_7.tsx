import React, { memo } from 'react'
import { Heading, Text } from 'uikit-dev'

const BSC_2_7 = ({ title }) => {
  return (
    <>
      <Heading className="mb-4" color="primary">
        {title}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          Now you have all required tokens. Let’s advance to the next step.
        </Text>
      </div>
    </>
  )
}

export default memo(BSC_2_7)
