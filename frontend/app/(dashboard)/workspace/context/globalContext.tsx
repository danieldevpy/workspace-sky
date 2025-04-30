// src/contexts/GlobalComponentsContext.tsx
'use client'

import { createContext, useContext, useState } from 'react'
import { AlertProps, Backdrop, CircularProgress } from '@mui/material'
import GlobalAlert from '../components/GlobalAlert'

interface GlobalComponentsContextType {
  showAlert: (props: AlertProps & { message: string }) => void
  showBackdrop: (show: boolean) => void
}

const GlobalComponentsContext = createContext<GlobalComponentsContextType | null>(null)

export function GlobalComponentsProvider({ children }: { children: React.ReactNode }) {
  const [backdropOpen, setBackdropOpen] = useState(false)
  const [alertProps, setAlertProps] = useState<AlertProps & { message: string } | null>(null)

  const showAlert = (props: AlertProps & { message: string }) => {
    setAlertProps(props)
  }

  const showBackdrop = (show: boolean) => {
    setBackdropOpen(show)
  }

  const handleCloseAlert = () => {
    setAlertProps(null)
  }

  return (
    <GlobalComponentsContext.Provider value={{ showAlert, showBackdrop }}>
      {children}
      
      {/* Backdrop Global */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 10 }}
        open={backdropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      
      {/* Alert Global */}
      {alertProps && (
        <GlobalAlert
          {...alertProps}
          open={Boolean(alertProps)}
          onClose={handleCloseAlert}
        />
      )}
    </GlobalComponentsContext.Provider>
  )
}

export function useGlobalComponents() {
  const context = useContext(GlobalComponentsContext)
  if (!context) {
    throw new Error('useGlobalComponents must be used within a GlobalComponentsProvider')
  }
  return context
}