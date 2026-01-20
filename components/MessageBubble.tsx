import { Message } from '@/types/message'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = {
  message: Message
  isOwnMessage: boolean
  showDate?: boolean // whether to show the date above the bubble
}

const MessageBubble: React.FC<Props> = ({ message, isOwnMessage, showDate }) => {
  const messageDate = new Date(message.createdAt)

  const time = messageDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  const date = messageDate.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <View style={styles.wrapper}>
      {showDate && <Text style={styles.date}>{date}</Text>}

      <View
        style={[
          styles.container,
          isOwnMessage ? styles.ownContainer : styles.otherContainer,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isOwnMessage ? styles.ownBubble : styles.otherBubble,
          ]}
        >
          <Text style={styles.text}>{message.content}</Text>
        </View>
        <Text
          style={[
            styles.time,
            isOwnMessage ? styles.ownTime : styles.otherTime,
          ]}
        >
          {time}
        </Text>
      </View>
    </View>
  )
}

export default MessageBubble

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
  },

  date: {
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
    marginVertical: 8,
  },

  container: {
    marginVertical: 2,
    paddingHorizontal: 12,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  ownContainer: {
    alignItems: 'flex-end',
  },

  otherContainer: {
    alignItems: 'flex-start',
  },

  bubble: {
    maxWidth: '75%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
  },

  ownBubble: {
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 4,
  },

  otherBubble: {
    backgroundColor: '#1f2937',
    borderBottomLeftRadius: 4,
  },

  text: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 20,
  },

  time: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },

  ownTime: {
    textAlign: 'right',
  },

  otherTime: {
    textAlign: 'left',
  },
})
