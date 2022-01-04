import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import Slider from 'react-slick'
import { useTranslation } from 'react-i18next'

import {
  Text,
  Box,
  Flex,
  ImgHomeTopFinix1x,
  ImgHomeTopFinix2x,
  ImgHomeTopFinix3x,
  ImageSet,
  IconButton,
  ArrowLeftGIcon,
  ArrowRightGIcon,
} from '@fingerlabs/definixswap-uikit-v2'
import NoticeItem from './NoticeItem'

export interface NoticeProps {
  id: number
  title: string
  content: string
  link?: string
  linkLabel?: string
}

const KO_NOTICE_LIST: NoticeProps[] = [
  {
    id: 0,
    title: 'Definix 클레이튼 체인 G2 Beta 런칭!',
    content: `Definix가 클레이튼 체인을 대상으로 G2 서비스를 런칭하였습니다.
    다양한 의견을 수렴하여 더욱 발전하는 디피닉스가 되도록 노력하겠습니다.`,
  },
  {
    id: 1,
    title: '여러분의 목소리를 들려주세요',
    content: `디피닉스는 홀더분들의 목소리에 항상 귀기울이고 있습니다.
    베타서비스에 불편한점, 개선점 있으시면 피드백 부탁드립니다.`,
    link: 'https://forms.gle/x9rfWuzD9Kpa8xa47',
    linkLabel: 'Beta 피드백',
  },
  {
    id: 2,
    title: 'G2 장기예치풀 오픈!',
    content: `G2 버전에서도 장기예치풀을 사용하실 수 있습니다.
    슈퍼스테이크도 열심히 작업 중입니다. 조금만 기다려 주세요!`,
  },
]
const EN_NOTICE_LIST: NoticeProps[] = [
  {
    id: 0,
    title: 'Definix on Klaytn Chain G2 beta launch!',
    content: `Definix Generation 2 service has been launched on Klaytn Chain.
    Long-term stake and Super stack are also in the works, so please wait a little bit!`,
  },
  {
    id: 1,
    title: 'Let your voice be heard',
    content: `Definix is always listening to the voices of holders.
    If there are any inconveniences or improvements to the beta service, please give us feedback.`,
    link: 'https://forms.gle/x9rfWuzD9Kpa8xa47',
    linkLabel: 'Feedback for Beta',
  },
  {
    id: 2,
    title: 'Long-term Stake on G2 is up!',
    content: `Long-term Stake is available on G2 now.
    Super Stake is in the works, so please wait for a while!`,
  },
]

const Wrap = styled(Flex)`
  ${({ theme }) => theme.mediaQueries.mobile} {
    width: 100%;
    flex-direction: column;
  }
`

const NoticeSlider = styled(Slider)`
  grid-column-start: 1;
  grid-column-end: 8;
  margin-top: 48px;

  .slick-dots {
    position: relative;
    justify-content: flex-start;
  }

  .slick-list,
  .slick-slide {
    min-height: 60px;
  }
  .slick-list {
    // margin-bottom: 20px;
  }

  .slick-dots li {
    width: 20px;
    height: 100%;
    padding: 0;
  }

  .slick-dots li.slick-active {
    width: 28px;
  }
  .slick-dots li button:before {
    width: 12px;
    height: 6px;
    border-radius: 3px;
    background: ${({ theme }) => theme.colors.pale};
  }
  .slick-dots li.slick-active button:before {
    width: 20px;
    background: ${({ theme }) => theme.colors.yellow};
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    margin-top: 0;
    .slick-list {
      margin-bottom: 0;
    }
    .slick-dots {
      height: 4px;
    }
    .slick-slider {
      margin-top: 20px;
    }
  }
`

const Notice = styled(Text)`
  white-space: pre-line;
  ${({ theme }) => theme.textStyle.R_20M}
  color: black;
  ${({ theme }) => theme.mediaQueries.mobile} {
    ${({ theme }) => theme.textStyle.R_14M}
  }
`

const OneNotice = styled(Notice)`
  margin-top: ${({ theme }) => theme.space.S_20}px;
  margin-bottom: ${({ theme }) => theme.space.S_20}px;
`

const NoticeBox = styled(Box)`
  width: 55%;
  ${({ theme }) => theme.mediaQueries.mobile} {
    width: 100%;
  }
`

const Character = styled(ImageSet)`
  display: flex;
  width: 434px;
  height: 200px;
  align-self: flex-end;

  > img {
    top: auto;
    bottom: 0 !important;
    height: auto;
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    margin-top: -20px;
    width: 260px;
    height: 120px;
  }
`

const WrapIndicator = styled(Flex)`
  margin-bottom: 40px;

  ${({ theme }) => theme.mediaQueries.mobile} {
    position: absolute;
    z-index: 1;
    right: 0;
    margin-top: -24px;
  }
`

const WrapPage = styled(Flex)`
  align-items: center;
  padding: 0 4px;
`


const SliderOptions = {
  arrows: false,
  autoplay: true,
  autoplaySpeed: 10000,
  speed: 500,
  dots: false,
  dotsClass: 'slick-dots slick-thumb',
}

const HomeNotice: React.FC = () => {
  const { i18n } = useTranslation()
  const [notices, setNotices] = useState(i18n.languages[0] === 'ko' ? KO_NOTICE_LIST : EN_NOTICE_LIST)
  const [slideIndex, setSlideIndex] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    setNotices(i18n.languages[0] === 'ko' ? KO_NOTICE_LIST : EN_NOTICE_LIST)
  }, [i18n.languages])

  return (
    <Wrap>
      <NoticeBox>
        {notices.length === 1 ? (
          <OneNotice>
            <NoticeItem {...notices[0]} />
          </OneNotice>
        ) : (
          <NoticeSlider ref={(slickSlider) => {
            sliderRef.current = slickSlider;
          }} {...SliderOptions} beforeChange={(oldInex, newIndex) => {
            setSlideIndex(newIndex);
          }}>
            {notices.map((notice) => (
              <NoticeItem key={notice.id} {...notice} />
            ))}
          </NoticeSlider>
        )}
        <WrapIndicator>
          <IconButton width="16px" onClick={() => {
            sliderRef.current.slickPrev();
          }}>
            <ArrowLeftGIcon />
          </IconButton>
          <WrapPage>
            <Text color="brown" textStyle="R_12M">{slideIndex + 1}</Text>
            <Text mx="4px" color="lightbrown" textStyle="R_12R">/</Text>
            <Text color="lightbrown" textStyle="R_12R">{notices.length}</Text>
          </WrapPage>
          <IconButton width="16px" onClick={() => {
            sliderRef.current.slickNext();
          }}>
            <ArrowRightGIcon />
          </IconButton>
        </WrapIndicator>
      </NoticeBox>
      <Character srcSet={[ImgHomeTopFinix1x, ImgHomeTopFinix2x, ImgHomeTopFinix3x]} alt="" width={434} height={200} />
    </Wrap>
  )
}

export default HomeNotice
