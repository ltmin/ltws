import {build} from './manager'

export function connect(...params) {
  return build()
    .bind()
    .connect(...params)
}

export function createInstance(config) {
  return build(config).bind()
}

export default {
  createInstance,
  connect,
}
