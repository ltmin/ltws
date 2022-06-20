import _ from 'lodash'
import Ws from 'ws'
import Bluebird from 'bluebird'

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
      if (manager.pingTimeoutScheduler) {
        return
      }

      if (!manager.ws) {
        manager.out_error('[ping-scheduler] no ws to ping')

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
    if (manager.ws) {
      manager.out_debug('[on-ping] sending pong')
      manager.ws.pong()
    } else {
      manager.out_debug('[on-ping] no ws to pong')
    }
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

const checkAndReconnect = async (manager, closeCode) => {
  if (manager.reconnectScheluder) {
    return
  }

  if (
    manager.autoReconnect &&
    (manager.config.maxRetries === Number.MAX_SAFE_INTEGER ||
      manager.connRetries < manager.config.maxRetries)
  ) {
    manager.connRetries++
    manager.reconnectScheluder = setTimeout(async () => {
      manager.reconnectScheluder = null
      manager.out_debug(
        '[on-close] socket delay re-connect',
        manager.config.reconnectDelay
      )

      await manager.on_reconnecting(closeCode, manager.connRetries)
      reconnect(manager)
    }, manager.config.reconnectDelay)
  } else {
    await manager.on_disconnect(closeCode)
  }
}

const onClose = (manager) => async (closeCode) => {
  if (!manager.connReadyCount) {
    closeCode = closeCode || 'ConnectError'
  }

  manager.out_info('[on-close] socket closed', closeCode)

  destroy(manager, closeCode)

  const result = await manager.on_disconnecting(closeCode)
  if (result === false) {
    manager.out_warn(
      '[on-close] abort re-connect',
      _.get(manager, 'ws.readyState', null)
    )

    await manager.on_disconnect(closeCode)

    return
  }

  await checkAndReconnect(manager, closeCode)
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

const onUnexpectedResponse = (manager) => async (_raw) => {
  manager.out_debug('[on-unexpected-response] error thrown', _raw)

  await manager.on_error(_raw)
}

const destroy = (manager, reason) => {
  clearInterval(manager.pingScheduler)
  clearTimeout(manager.pingTimeoutScheduler)
  clearTimeout(manager.connCreatingTimeoutScheduler)
  manager.pingTimeoutScheduler = null

  if (manager.ws) {
    manager.ws._events = {}
  }

  if (manager.ws && manager.ws.readyState === Ws.OPEN) {
    manager.ws.close()
  }
  manager.ws = null
  manager.destroyReason = reason
}

const bindListeners = (manager) => {
  manager.ws.on('open', onOpen(manager))
  manager.ws.on('close', onClose(manager))
  manager.ws.on('ping', onPing(manager))
  manager.ws.on('pong', onPong(manager))
  manager.ws.on('message', onMessage(manager))
  manager.ws.on('message', onJson(manager))
  manager.ws.on('error', onError(manager))
  manager.ws.on('unexpected-response', onUnexpectedResponse(manager))
}

const reconnect = (manager) => {
  manager.connCreatingTimeoutScheduler = setTimeout(async () => {
    destroy(manager, 'ReconnectTimeout')

    manager.out_warn('[reconnect] timeout')

    if (manager.connRetries < manager.config.maxRetries) {
      manager.connRetries++
      await manager.on_reconnecting('ReconnectTimeout', manager.connRetries)
      connect(manager)
    } else {
      await manager.on_disconnect('ReconnectTimeout')
    }
  }, manager.config.reconnectTimeout)

  manager.ws = new Ws(manager.origin, manager.baseConfig)

  bindListeners(manager)
}

export const connect = (manager) => {
  manager.connCreatingTimeoutScheduler = setTimeout(async () => {
    destroy(manager, 'ConnectTimeout')

    manager.out_warn('[connect] timeout')

    await manager.on_connectError('ConnectTimeout')

    await checkAndReconnect(manager, 'ConnectTimeout')
  }, manager.config.connectTimeout)

  manager.ws = new Ws(manager.origin, manager.baseConfig)

  bindListeners(manager)
}

export const connectAsync = (manager) => {
  return new Bluebird((resolve, reject) => {
    const doResolve = () => {
      clearTimeout(manager.connCreatingTimeoutScheduler)
      manager.ws && manager.ws.off('open', doResolve)
      manager.ws && manager.ws.off('close', doReject)

      resolve()
    }

    const doReject = (reason) => {
      clearTimeout(manager.connCreatingTimeoutScheduler)
      manager.ws && manager.ws.off('open', doResolve)
      manager.ws && manager.ws.off('close', doReject)

      reject(reason)
    }

    manager.connCreatingTimeoutScheduler = setTimeout(async () => {
      destroy(manager, 'ConnectTimeout')

      manager.out_warn('[connect] timeout')

      doReject('ConnectTimeout')
    }, manager.config.connectTimeout)

    manager.ws = new Ws(manager.origin, manager.baseConfig)

    manager.ws.on('open', () => doResolve())
    manager.ws.on('close', (reason) => doReject(reason))

    bindListeners(manager)
  })
}
