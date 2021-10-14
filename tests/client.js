import ltws from '@'

const ws = ltws.connect('ws://127.0.0.1:19921', {
  debug: true,
})

ws.on('connect', () => {
  console.log('1232131')
})

ws.on('error', (error) => {
  console.log('error', error)
})

console.log(ws)

setInterval(function () {}, 1000 * 60 * 60)
