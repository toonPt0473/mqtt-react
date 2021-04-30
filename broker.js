// const aedes = require('aedes')()
// const server = require('net').createServer(aedes.handle)
// const port = 1883

// server.listen(port, function () {
//   console.log('server started and listening on port ', port)
// })

const aedes = require('aedes')()
const httpServer = require('http').createServer()
const ws = require('websocket-stream')
const _ = require('lodash')
const port = 1883

ws.createServer({ server: httpServer }, aedes.handle)

let mockupDataBase = []

const manageTopic = (topic, message) => {
  if (topic === 'first' && message === 'Installing') {
    setTimeout(() => {
      const data = {
        cmd: 'publish',
        qos: 0,
        topic: 'second',
        payload: Buffer.from('next'),
        retain: false
      }
      aedes.publish(data)
    }, 1000)
  }
}

aedes.on('subscribe', (sub) => {
  const findTopic = mockupDataBase.find((i) => i.topic === _.get(sub, '0.topic'))
  if (findTopic) {
    const data = {
      cmd: 'publish',
      qos: 0,
      topic: findTopic.topic,
      payload: Buffer.from(findTopic.message),
      retain: false
    }
    aedes.publish(data)
  }
})

aedes.on('publish', (pub) => {
  const { topic, payload } = pub
  const message = payload.toString()
  mockupDataBase.push({
    topic,
    message
  })
  manageTopic(topic, message)
})

httpServer.listen(port, function () {
  console.log('websocket server listening on port ', port)
})
