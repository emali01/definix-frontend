import React, { memo } from 'react'
import { Heading, Text } from 'uikit-dev'
import el09 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-09.png'

const BSC_1_2 = ({ title }) => {
  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          After create your password, you will get the secret backup phase ( Seed phase )
        </Text>

        <Text fontSize="16px" color="failure" bold>
          IMPORTANT !!
        </Text>
        <Text fontSize="14px" className="mb-4">
          Do not take photo , capture seed phase screen or save seed phase in any kind of digital format.
          <br />
          Write it on a paper and store in a secure location is recommended.
        </Text>
        <img src={el09} alt="" />
      </div>
    </>
  )
}

export default memo(BSC_1_2)
