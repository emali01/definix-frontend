import React from 'react'
import { get } from 'lodash'
import { CopyToClipboard, Flex, Helper, Text, useMatchBreakpoints, VDivider } from 'definixswap-uikit'

import { useTranslation } from 'react-i18next'
import EllipsisText from 'components/EllipsisText'
import { Rebalance } from '../../../state/types'

import { Table, TD, TH, TR } from './Table'

interface FactRowType {
  name: string
  value: string
  copy?: boolean
  helper?: string
  bold?: boolean
  prefix?: string | number
  ellipsis?: boolean
}

const FactRow: React.FC<FactRowType> = ({ name, helper, value, prefix, bold, ellipsis, copy }) => {
  const { isMaxXl } = useMatchBreakpoints()

  return (
    <TR>
      <TH style={{ wordBreak: 'break-word', minWidth: '110px' }} sm={isMaxXl}>
        <Flex alignItems="center">
          <Text textStyle="R_12M" color="mediumgrey">
            {name}
          </Text>
          {helper && <Helper text={helper} className="mx-2" position="top" />}
        </Flex>
      </TH>
      <TD sm={isMaxXl}>
        <Flex alignItems="center" textStyle={bold ? 'R_14B' : 'R_14R'} flexWrap="wrap" mb="-6px">
          {prefix && (
            <Flex alignItems="center" mb="6px">
              {prefix}
              <VDivider mx={isMaxXl ? 'S_16' : 'S_24'} my="3px" />
            </Flex>
          )}
          <Flex alignItems="center" mb="6px">
            {ellipsis && isMaxXl ? <EllipsisText start={6} end={5} text={value} /> : value}
            {copy && <CopyToClipboard toCopy={value} />}
          </Flex>
        </Flex>
      </TD>
    </TR>
  )
}

interface KeyFactsType {
  rebalance: Rebalance | any
}

const KeyFacts: React.FC<KeyFactsType> = ({ rebalance }) => {
  const { t } = useTranslation()
  return (
    <>
      <Text textStyle="R_16M" color="deepgrey" className="mb-s20">
        {t('Key Facts')}
      </Text>
      <Text textStyle="R_14R" color="mediumgrey">
        {rebalance.description}
      </Text>
      <Table className="mt-s20">
        <FactRow name={t('Name')} value={rebalance.factsheet.name} bold />
        <FactRow name={t('Inception Date')} value={rebalance.factsheet.inceptionDate} />
        <FactRow name={t('Manager')} value={rebalance.factsheet.manager} copy ellipsis />
        <FactRow name={t('Vault')} value={rebalance.factsheet.vault} copy ellipsis />
        <FactRow
          name={t('Management Fee')}
          helper={t('Fee collected for vault management.')}
          prefix={get(rebalance, 'fee.management', 0.2)}
          value={rebalance.factsheet.management}
          ellipsis
          copy
        />
        <FactRow
          name={t('Finix Buyback Fee')}
          helper={t('Fee collected for buyback and burn of FINIX as deflationary purpose.')}
          prefix={get(rebalance, 'fee.buyback', 1.5)}
          value={rebalance.factsheet.finixBuyBackFee}
          ellipsis
          copy
        />
        <FactRow
          name={t('Ecosystem Fee')}
          prefix={get(rebalance, 'fee.bounty', 0.3)}
          helper={t('Reservation fee for further development of the ecosystem.')}
          value={rebalance.factsheet.bountyFee}
          ellipsis
          copy
        />
      </Table>
    </>
  )
}

export default KeyFacts