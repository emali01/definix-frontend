import React from 'react'
import styled from 'styled-components'
import { Text } from '../../components/Text'
import Flex from '../../components/Box/Flex'
import { Button, IconButton } from '../../components/Button'
import Heading from '../../components/Heading/Heading'
import { ArrowBackIcon, CloseIcon } from '../../components/Svg'
// import colorStroke from '../../images/Color-stroke.png'
// import colorStroke from '../../../../i'
import { InjectedProps } from './types'

interface Props extends InjectedProps {
  title: any
  hideCloseButton?: boolean
  onBack?: () => void
  bodyPadding?: string
  isRainbow?: boolean
  classHeader?: string
  maxWidth?: string
  maxHeight?: string
  className?: string
}

const StyledModal = styled.div<{ isRainbow: boolean }>`
  background: ${({ theme }) => theme.modal.background};
  box-shadow: 0px 20px 36px -8px rgba(14, 14, 44, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.05);
  border-radius: ${({ theme }) => theme.radii.default};
  width: 480px;
  z-index: ${({ theme }) => theme.zIndices.modal};
  overflow-y: auto;
  ${({ theme }) => theme.mediaQueries.xs} {
    min-width: calc(100% - 24px);
    max-width: calc(100% - 24px);
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 360px;
  }
  position: relative;

  .color-stroke {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);
    height: 4px;
    width: 100%;
  }
`

const ModalHeader = styled.div<{ className?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 10px 10px 64px;
`

const ModalTitle = styled(Flex)`
  align-items: center;
  flex: 1;
`

const ModalResponses: React.FC<Props> = ({
  title,
  onDismiss,
  onBack,
  children,
  hideCloseButton = false,
  bodyPadding = '0px 20px 20px',
  isRainbow = true,
  classHeader = '',
  maxWidth = '',
  maxHeight = '',
  className = '',
}) => (
  <StyledModal isRainbow={isRainbow} style={{ maxWidth, maxHeight }} className={className}>
    <ModalHeader className={classHeader}>
      <ModalTitle>
        {onBack && (
          <Button variant="text" onClick={onBack} ml="-12px" padding="0 12px" startIcon={<ArrowBackIcon />}>
            <Text fontSize="14px" color="textSubtle">
              Back
            </Text>
          </Button>
        )}
        <Heading>{title}</Heading>
      </ModalTitle>

      {!hideCloseButton && (
        <IconButton variant="text" onClick={onDismiss} aria-label="Close the dialog">
          <CloseIcon color="primary" />
        </IconButton>
      )}
    </ModalHeader>

    <Flex flexDirection="column" p={bodyPadding}>
      {children}
    </Flex>
  </StyledModal>
)

export default ModalResponses