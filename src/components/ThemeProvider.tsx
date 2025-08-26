'use client'

import { useEffect, useState } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { createAppTheme } from '@/theme/theme'
import { ThemeContextProvider, useTheme } from '@/contexts/ThemeContext'

interface ThemeProviderProps {
  children: React.ReactNode
}

function MuiThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const { mode } = useTheme()
  const theme = createAppTheme(mode)
  
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <ThemeContextProvider>
      <MuiThemeProviderWrapper>
        {children}
      </MuiThemeProviderWrapper>
    </ThemeContextProvider>
  )
}