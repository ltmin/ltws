import _ from 'lodash'
import Ws from 'ws'

export const ReadyState = {
  CONNECTING: Ws.CONNECTING,
  OPEN: Ws.OPEN,
  CLOSING: Ws.CLOSING,
  CLOSED: Ws.CLOSED,
}

const onOpen = (manager) => async (_raw) => {
  clearTimeout(manager.connCreatingTimeoutScheduler)

  manager.connReadyCount++
  manager.connRetries = 0

  if (manager.config.pingInterval !== -1) {
    manager.pingScheduler = setInterval(() => {
      if (!manager.ws) {
        manager.out_error('[ping-scheduler] not initialized')

        return
      }

      if (manager.ws.readyState === Ws.OPEN) {
        manager.out_debug('[ping-scheduler] sending ping')
        if (manager.pingTimeoutScheduler === null) {
          manager.pingTimeoutScheduler = setTimeout(
            () => onClose(manager)('PingTimeout'),
            manager.config.pingTimeout
          )
        }
        manager.ws.ping()
      } else {
        manager.out_warn(
          '[ping-scheduler] readyState failed',
          manager.ws.readyState
        )
      }
    }, manager.config.pingInterval)
  } else {
    manager.out_info('[ping-scheduler] disabled')
  }

  if (manager.connReadyCount > 1 && manager.config.useReconnectEvent) {
    manager.out_debug(
      '[on-open] socket re-connected',
      manager.config.useReconnectEvent
    )
    await manager.on_reconnect(_raw)
  } else {
    manager.out_debug('[on-open] socket connected', manager.connReadyCount)
    await manager.on_connect(_raw)
  }
}

const onPing = (manager) => async (_raw) => {
  manager.out_debug('[on-ping] received')
  const result = await manager.on_ping(_raw)
  if (result !== false) {
    manager.out_debug('[on-ping] sending pong')
    manager.ws.pong()
  } else {
    manager.out_debug('[on-ping] sending ignored')
  }
}

const onPong = (manager) => async (_raw) => {
  manager.out_debug('[on-pong] received')
  clearTimeout(manager.pingTimeoutScheduler)
  manager.pingTimeoutScheduler = null
  await manager.on_pong(_raw)
}

const onClose = (manager) => async (closeCode) => {
  manager.out_info('[on-close] socket closed', closeCode)

  destroy(manager, closeCode)

  const result = await manager.on_disconnecting(closeCode)
  if (result === false) {
    manager.out_warn('[on-close] abort re-connect', manager.ws.readyState)

    await manager.on_disconnect(closeCode)

    return
  }

  if (
    manager.autoReconnect &&
    manager.connRetries < manager.config.maxRetries
  ) {
    manager.connRetries++
    setTimeout(async () => {
      manager.out_debug(
        '[on-close] socket delay re-connect',
        manager.config.reconnectDelay
      )

      await manager.on_reconnecting(closeCode, manager.connRetries)
      connect(manager)
    }, manager.config.reconnectDelay)
  } else {
    await manager.on_disconnect(closeCode)
  }
}

const onMessage = (manager) => async (_raw) => {
  manager.out_debug('[on-message] received')
  await manager.on_message(_raw)
}

const onJson = (manager) => async (_raw) => {
  manager.out_debug('[on-json] received')
  try {
    const json = JSON.parse(_raw)
    await manager.on_json(json, _raw)
  } catch (err) {
    await manager.on_json(null, _raw)
  }
}

const onError = (manager) => async (_raw) => {
  manager.out_debug('[on-error] error thrown', _raw)

  await manager.on_error(_raw)
}

const destroy = (manager, reason) => {
  clearInterval(manager.pingScheduler)
  clearTimeout(manager.pingTimeoutScheduler)
  clearTimeout(manager.connCreatingTimeoutScheduler)
  manager.pingTimeoutScheduler = null

  if (manager.ws && manager.ws.readyState === Ws.OPEN) {
    manager.ws.close()
  }
  // if (manager.ws) {
  //   manager.ws._events = {}
  // }
  manager.ws = null
  manager.destroyReason = reason
}

export const connect = (manager) => {
  manager.connCreatingTimeoutScheduler = setTimeout(async () => {
    destroy(manager, 'ConnectTimeout')

    manager.out_warn('[connect] timeout')

    if (manager.connRetries < manager.config.maxRetries) {
      manager.connRetries++
      await manager.on_reconnecting('ConnectTimeout', manager.connRetries)
      connect(manager)
    } else {
      await manager.on_connectError('ConnectTimeout')
    }
  }, manager.config.connectTimeout)

  manager.ws = new Ws(manager.origin, manager.baseConfig)

  manager.ws.on('open', onOpen(manager))
  manager.ws.on('close', onClose(manager))
  manager.ws.on('ping', onPing(manager))
  manager.ws.on('pong', onPong(manager))
  manager.ws.on('message', onMessage(manager))
  manager.ws.on('message', onJson(manager))
  manager.ws.on('error', onError(manager))
}
