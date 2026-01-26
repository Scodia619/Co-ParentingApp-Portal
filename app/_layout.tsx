import { MemberProvider, useMember } from '@/context/MemberContext'
import { UnreadProvider } from '@/context/UnreadContext'
import { Redirect, Stack } from 'expo-router'
import React from 'react'

function AppLayout() {
  const { member } = useMember()

  if (!member) {
    return <Redirect href="/login" />
  }
  return <Redirect href="/messages" />
}

export default function RootLayout() {
  return (
    <UnreadProvider>
      <MemberProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <AppLayout />
      </MemberProvider>
    </UnreadProvider>
    
  )
}
