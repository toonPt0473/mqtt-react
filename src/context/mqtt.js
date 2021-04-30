// import mqtt from 'mqtt'
// import produce from 'immer'
// import * as React from 'react'
// import Paho from 'paho-mqtt'
// console.log(Paho)
// const MessageContext = React.createContext()
// const client = mqtt.connect('wss://test.mosquitto.org:8081')
// const subscribeTopic = 'second'

// function MessageProvider({ children }) {
//   const [messageState, setMessageState] = React.useState({})
//   client.on('connect', () => {
//     console.log('connect to mqtt')
//     client.subscribe(subscribeTopic)
//   })
//   client.on('message', (topic, message) => {
//     setMessageState(
//       produce(messageState, (draft) => {
//         draft[topic] = message
//       })
//     )
//   })
//   const value = {
//     messageState,
//     client
//   }
//   return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
// }
// function useMessage() {
//   const context = React.useContext(MessageContext)
//   if (context === undefined) {
//     throw new Error('useCount must be used within a CountProvider')
//   }
//   return context
// }
// export { MessageProvider, useMessage }

import produce from 'immer'
import * as React from 'react'
import Paho from 'paho-mqtt'

const subscribeTopic = 'second'
const clientId = 'this-is-cliend-id'

const MessageContext = React.createContext()
const client = new Paho.Client('localhost', 1883, '/', clientId)
client.connect({
  onSuccess: () => {
    client.subscribe(subscribeTopic)
  }
})

function MessageProvider({ children }) {
  const [messageState, setMessageState] = React.useState({})
  client.onMessageArrived = (message) => {
    setMessageState(
      produce(messageState, (draft) => {
        draft[message.topic] = message.payloadString
      })
    )
  }
  const value = {
    messageState,
    client
  }
  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
}
function useMessage() {
  const context = React.useContext(MessageContext)
  if (context === undefined) {
    throw new Error('useCount must be used within a CountProvider')
  }
  return context
}
export { MessageProvider, useMessage }
