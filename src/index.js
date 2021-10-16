import {build} from './manager'

export function connect(...params) {
  return build()
    .bind()
    .connect(...params)
}

export function createInstance() {
  return build().bind()
}

export default {
  createInstance,
  connect,
}
