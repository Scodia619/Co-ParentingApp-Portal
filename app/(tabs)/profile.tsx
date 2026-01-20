import React, { useRef, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useMember } from '../../context/MemberContext'

const CODE_LENGTH = 6

const Profile: React.FC = () => {
  const { member } = useMember()
  const [pairingInput, setPairingInput] = useState('')
  const hiddenInputRef = useRef<TextInput>(null)

  if (!member) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No member logged in.</Text>
      </View>
    )
  }

  const handlePair = () => {
    if (!pairingInput.trim()) return
    // TODO: call API to pair user
    console.log('Pairing with code:', pairingInput)
  }

  const handleChange = (text: string) => {
    // allow only letters/numbers, limit to CODE_LENGTH
    const filtered = text.replace(/[^a-zA-Z0-9]/g, '').slice(0, CODE_LENGTH)
    setPairingInput(filtered)
  }

  const renderBoxes = () => {
    const boxes = []
    for (let i = 0; i < CODE_LENGTH; i++) {
      boxes.push(
        <View key={i} style={styles.box}>
          <Text style={styles.boxText}>{pairingInput[i] || ''}</Text>
        </View>
      )
    }
    return boxes
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {member && (
        <View style={styles.profileInfo}>
          <Text style={styles.text}>Username: {member.username}</Text>
          <Text style={styles.text}>
            Joined: {new Date(member.createdAt).toLocaleDateString()}
          </Text>
          {member.pairingKey && (
            <View style={styles.pairingContainer}>
              <Text style={styles.pairingLabel}>Your Pairing Code:</Text>
              <Text style={styles.pairingCode}>{member.pairingKey}</Text>
            </View>
          )}
        </View>
      )}

      <View style={{ marginTop: 32 }}>
        <Text style={styles.sectionTitle}>Pair With a User</Text>

        <View
          style={styles.codeContainer}
          onTouchStart={() => hiddenInputRef.current?.focus()} // focus when tapped
        >
          {renderBoxes()}
        </View>

        <TextInput
          ref={hiddenInputRef}
          style={styles.hiddenInput}
          value={pairingInput}
          onChangeText={handleChange}
          keyboardType="default"
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={CODE_LENGTH}
        />

        <TouchableOpacity style={styles.pairButton} onPress={handlePair}>
          <Text style={styles.pairButtonText}>Pair</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#000' },
  title: { fontSize: 28, fontWeight: '600', marginBottom: 16, color: '#fff' },
  text: { fontSize: 16, marginBottom: 8, color: '#fff' },

  profileInfo: { marginBottom: 24 },

  pairingContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    alignItems: 'center',
  },
  pairingLabel: { color: '#aaa', fontSize: 14, marginBottom: 4 },
  pairingCode: { color: '#fff', fontSize: 20, fontWeight: '600' },

  sectionTitle: { color: '#fff', fontSize: 18, marginBottom: 12 },

  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  box: {
    width: 40,
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },

  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },

  pairButton: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  pairButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
})
