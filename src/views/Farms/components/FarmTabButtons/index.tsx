import React from 'react'
import styled from 'styled-components'
import { Button, Heading } from 'uikit-dev'

const StyledButton = styled(Button)`
  border-radius: ${({ theme }) => theme.radii.default};
  min-width: 120px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.16);

  &:not(.active) {
    background: #f7f7f7;
    border-color: transparent;
    color: initial;
    font-weight: normal;

    &:hover {
      font-weight: 600;
    }
  }
`

const FarmTabButtons = ({ stackedOnly, setStackedOnly, activeFarmsCount }) => {
  // const { url, isExact } = useRouteMatch()
  // const TranslateString = useI18n()

  return (
    <Wrapper className="mb-6">
      <Heading as="h2" fontSize="20px !important" textAlign="center">
        All active farms
        <span className="ml-2" style={{ fontSize: '16px' }}>
          ({activeFarmsCount})
        </span>
      </Heading>
      <div className="flex">
        <StyledButton
          size="sm"
          onClick={() => {
            setStackedOnly(false)
          }}
          variant="secondary"
          className={`mr-2 ${!stackedOnly ? 'active' : ''}`}
        >
          All
        </StyledButton>
        <StyledButton
          size="sm"
          onClick={() => {
            setStackedOnly(true)
          }}
          variant="secondary"
          className={stackedOnly ? 'active' : ''}
        >
          Staked
        </StyledButton>
      </div>
    </Wrapper>
  )
}

export default FarmTabButtons

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`
