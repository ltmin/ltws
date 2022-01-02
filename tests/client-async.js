import ltws from '@'

// Async Connect
;(async function () {
  const ws = ltws.createInstance()

  ws.on('connect', () => {
    console.log('on connect async')
  })

  ws.once('connect', () => {
    console.log('once connect async')
  })

  ws.on('error', (error) => {
    console.log('on error async', error)
  })

  await ws
    .connectAsync('ws://127.0.0.1:19921')
    .catch((err) => console.error('[connectAsync]', err))

  console.log('Next')
})()
