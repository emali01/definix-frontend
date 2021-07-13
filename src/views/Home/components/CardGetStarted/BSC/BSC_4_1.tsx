import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Heading, Text } from 'uikit-dev'
import img01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-38.png'
import img02 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-39.png'
import img03 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-40.png'

const BSC_4_1 = ({ title }) => {
  const { t } = useTranslation()

  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          {t('If you want to farm')}{' '}
          <Text fontSize="14px" color="primary" className="dis-in-block">
            FINIX-SIX
          </Text>
          {t('. What you need to do after token preparation is Liquidity pairing.')}
        </Text>

        <div className="flex justify-space-between mb-4">
          <img src={img01} alt="" className="col-6 flex-shrink" height="auto" />
          <Text fontSize="14px" className="col-6 pl-3">
            {t('To pair coins, you have to go to liquidity on menu bar.')}
          </Text>
        </div>

        <Text fontSize="14px" className="mb-1">
          {t('Select on “LIQUIDITY” tab.')}
        </Text>

        <img src={img02} alt="" className="mb-1" />
        <Text fontSize="14px" className="mb-4">
          {t('If you don’t have any LP right now, press on this button.')}
        </Text>

        <img src={img03} alt="" />
      </div>
    </>
  )
}

export default memo(BSC_4_1)
