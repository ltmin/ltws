import {build} from './manager'

export function connect(...params) {
  return build()
    .bind()
    .connect(...params)
}

export function create() {
  return build().bind()
}

export default {
  create,
  connect,
}
