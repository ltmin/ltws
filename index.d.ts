// Type definitions for ws 8.2
// Project: https://github.com/ltmin/ltws
// Definitions by: ltmin <https://github.com/ltmin>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node" />

import WebSocket from "ws";

type ConnectOptions = {
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

type WebSocketManager = {
  ws: WebSocket
}

type LtwsEvent = 'ping' | 'pong' | 'message' | 'json' | 'connect' | 'reconnect' | 'reconnecting' | 'disconnect' | 'disconnecting' | 'error' | 'connectError';

declare class ltws {
  readonly manager: WebSocketManager;
  readonly isConnected: boolean;

  connect(origin: string, options: ConnectOptions): ltws;
  connectAsync(origin: string, options: ConnectOptions): Promise<ltws>;

  on(event: LtwsEvent, listener: () => void): this;
  once(event: LtwsEvent, listener: () => void): this;
  addListener(event: LtwsEvent, listener: () => void): this;
  addOnceListener(event: LtwsEvent, listener: () => void): this;

  off(event: LtwsEvent, listener: () => void): this;
  offOnce(event: LtwsEvent, listener: () => void): this;
  removeListener(event: LtwsEvent, listener: () => void): this;
  removeOnceListener(event: LtwsEvent, listener: () => void): this;
}

declare namespace ltws {
  export var manager: WebSocketManager;
  export var isConnected: boolean;

  export function createInstance(): ltws
  export function connect(origin: string, options: ConnectOptions): ltws;
  export function on(event: string, listener: Function): ltws;
}

export = ltws;
export as namespace ltws;
