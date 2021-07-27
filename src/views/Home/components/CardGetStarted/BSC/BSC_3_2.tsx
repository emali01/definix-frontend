import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-34.png'
import img02 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-35.png'
import img03 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-36.png'

const BSC_3_2 = ({ title }) => {
  const { t } = useTranslation()
  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <div className="flex justify-space-between mb-4">
          <img src={img01} alt="" className="col-6 flex-shrink" height="auto" />
          <Text fontSize="14px" className="col-6 pl-3">
            {t('To swap coins, you have to go to exchange on menu bar.')}
          </Text>
        </div>

        <Text fontSize="14px" className="mb-1">
          {t('Select on “SWAP TOKEN” tab.')}
        </Text>

        <img src={img02} alt="" className="mb-1" />
        <Text fontSize="14px" className="mb-4">
          {t(
            'Now you can select the token you want to swap from “Select Token” dropdown menu The system will auto-calculate the amount of token you will get automatically.',
          )}
        </Text>
        <img src={img03} alt="" />
      </div>
    </>
  )
}

export default memo(BSC_3_2)
