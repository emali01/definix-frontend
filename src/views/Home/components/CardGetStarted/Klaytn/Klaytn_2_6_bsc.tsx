/* eslint-disable camelcase */
import React, { memo } from 'react'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-58.png'
import img02 from 'uikit-dev/images/for-ui-v2/tutorial-elements/Klaytn/Definix-Tutorial-Elements-59.png'

const Klaytn_2_6 = ({ title }) => {
  return (
    <>
      <Heading className="mb-6" color="primary">
        {`${title} (SIX)`}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          In Kaikas wallet, you have to add SIX token into your wallet to view your coin.
        </Text>

        <Text fontSize="14px" className="mb-4">
          Press Token List
        </Text>

        <img src={img01} alt="" className="mb-4" />

        <Text fontSize="14px" className="mb-4">
          and then press Add Token.
        </Text>

        <Text fontSize="14px" className="mb-4">
          You will see SIX token, Press select and press Next.
        </Text>

        <img src={img02} alt="" className="mb-4" />

        <Text fontSize="14px">
          After finish the process, please wait 10-20 minutes. You will recieve SIX in your metamask wallet
          automatically.
        </Text>
      </div>
    </>
  )
}

export default memo(Klaytn_2_6)
