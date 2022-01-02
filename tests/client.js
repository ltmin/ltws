import ltws from '@'

const ws = ltws.connect('ws://127.0.0.1:19921', {
  useReconnectEvent: true,
})

ws.on('connect', () => {
  console.log('on connect')
})

ws.once('connect', () => {
  console.log('once connect')
})

ws.on('reconnect', () => {
  console.log('on reconnect')
})

ws.on('error', (error) => {
  console.log('on error', error)
})
