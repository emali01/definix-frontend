import React, { createContext } from 'react'

interface ModalsContext {
  onPresent: (node: React.ReactNode, key?: string) => void
  onDismiss: () => void
}

const PoolContext = createContext<ModalsContext>({
  onPresent: () => null,
  onDismiss: () => null,
})

export default PoolContext
