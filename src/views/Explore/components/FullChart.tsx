import Checkbox from '@material-ui/core/Checkbox'
import _ from 'lodash'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import React, { useState } from 'react'
import { Line } from 'react-chartjs-2'
import styled from 'styled-components'
import { Text, useMatchBreakpoints } from 'uikit-dev'
import CircularProgress from '@material-ui/core/CircularProgress'

const rebalanceColor = '#30ADFF'

const Box = styled.div`
  canvas {
    width: 100% !important;
  }
`

const FormControlLabelCustom = styled(FormControlLabel)`
  .MuiCheckbox-root {
    padding: 6px;
  }
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;

  .rebalancing {
    width: 24px;
    height: 6px;
    border-radius: ${({ theme }) => theme.radii.small};
    background: ${rebalanceColor};
    margin-right: 8px;
  }

  img {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: ${({ theme }) => theme.radii.circle};
    margin-right: 6px;
  }
`

const FullDiv = styled.div`
  background: rgba(255, 255, 255, 0.8);
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
`

const RelativeDiv = styled.div`
  position: relative;
`

const LoadingData = () => (
  <div className="flex align-center justify-center" style={{ height: '100%' }}>
    <CircularProgress size={16} color="inherit" className="mr-2" />
    <Text>Loading...</Text>
  </div>
)

const Legend = ({ selectedTokens, setSelectedTokens, tokens }) => {
  const { isXl, isMd, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isMd && !isLg

  const onCheck = (token) => (event) => {
    setSelectedTokens({ ...selectedTokens, [token.symbol]: !event.target.checked })
  }

  return (
    <FormGroup row className="flex flex-wrap mb-5">
      <LegendItem className={isMobile ? 'col-6' : 'mr-6'}>
        <div className="rebalancing" />
        <Text fontSize="12px" bold>
          Rebalancing
        </Text>
      </LegendItem>

      {tokens.map((c) => (
        <FormControlLabelCustom
          className={isMobile ? 'col-6 ma-0' : ' mr-6'}
          control={
            <Checkbox
              size="small"
              color="primary"
              checked={!!selectedTokens[c.symbol] === false}
              onChange={onCheck(c)}
            />
          }
          label={
            <LegendItem>
              <img src={`/images/coins/${c.symbol || ''}.png`} alt="" />
              <Text fontSize="12px" bold>
                {c.symbol}
              </Text>
            </LegendItem>
          }
        />
      ))}
    </FormGroup>
  )
}

const FullChart = ({ tokens, isLoading, graphData = {}, className = '', height = 320 }) => {
  const [selectedTokens, setSelectedTokens] = useState({})
  const data = (canvas) => {
    const ctx = canvas.getContext('2d')

    const gradient = ctx.createLinearGradient(0, 0, 0, 320)
    gradient.addColorStop(0, rebalanceColor)
    gradient.addColorStop(0.7, 'transparent')

    return {
      labels: _.get(graphData, 'labels', []),
      datasets: Object.keys(_.get(graphData, 'graph', {}))
        .filter((key) => !selectedTokens[key])
        .map((key) => {
          const thisData = _.get(graphData, `graph.${key}`, {})
          const thisName = thisData.name || ''
          return {
            label: thisName,
            data: thisData.values || [],
            fill: true,
            borderColor: thisData.color,
            tension: 0,
            ...(thisName === 'rebalance'
              ? {
                  borderColor: rebalanceColor,
                  backgroundColor: gradient,
                  pointBackgroundColor: 'transparent',
                  pointBorderColor: 'transparent',
                }
              : {}),
          }
        }),
    }
  }

  const options = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            autoSkip: true,
            maxRotation: 0,
            autoSkipPadding: 23,
          },
          gridLines: {
            display: false,
          },
        },
      ],
    },
  }

  return (
    <div className={className}>
      <Legend tokens={tokens} selectedTokens={selectedTokens} setSelectedTokens={setSelectedTokens} />
      <RelativeDiv>
        <Box>
          <Line data={data} options={options} height={height} legend={{ display: false }} />
        </Box>
        {isLoading && (
          <FullDiv>
            <LoadingData />
          </FullDiv>
        )}
      </RelativeDiv>
    </div>
  )
}

export default FullChart
