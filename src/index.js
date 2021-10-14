import {build} from './manager'

export function connect(...params) {
  return build()
    .bind()
    .connect(...params)
}

export default {
  connect,
}
