import React, { useState } from 'react'
import Lottie from 'react-lottie'
import styled from 'styled-components'
import moon from '../../animation/moon.json'
import sun from '../../animation/sun.json'
import Button from '../../components/Button/Button'
import { ChevronDownIcon } from '../../components/Svg'
import Text from '../../components/Text/Text'
import { MENU_ENTRY_HEIGHT } from './config'
import { PanelProps, PushedProps } from './types'

const sunOptions = {
  loop: false,
  autoplay: false,
  animationData: sun,
}

const moonOptions = {
  loop: false,
  autoplay: false,
  animationData: moon,
}

interface Props extends PanelProps, PushedProps {}

// const PriceLink = styled.a`
//   display: flex;
//   align-items: center;
//   svg {
//     transition: transform 0.3s;
//   }
//   :hover {
//     svg {
//       transform: scale(1.2);
//     }
//   }
// `

// const SocialEntry = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   height: ${MENU_ENTRY_HEIGHT}px;
//   padding: 0 16px;
// `

const Container = styled.div`
  flex: none;
  padding: 24px;
`

const SettingsEntry = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${MENU_ENTRY_HEIGHT}px;
`

const ChangeLanguage = styled(Button)`
  height: 48px;
  border: 2px solid ${({ theme }) => theme.colors.backgroundBox} !important;
  padding: 0 16px;
  background: transparent !important;
`

const ChangeTheme = styled.div<{ isDark: boolean }>`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.backgroundBox};
  border-radius: ${({ theme }) => theme.radii.small};
  padding: 6px;
  position: relative;

  &:before {
    content: '';
    width: 40px;
    height: 36px;
    position: absolute;
    top: 6px;
    left: 6px;
    transition: 0.2s;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.radii.small};
    transform: translateX(${({ isDark }) => (isDark ? '100%' : '0')});
  }

  button {
    padding: 0;
    width: 40px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    z-index: 1;
    background: transparent !important;

    > div {
      position: absolute;
    }
  }
`

const PanelFooter: React.FC<Props> = ({
  setIsDark,
  isDark,
  currentLang,
  // isPushed,
  // pushNav,
  // finixPriceUsd,
  // langs,
  // setLang,
}) => {
  const [isStopped, setIsStop] = useState(false)
  const [direction, setDirection] = useState(1)

  const clickChangeTheme = (isDarkMode) => {
    setIsDark(isDarkMode)
    if (!isStopped) {
      setDirection(direction * -1)
    }
    setIsStop(false)
  }

  // if (!isPushed) {
  //   return (
  //     <Container>
  //       <IconButton variant="text" onClick={() => pushNav(true)}>
  //         <CogIcon />
  //       </IconButton>
  //     </Container>
  //   )
  // }

  return (
    <Container>
      {/* <SocialEntry>
        {finixPriceUsd ? (
          <PriceLink href="https://definixswap.info/token/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82" target="_blank">
            <DefinixRoundIcon width="24px" mr="8px" />
            <Text color="textSubtle" bold>{`$${finixPriceUsd.toFixed(3)}`}</Text>
          </PriceLink>
        ) : (
          <Skeleton width={80} height={24} />
        )}
        <Flex>
          {socials.map((social, index) => {
            const Icon = Icons[social.icon]
            const iconProps = { width: '24px', color: 'textSubtle', style: { cursor: 'pointer' } }
            const mr = index < socials.length - 1 ? '24px' : 0
            if (social.items) {
              return (
                <Dropdown key={social.label} position="top" target={<Icon {...iconProps} mr={mr} />}>
                  {social.items.map((item) => (
                    <Link external key={item.label} href={item.href} aria-label={item.label} color="textSubtle">
                      {item.label}
                    </Link>
                  ))}
                </Dropdown>
              )
            }
            return (
              <Link external key={social.label} href={social.href} aria-label={social.label} mr={mr}>
                <Icon {...iconProps} />
              </Link>
            )
          })}
        </Flex>
      </SocialEntry> */}
      <SettingsEntry>
        {/* <Dropdown
          position="top-right"
          target={
            <ChangeLanguage
              variant="text"
              radii="card"
              endIcon={<ChevronDownIcon color="textDisabled" width="24px" />}
              disabled
            >
              <Text color="textSubtle" bold>
                {currentLang?.toUpperCase()}
              </Text>
            </ChangeLanguage>
          }
        >
          {langs.map((lang) => (
            <MenuButton
              key={lang.code}
              fullWidth
              onClick={() => setLang(lang)}
              // Safari fix
              style={{ minHeight: '32px', height: 'auto' }}
            >
              {lang.language}
            </MenuButton>
          ))}
        </Dropdown> */}
        <ChangeLanguage
          variant="text"
          radii="card"
          endIcon={<ChevronDownIcon color="textDisabled" width="24px" />}
          disabled
        >
          <Text color="textSubtle" bold>
            {currentLang?.toUpperCase()}
          </Text>
        </ChangeLanguage>
        <ChangeTheme isDark={isDark}>
          <Button variant="text" size="sm" radii="card" onClick={() => clickChangeTheme(false)}>
            <Lottie options={sunOptions} height={56} width={56} isStopped={isStopped} direction={direction} speed={3} />
          </Button>
          <Button variant="text" size="sm" radii="card" onClick={() => clickChangeTheme(true)}>
            <Lottie
              options={moonOptions}
              height={56}
              width={56}
              isStopped={isStopped}
              direction={direction}
              delay={0}
              speed={3}
            />
          </Button>
        </ChangeTheme>
      </SettingsEntry>
    </Container>
  )
}

export default PanelFooter
