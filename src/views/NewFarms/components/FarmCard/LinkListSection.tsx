import React from 'react'
import styled from 'styled-components'
import { LinkExternal } from '@fingerlabs/definixswap-uikit-v2'

const LinkListSection: React.FC<{
  lpAddresses: { [key: number]: string }
}> = ({ lpAddresses }) => {
  const Link = styled(LinkExternal)`
    ${({ theme }) => theme.textStyle.R_14R};
    color: ${({ theme }) => theme.colors.mediumgrey};
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      ${({ theme }) => theme.textStyle.R_12R};
    }
    text-decoration: underline;
  `
  return (
    <>
      {!!Object.values(lpAddresses).length && (
        <Link href={`${process.env.REACT_APP_KLAYTN_URL}/account/${lpAddresses[process.env.REACT_APP_CHAIN_ID]}`}>
          KlaytnScope
        </Link>
      )}
    </>
  )
}

export default LinkListSection
