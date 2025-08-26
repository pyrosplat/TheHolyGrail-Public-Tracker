'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { PaletteMode } from '@mui/material'

interface ThemeContextType {
  mode: PaletteMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeContextProviderProps {
  children: ReactNode
}

export function ThemeContextProvider({ children }: ThemeContextProviderProps) {
  const [mode, setMode] = useState<PaletteMode>('dark')
  const [mounted, setMounted] = useState(false)

  // Handle hydration
  useEffect(() => {
    setMounted(true)
    const savedMode = localStorage.getItem('themeMode') as PaletteMode
    if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
      setMode(savedMode)
    } else {
      // Default to dark mode if no saved preference
      setMode('dark')
    }
  }, [])

  // Save theme to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('themeMode', mode)
    }
  }, [mode, mounted])

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeContextProvider')
  }
  return context
}