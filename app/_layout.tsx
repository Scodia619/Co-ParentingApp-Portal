import { MemberProvider, useMember } from '@/context/MemberContext'
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
    <MemberProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <AppLayout />
    </MemberProvider>
  )
}
