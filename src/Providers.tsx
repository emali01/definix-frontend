import { createTheme, ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import { HelmetProvider } from 'react-helmet-async'
import { BlockContextProvider } from 'contexts/BlockContext'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { ThemeContextProvider } from 'contexts/ThemeContext'

import injected, { UseWalletProvider, KlipModalContext, KlipModalProvider } from '@sixnetwork/klaytn-use-wallet'
import React, { useCallback, useEffect, useMemo } from 'react'
import { Provider } from 'react-redux'
import store from 'state'
import { ModalProvider as OldModalProvider } from 'uikit-dev'
import { ModalProvider } from '@fingerlabs/definixswap-uikit-v2'

import { createCaverJsReactRoot, CaverJsReactProvider } from '@sixnetwork/caverjs-react-core'
import { NetworkContextName } from './config/constants'
import getLibrary from './utils/getLibrary'

const Web3ProviderNetwork = createCaverJsReactRoot(NetworkContextName)

const Providers: React.FC = ({ children }) => {
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: '#1587C9',
          },

          secondary: {
            main: '#0973B9',
          },
        },
      }),
    [],
  )
  const klipContext = React.useContext(KlipModalContext())

  const onPresent = useCallback(() => {
    klipContext?.setShowModal(true)
  }, [klipContext])
  const onHiddenModal = useCallback(() => {
    klipContext?.setShowModal(false)
  }, [klipContext])

  useEffect(() => {
    window.onclick = (event) => {
      if (event.target === document.getElementById('customKlipModal')) {
        onHiddenModal()
      }
    }
  }, [onHiddenModal])

  return (
    <Provider store={store}>
      <CaverJsReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <UseWalletProvider
            chainId={parseInt(process.env.REACT_APP_CHAIN_ID)}
            connectors={{
              klip: { showModal: onPresent, closeModal: onHiddenModal },
              injected,
            }}
          >
            <HelmetProvider>
              <ThemeContextProvider>
                <KlipModalProvider>
                  <BlockContextProvider>
                    <RefreshContextProvider>
                      <ModalProvider>
                        <OldModalProvider>
                          <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
                        </OldModalProvider>
                      </ModalProvider>
                    </RefreshContextProvider>
                  </BlockContextProvider>
                </KlipModalProvider>
              </ThemeContextProvider>
            </HelmetProvider>
          </UseWalletProvider>
        </Web3ProviderNetwork>
      </CaverJsReactProvider>
    </Provider>
  )
}

export default Providers
