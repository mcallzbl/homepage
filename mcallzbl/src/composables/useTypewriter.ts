import { ref, onUnmounted } from 'vue'

export interface TypewriterOptions {
  speed?: number // 打字速度（毫秒）
  onComplete?: () => void // 完成回调
}

/**
 * 打字机效果 Composable
 * 提供打字机动画效果，可控制速度和状态
 */
export function useTypewriter(options: TypewriterOptions = {}) {
  const { speed = 50, onComplete } = options

  const displayedText = ref('')
  const isTyping = ref(false)

  let currentTimeoutId: number | null = null

  /**
   * 清除所有定时器
   */
  const clear = () => {
    if (currentTimeoutId !== null) {
      clearTimeout(currentTimeoutId)
      currentTimeoutId = null
    }
  }

  /**
   * 停止打字机效果
   */
  const stop = () => {
    clear()
    isTyping.value = false
  }

  /**
   * 重置打字机状态
   */
  const reset = () => {
    stop()
    displayedText.value = ''
  }

  /**
   * 开始打字机效果
   * @param text 要显示的文本
   * @param customSpeed 自定义速度（可选）
   */
  const start = (text: string, customSpeed?: number) => {
    // 清除之前的效果
    reset()

    if (!text) {
      return
    }

    isTyping.value = true
    let index = 0
    const typeSpeed = customSpeed ?? speed

    const type = () => {
      if (index < text.length) {
        displayedText.value += text.charAt(index)
        index++
        currentTimeoutId = setTimeout(type, typeSpeed) as unknown as number
      } else {
        isTyping.value = false
        currentTimeoutId = null
        onComplete?.()
      }
    }

    type()
  }

  /**
   * 立即显示完整文本（跳过动画）
   */
  const skipAnimation = (text: string) => {
    stop()
    displayedText.value = text
  }

  // 组件卸载时清理定时器
  onUnmounted(() => {
    clear()
  })

  return {
    displayedText,
    isTyping,
    start,
    stop,
    reset,
    skipAnimation
  }
}
