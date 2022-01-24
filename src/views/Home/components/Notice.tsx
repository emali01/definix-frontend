import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import Slider from 'react-slick'
import { useTranslation } from 'react-i18next'
import EN_NOTICE from 'assets/notice/en.json'
import KO_NOTICE from 'assets/notice/ko.json'

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

function convertNotice(list) {
  const length = +list['length/0']
  const arr = Object.entries(list)
  return arr.slice(1).reduce((acc, [key, val]) => {
    const [noticeKey, noticeIndex] = key.split('/')
    if (!acc[length - +noticeIndex]) {
      acc[length - +noticeIndex] = {}
    }
    if (val !== '') {
      acc[length - +noticeIndex][noticeKey] = val
    }
    return acc
  }, [])
}

const EN_NOTICE_LIST = convertNotice(EN_NOTICE)
const KO_NOTICE_LIST = convertNotice(KO_NOTICE)

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
    z-index: 2;
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
    right: 20px;
    margin-top: -24px;

    > button {
      display: none;
    }
  }
`

const WrapPage = styled(Flex)`
  align-items: center;
  padding: 0 4px;
`

const StyledArrowLeftGIcon = styled(ArrowLeftGIcon)`
  fill: ${({ theme }) => theme.colors.pale};
`

const StyledArrowRightGIcon = styled(ArrowRightGIcon)`
  fill: ${({ theme }) => theme.colors.pale};
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
  const [slideIndex, setSlideIndex] = useState(0)
  const sliderRef = useRef(null)

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
          <NoticeSlider
            ref={(slickSlider) => {
              sliderRef.current = slickSlider
            }}
            {...SliderOptions}
            beforeChange={(oldInex, newIndex) => {
              setSlideIndex(newIndex)
            }}
          >
            {notices.map((notice, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <NoticeItem key={index} {...notice} />
            ))}
          </NoticeSlider>
        )}
        <WrapIndicator>
          <IconButton
            width="16px"
            onClick={() => {
              sliderRef.current.slickPrev()
            }}
          >
            <StyledArrowLeftGIcon />
          </IconButton>
          <WrapPage>
            <Text color="brown" textStyle="R_12M">
              {slideIndex + 1}
            </Text>
            <Text mx="4px" color="lightbrown" textStyle="R_12R">
              /
            </Text>
            <Text color="lightbrown" textStyle="R_12R">
              {notices.length}
            </Text>
          </WrapPage>
          <IconButton
            width="16px"
            onClick={() => {
              sliderRef.current.slickNext()
            }}
          >
            <StyledArrowRightGIcon />
          </IconButton>
        </WrapIndicator>
      </NoticeBox>
      <Character srcSet={[ImgHomeTopFinix1x, ImgHomeTopFinix2x, ImgHomeTopFinix3x]} alt="" width={434} height={200} />
    </Wrap>
  )
}

export default HomeNotice
