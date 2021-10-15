# ltws is a websocket library

ltws will manage ws connection that will automatically reconnect if the connection is closed.

## Install

```bash
npm i ltws
```
#### Or
```bash
npm install --save ltws
```

## Usage

### Simple usage

```javascript
import ltws from 'ltws'

const ltws = ltws.connect('ws://my.site.com')

ltws.on('connect', () => {
  ltws.send('hello!')

  ltws.sendJson({msg: 'hello!'})
})

ltws.on('json', (message) => {
  console.log('on json', message)
})

ltws.on('message', (message) => {
  console.log('on message', message)
})

ltws.once('message', (message) => {
  console.log('once message', message)
})
```

### Options

#### Sample with custom options

```javascript
import ltws from 'ltws'

const options = {
  connectTimeout: 5000,
  maxRetries: 10,
}
const ltws = ltws.connect('ws://my.site.com', options)
```

#### Available options

```typescript
type Options = {
  pingInterval?: number
  pingTimeout?: number
  connectTimeout?: number
  reconnectTimeout?: number
  reconnectDelay?: number
  maxRetries?: number
  useReconnectEvent?: boolean
  autoReconnect?: boolean
  debug?: boolean
  warn?: boolean
  error?: boolean
}
```

#### Default values

```javascript
{
  pingInterval: 5000,
  pingTimeout: 5000,
  connectTimeout: 5000,
  reconnectTimeout: 5000,
  reconnectDelay: 5000,
  maxRetries: Number.MAX_SAFE_INTEGER,
  useReconnectEvent: false,
  autoReconnect: true,
  debug: false,
  warn: true,
  error: true
}
```

## API

### Methods

```typescript
connect(url: String, options: Options)
reconnect()
disconnect()

send(data: string | ArrayBuffer | Blob | ArrayBufferView)
sendJson(data: Object)

type Event = 'ping' | 'pong' | 'message' | 'json' | 'connect' | 'reconnect' | 'reconnecting' | 'disconnect' | 'disconnecting' | 'error' | 'connectError'

on(type: Event, listener: EventListener)
once(type: Event, listener: EventListener)
off(type: Event, listener: EventListener)
removeListener(type: Event, listener: EventListener)
removeOnceListener(type: Event, listener: EventListener)
```

## License

MIT
