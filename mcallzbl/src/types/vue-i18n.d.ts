import 'vue'
import { VueMessageType } from 'vue-i18n'

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: (key: string, ...args: never[]) => VueMessageType
  }
}
