import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import { Flex, Text, ImgTokenFinixIcon, AnountButton, AlertIcon } from 'definixswap-uikit-v2'
import BalanceText from 'components/BalanceText'
import styled from 'styled-components'

interface BalanceProps {
  hasAccount: boolean
  minimum: number
  inputBalance: string
  setInputBalance: React.Dispatch<React.SetStateAction<string>>
  error: string
  setError: React.Dispatch<React.SetStateAction<string>>
  balancefinix: number
}

const FlexBalance = styled(Flex)`
  padding: 24px 0;
  width: 100%;
  justify-content: space-between;
`

const StyledInput = styled.input`
  ${({ theme }) => theme.textStyle.R_28M};
  color: ${({ theme }) => theme.colors.black};
  width: 95%;
  height: 40px;
  padding: 0;
  outline: none;
  border: none;
  caret-color: ${({ theme }) => theme.colors.red};

  &::placeholder {
    color: ${({ theme }) => theme.colors.mediumgrey};
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

const StyledAnountButton = styled(AnountButton)<{ selected: boolean }>`
  margin-right: 6px;
  color: ${({ theme, selected }) => (selected ? theme.colors.white : theme.colors.deepgrey)};
  background-color: ${({ theme, selected }) => (selected ? theme.colors.orange : 'transparent')};
  border-color: ${({ theme, selected }) => (selected ? theme.colors.orange : theme.colors.lightgrey)};

  &:last-child {
    margin-right: 0;
  }
`

const StyledText = styled(Text)`
  margin-top: 5px;
`

const BalanceFinix: React.FC<BalanceProps> = ({
  hasAccount,
  minimum,
  inputBalance,
  setInputBalance,
  error,
  setError,
  balancefinix,
}) => {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<string>('')

  const onChangeBalance = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget

    if (value.length > 79) return
    setInputBalance(value.replace(/[^0-9]/g, ''))

    if (selected) setSelected('')
  }

  const onClickRate = (value: string) => {
    if (!hasAccount) return

    if (value === '25%') setInputBalance((balancefinix * 0.25).toFixed(2))
    else if (value === '50%') setInputBalance((balancefinix * 0.5).toFixed(2))
    else if (value === 'MAX') setInputBalance(String(balancefinix))

    setSelected(value)
  }

  useEffect(() => {
    if (!inputBalance) {
      setError('noInput')
    } else if (new BigNumber(Number(`0.${inputBalance.split('.')[1] || 0}`)).decimalPlaces() > 18) {
      setError('Less than a certain amount')
    } else if (balancefinix < Number(inputBalance)) {
      setError('Insufficient balance')
    } else if (Number(inputBalance) < minimum) {
      setError('The amount of FINIX')
    } else setError('')
  }, [minimum, balancefinix, inputBalance, setError])

  useEffect(() => {
    if (!hasAccount) {
      setInputBalance('')
      setSelected('')
    }
  }, [hasAccount, setInputBalance, setSelected])

  return (
    <>
      <FlexBalance>
        <Flex width="100%" flexDirection="column">
          <Flex mb="S_4">
            <Text mr="S_4" textStyle="R_14R" color="deepgrey">
              {t('Balance')}
            </Text>
            <BalanceText
              textStyle="R_14B"
              color="deepgrey"
              value={hasAccount ? Math.floor(balancefinix * 1000000) / 1000000 : 0}
            />
          </Flex>
          <StyledInput
            type="text"
            inputMode="decimal"
            value={inputBalance}
            onChange={onChangeBalance}
            placeholder="0"
            readOnly={!hasAccount}
          />
          <Flex mt="S_8" mb="S_12">
            {['25%', '50%', 'MAX'].map((value) => {
              return (
                <StyledAnountButton key={value} selected={selected === value} onClick={() => onClickRate(value)}>
                  {value}
                </StyledAnountButton>
              )
            })}
          </Flex>
          {error !== 'noInput' && !!error && (
            <Flex alignItems="flex-start">
              <Flex mt="S_2">
                <AlertIcon viewBox="0 0 16 16" width="16px" height="16px" />
              </Flex>
              <Text ml="S_4" textStyle="R_14R" color="red">
                {t(error)}
              </Text>
            </Flex>
          )}
        </Flex>
        <Flex mt="S_16" flexDirection="column" alignItems="center">
          <ImgTokenFinixIcon viewBox="0 0 48 48" width="40px" height="40px" />
          <StyledText textStyle="R_14B" color="black">
            {t('FINIX')}
          </StyledText>
        </Flex>
      </FlexBalance>
    </>
  )
}

export default BalanceFinix