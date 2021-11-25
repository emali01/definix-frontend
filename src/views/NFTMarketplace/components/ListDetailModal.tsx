import React, { useState } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { Button, Text, Heading, Image, useMatchBreakpoints, Flex } from 'uikit-dev'
import useModal from 'uikit-dev/widgets/Modal/useModal'
import ModalNFT from 'uikit-dev/widgets/Modal/Modal'
import tAra from 'uikit-dev/images/for-ui-v2/nft/T-ARA.png'
import copyWhite from 'uikit-dev/images/for-ui-v2/nft/copy-white.png'
import copyBlack from 'uikit-dev/images/for-ui-v2/nft/copy-black.png'
import ListFillModal from './ListFillModal'
import ModalComplete from './ModalComplete'

interface Props {
  onDismiss?: () => void
  isMarketplace?: boolean
}

const ImgWrap = styled(Flex)`
  width: 340px;
  height: 330px;
  flex-shrink: 0;
`

const LayoutImg = styled.div`
  text-align: -webkit-center;
`

const ListDetailModal: React.FC<Props> = ({ onDismiss = () => null, isMarketplace }) => {
  const [hideCloseButton, setHideCloseButton] = useState(true)
  const [onPresentConnectModal] = useModal(<ListFillModal />)
  const [handleBuy] = useModal(<ModalComplete />)
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { isDark } = useTheme()

  return (
    <ModalNFT
      isRainbow={false}
      title=""
      onDismiss={onDismiss}
      hideCloseButton={hideCloseButton}
      classHeader="bd-b-n pa-0"
      bodyPadding="42px"
    >
      <div className={isMobile ? 'w-100' : 'w-100 flex'}>
        <LayoutImg>
          <ImgWrap>
            <video autoPlay muted loop playsInline>
              <source
                src="https://dryotus.definix.com/ipfs/QmdnHBXwbe1tpa8fpKKk1RnAFiU93JpuM7CwmGkUga3kuC/Legendary_T-ARA.mp4"
                type="video/mp4"
              />
            </video>
          </ImgWrap>
        </LayoutImg>

        <div className={isMobile ? 'mt-4' : 'ml-6'}>
          <Text bold fontSize="32px !important" lineHeight="1">
            #02
          </Text>
          <Text bold fontSize="20px !important" lineHeight="1.3">
            T-ARA LEGENDARY Grade Limited
          </Text>
          <Text fontSize="16px !important" color="textSubtle" lineHeight="1.5">
            Dingo x SIX Network NFT Project No.1
          </Text>
          <div className="mt-4">
            <Text fontSize="14px !important" color="textSubtle">
              Metadata
            </Text>
            <div className="flex align-center">
              <Text bold fontSize="14px" color="text" paddingRight="6px">
                {`${'https://dryotus.definix.com/'.substring(0, 30)}`}...
              </Text>
              <Image src={isDark ? copyWhite : copyBlack} width={20} height={18} />
            </div>
          </div>
          <div className="mt-3">
            <Text fontSize="14px !important" color="textSubtle">
              NFT token standard
            </Text>
            <Text bold fontSize="16px !important" color="text">
              BEP-1155
            </Text>
          </div>
          <div className="mt-3">
            <Text fontSize="14px !important" color="textSubtle">
              Smart Contract address
            </Text>
            <div className="flex align-center">
              <Text bold fontSize="14px" color="text" paddingRight="6px">
                {`${'0x55030000000065311'.substring(0, 6)}...${'0x55030000000065311'.substring(
                  '0x55030000000065311'.length - 4,
                )}`}
              </Text>
              <Image src={isDark ? copyWhite : copyBlack} width={20} height={18} />
            </div>
          </div>
          {isMarketplace ? (
            <>
              <div className="mt-3">
                <Text fontSize="14px !important" color="textSubtle">
                  Price
                </Text>
                <div className="flex align-center">
                  <Image src="/images/coins/FINIX.png" width={16} height={16} />
                  <Text bold fontSize="22px" color="text" paddingLeft="6px">
                    2,837.2938 FINIX
                  </Text>
                </div>
              </div>
              <div className="mt-3">
                <Text fontSize="14px !important" color="textSubtle">
                  Until
                </Text>
                <Text bold fontSize="16px !important" color="text">
                  28/12/21 00:00:00 GMT+7
                </Text>
              </div>
              <Button fullWidth radii="small" className="mt-3" onClick={() => handleBuy()}>
                Buy
              </Button>
            </>
          ) : (
            <Button fullWidth radii="small" className="mt-3" onClick={() => onPresentConnectModal()}>
              List
            </Button>
          )}
        </div>
      </div>
    </ModalNFT>
  )
}

export default ListDetailModal
