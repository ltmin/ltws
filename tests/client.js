import ltws from '@'

const ws = ltws.connect('ws://127.0.0.1:19921', {
  debug: true,
})

ws.on('connect', () => {
  console.log('on connect')
})

ws.once('connect', () => {
  console.log('once connect')
})

ws.on('error', (error) => {
  console.log('error', error)
})

setInterval(function () {}, 1000 * 60 * 60)
