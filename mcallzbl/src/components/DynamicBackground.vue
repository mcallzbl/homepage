<template>
  <div class="dynamic-background">
    <!-- Canvas for dynamic effects -->
    <canvas ref="canvasRef" class="background-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  effect?: 'particles' | 'code' | 'formulas' | 'hello-world'
  color?: string
  density?: number
}

const props = withDefaults(defineProps<Props>(), {
  effect: 'formulas',
  color: '#22c55e',
  density: 1,
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let ctx: CanvasRenderingContext2D | null = null
let lastTime = 0
let usingWorker = false
let workerRef: Worker | null = null

// 根据设备情况调整密度，降低移动端压力，尊重用户的「减少动态效果」偏好
const densityFactor = ref(1)

const computeDensityFactor = () => {
  try {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return 0
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
    return isMobile ? 0.5 : 1
  } catch {
    return 1
  }
}

// 粒子连线效果
class ParticleNetwork {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private particles: Particle[]
  private particleCount: number

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas
    this.ctx = ctx
    const df = densityFactor.value || 1
    this.particleCount = Math.floor((canvas.width * canvas.height) / 10000) * props.density * df
    this.particles = []
    this.init()
  }

  init() {
    this.particles = []
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(new Particle(this.canvas))
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // 更新和绘制粒子
    this.particles.forEach((particle) => {
      particle.update()
      particle.draw(this.ctx, props.color || '#22c55e')
    })

    // 绘制连线
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i]
        const p2 = this.particles[j]
        if (!p1 || !p2) continue

        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 120) {
          this.ctx.beginPath()
          const alpha = Math.floor((1 - distance / 120) * 40)
            .toString(16)
            .padStart(2, '0')
          this.ctx.strokeStyle = `${props.color}${alpha}`
          this.ctx.lineWidth = 0.5
          this.ctx.moveTo(p1.x, p1.y)
          this.ctx.lineTo(p2.x, p2.y)
          this.ctx.stroke()
        }
      }
    }
  }

  resize() {
    const df = densityFactor.value || 1
    this.particleCount =
      Math.floor((this.canvas.width * this.canvas.height) / 10000) * props.density * df
    this.init()
  }
}

class Particle {
  x: number
  y: number
  vx: number
  vy: number
  canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5
  }

  update() {
    this.x += this.vx
    this.y += this.vy

    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }
}

// 代码片段漂浮效果
class FloatingCode {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private codeSnippets: CodeSnippet[]

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas
    this.ctx = ctx
    this.codeSnippets = []
    this.init()
  }

  init() {
    const snippets = [
      'const x = 42;',
      'function() {}',
      'import React',
      'async/await',
      'Promise.all()',
      'git commit',
      'npm install',
      'SELECT * FROM',
      'docker run',
      'console.log()',
      'return true;',
      '<Component />',
      'let data = []',
    ]

    const df = densityFactor.value || 1
    for (let i = 0; i < 15 * props.density * df; i++) {
      const snippet = snippets[Math.floor(Math.random() * snippets.length)]
      if (snippet) {
        this.codeSnippets.push(new CodeSnippet(this.canvas, snippet))
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.codeSnippets.forEach((snippet) => {
      snippet.update()
      snippet.draw(this.ctx, props.color || '#22c55e')
    })
  }

  resize() {
    this.init()
  }
}

class CodeSnippet {
  x: number
  y: number
  text: string
  speed: number
  opacity: number
  canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement, text: string) {
    this.canvas = canvas
    this.text = text
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.speed = 0.2 + Math.random() * 0.3
    this.opacity = 0.1 + Math.random() * 0.2
  }

  update() {
    this.y -= this.speed
    if (this.y < -20) {
      this.y = this.canvas.height + 20
      this.x = Math.random() * this.canvas.width
    }
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.font = '12px monospace'
    const alpha = Math.floor(this.opacity * 255)
      .toString(16)
      .padStart(2, '0')
    ctx.fillStyle = `${color}${alpha}`
    ctx.fillText(this.text, this.x, this.y)
  }
}

// Hello World 多语言漂浮效果
class FloatingHelloWorld {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private greetings: Greeting[]

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas
    this.ctx = ctx
    this.greetings = []
    this.init()
  }

  init() {
    // 世界各种语言的 Hello World
    const helloWorldTexts = [
      // // 主流编程语言
      // { text: 'print("Hello World")', lang: 'Python' },
      // { text: 'console.log("Hello World")', lang: 'JavaScript' },
      // { text: 'System.out.println("Hello World")', lang: 'Java' },
      // { text: 'printf("Hello World\\n")', lang: 'C' },
      // { text: 'cout << "Hello World"', lang: 'C++' },
      // { text: 'println!("Hello World")', lang: 'Rust' },
      // { text: 'fmt.Println("Hello World")', lang: 'Go' },
      // { text: 'echo "Hello World"', lang: 'PHP' },
      // { text: 'puts "Hello World"', lang: 'Ruby' },
      // { text: 'Console.WriteLine("Hello World")', lang: 'C#' },

      // 人类语言
      { text: 'Hello World', lang: 'English' },
      { text: '你好世界', lang: '中文' },
      { text: 'こんにちは世界', lang: '日本語' },
      { text: '안녕하세요 세계', lang: '한국어' },
      { text: 'Привет мир', lang: 'Русский' },
      { text: 'Bonjour le monde', lang: 'Français' },
      { text: 'Hola Mundo', lang: 'Español' },
      { text: 'Hallo Welt', lang: 'Deutsch' },
      { text: 'Saluton, Mondo', lang: 'Esperanto' },
      { text: 'Olá Mundo', lang: 'Português' },
      { text: 'Ciao Mondo', lang: 'Italiano' },
      { text: 'مرحبا بالعالم', lang: 'العربية' },
      { text: 'नमस्ते दुनिया', lang: 'हिन्दी' },
      { text: 'Hej Världen', lang: 'Svenska' },
      { text: 'Hallo Wereld', lang: 'Nederlands' },
      { text: 'Γειά σου Κόσμε', lang: 'Ελληνικά' },
      { text: 'Merhaba Dünya', lang: 'Türkçe' },
      { text: 'สวัสดีชาวโลก', lang: 'ไทย' },
      { text: 'Xin chào Thế giới', lang: 'Tiếng Việt' },
      { text: 'Kamusta Mundo', lang: 'Filipino' },
      { text: 'Halo Dunia', lang: 'Bahasa' },

      // 更多编程语言
      // { text: 'print "Hello World"', lang: 'Perl' },
      // { text: '(print "Hello World")', lang: 'Lisp' },
      // { text: 'putStrLn "Hello World"', lang: 'Haskell' },
      // { text: 'print("Hello World")', lang: 'Swift' },
      // { text: 'println("Hello World")', lang: 'Kotlin' },
      // { text: 'writeln("Hello World")', lang: 'Pascal' },
      // { text: 'PRINT "Hello World"', lang: 'BASIC' },
      // { text: 'disp("Hello World")', lang: 'MATLAB' },
      // { text: 'cat("Hello World\\n")', lang: 'R' },
      // { text: 'IO.puts "Hello World"', lang: 'Elixir' },

      // 古老语言和方言
      { text: 'Здравей свят', lang: 'Български' },
      { text: 'Ahoj světe', lang: 'Čeština' },
      { text: 'Hei Verden', lang: 'Norsk' },
      { text: 'Hej Verden', lang: 'Dansk' },
      { text: 'Tervehdys maailma', lang: 'Suomi' },
      { text: 'Witaj świecie', lang: 'Polski' },
      { text: 'Szia Világ', lang: 'Magyar' },
      { text: 'Salut Lume', lang: 'Română' },
      { text: 'Pozdrav svijete', lang: 'Hrvatski' },

      // // Shell 和脚本语言
      // { text: 'echo "Hello World"', lang: 'Bash' },
      // { text: 'Write-Host "Hello World"', lang: 'PowerShell' },
      // { text: 'say "Hello World"', lang: 'AppleScript' },

      // 标记语言
      // { text: '<h1>Hello World</h1>', lang: 'HTML' },
      // { text: '# Hello World', lang: 'Markdown' },

      // // 数据库
      // { text: "SELECT 'Hello World'", lang: 'SQL' }
    ]

    // 增加密度：30-50 个问候语
    const df = densityFactor.value || 1
    const count = Math.floor(30 + Math.random() * 20) * props.density * df
    for (let i = 0; i < count; i++) {
      const greeting = helloWorldTexts[Math.floor(Math.random() * helloWorldTexts.length)]
      if (greeting) {
        this.greetings.push(new Greeting(this.canvas, greeting.text, greeting.lang))
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.greetings.forEach((greeting) => {
      greeting.update()
      greeting.draw(this.ctx, props.color || '#22c55e')
    })
  }

  resize() {
    this.init()
  }
}

class Greeting {
  x: number
  y: number
  text: string
  lang: string
  speed: number
  opacity: number
  rotation: number
  rotationSpeed: number
  canvas: HTMLCanvasElement
  fontSize: number

  constructor(canvas: HTMLCanvasElement, text: string, lang: string) {
    this.canvas = canvas
    this.text = text
    this.lang = lang
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.speed = 0.15 + Math.random() * 0.3
    this.opacity = 0.1 + Math.random() * 0.2
    this.rotation = Math.random() * Math.PI * 2
    this.rotationSpeed = (Math.random() - 0.5) * 0.015
    this.fontSize = 11 + Math.random() * 3 // 11-14px
  }

  update() {
    this.y -= this.speed
    this.rotation += this.rotationSpeed
    if (this.y < -50) {
      this.y = this.canvas.height + 50
      this.x = Math.random() * this.canvas.width
    }
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)

    // 绘制主文本
    ctx.font = `${this.fontSize}px "SF Mono", Monaco, monospace`
    const alpha = Math.floor(this.opacity * 255)
      .toString(16)
      .padStart(2, '0')
    ctx.fillStyle = `${color}${alpha}`
    ctx.fillText(this.text, 0, 0)

    // 绘制语言标签（更小、更淡）
    // ctx.font = `${this.fontSize - 2}px Arial`
    // const labelAlpha = Math.floor(this.opacity * 0.6 * 255).toString(16).padStart(2, '0')
    // ctx.fillStyle = `${color}${labelAlpha}`
    // ctx.fillText(`// ${this.lang}`, 0, this.fontSize + 4)

    ctx.restore()
  }
}

// 数学公式漂浮效果 - 大幅增强版
class FloatingFormulas {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private formulas: Formula[]

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas
    this.ctx = ctx
    this.formulas = []
    this.init()
  }

  init() {
    // 大幅增加公式数量和种类
    const formulaTexts = [
      // 经典数学公式
      'E = mc²',
      'a² + b² = c²',
      'e^(iπ) + 1 = 0',

      // 微积分
      '∫ f(x)dx',
      '∂f/∂x',
      'd/dx[x²] = 2x',
      'lim(x→∞)',
      'Δx → 0',
      '∫₀^∞ e^(-x)dx',
      '∑(n=1)^∞ 1/n²',

      // 三角函数
      'sin²x + cos²x = 1',
      'tan(x) = sin(x)/cos(x)',
      'e^(ix) = cos(x) + isin(x)',

      // 代数
      'x = (-b ± √(b²-4ac))/2a',
      '(a+b)² = a² + 2ab + b²',
      'log(ab) = log(a) + log(b)',

      // 几何
      'V = 4/3πr³',
      'A = πr²',
      'C = 2πr',
      '√(x² + y²)',

      // 线性代数
      'det(AB) = det(A)det(B)',
      'A^T A',
      '||v|| = √(v·v)',
      'rank(A)',

      // 概率统计
      'P(A∩B) = P(A)P(B|A)',
      'E[X] = ∑xP(x)',
      'σ² = E[(X-μ)²]',
      'Var(X+Y)',

      // 复分析
      'f(z) = u + iv',
      '∮ f(z)dz = 0',
      'Res(f,z₀)',

      // 数论
      'φ(n)',
      'gcd(a,b)',
      'a ≡ b (mod n)',

      // 集合论
      'A ∪ B',
      'A ∩ B',
      'A ⊆ B',
      '|A| = n',

      // 拓扑
      '∂Ω',
      'cl(A)',
      'int(A)',

      // 微分方程
      'dy/dx + P(x)y = Q(x)',
      'd²y/dx² + ω²y = 0',

      // 傅里叶分析
      'F(ω) = ∫ f(t)e^(-iωt)dt',
      '∑ aₙe^(inx)',

      // 复杂度理论
      'O(n log n)',
      'Θ(n²)',
      'Ω(n)',

      // 物理公式
      'F = ma',
      'p = mv',
      'W = Fd',
      'KE = ½mv²',
      'PE = mgh',

      // 量子力学
      'ĤΨ = EΨ',
      'ΔxΔp ≥ ℏ/2',

      // 相对论
      't′ = γ(t - vx/c²)',
      'L = L₀/γ',

      // 电磁学
      '∇·E = ρ/ε₀',
      '∇×B = μ₀J',

      // 热力学
      'dU = δQ - δW',
      'S = k ln(Ω)',

      // 希腊字母和特殊符号
      'α β γ δ',
      'λ μ ν ξ',
      'π ρ σ τ',
      'φ χ ψ ω',
      'Σ Π Δ Ω',
      '∀ ∃ ∈ ∉',
      '⊂ ⊃ ∪ ∩',
      '≤ ≥ ≠ ≈',
      '∞ ∂ ∇ ∫',
    ]

    // 增加密度：从 12 个增加到 40-60 个公式
    const count = Math.floor(40 + Math.random() * 20) * props.density
    for (let i = 0; i < count; i++) {
      const formula = formulaTexts[Math.floor(Math.random() * formulaTexts.length)]
      if (formula) {
        this.formulas.push(new Formula(this.canvas, formula))
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.formulas.forEach((formula) => {
      formula.update()
      formula.draw(this.ctx, props.color || '#22c55e')
    })
  }

  resize() {
    this.init()
  }
}

class Formula {
  x: number
  y: number
  text: string
  speed: number
  opacity: number
  rotation: number
  rotationSpeed: number
  canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement, text: string) {
    this.canvas = canvas
    this.text = text
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.speed = 0.15 + Math.random() * 0.25
    this.opacity = 0.08 + Math.random() * 0.15
    this.rotation = Math.random() * Math.PI * 2
    this.rotationSpeed = (Math.random() - 0.5) * 0.01
  }

  update() {
    this.y -= this.speed
    this.rotation += this.rotationSpeed
    if (this.y < -30) {
      this.y = this.canvas.height + 30
      this.x = Math.random() * this.canvas.width
    }
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    ctx.font = '14px Arial'
    const alpha = Math.floor(this.opacity * 255)
      .toString(16)
      .padStart(2, '0')
    ctx.fillStyle = `${color}${alpha}`
    ctx.fillText(this.text, 0, 0)
    ctx.restore()
  }
}

let effectInstance: ParticleNetwork | FloatingCode | FloatingFormulas | FloatingHelloWorld | null =
  null

const setupCanvas = () => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * window.devicePixelRatio
  canvas.height = rect.height * window.devicePixelRatio
  canvas.style.width = `${rect.width}px`
  canvas.style.height = `${rect.height}px`

  ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

  // Worker 优先，其次主线程回退
  densityFactor.value = computeDensityFactor()
  const supportsOffscreen = 'transferControlToOffscreen' in canvas && typeof Worker !== 'undefined'
  if (supportsOffscreen) {
    try {
      type OffscreenCapable = HTMLCanvasElement & {
        transferControlToOffscreen: () => OffscreenCanvas
      }
      const off = (canvas as OffscreenCapable).transferControlToOffscreen()
      workerRef = new Worker(new URL('@/workers/bgWorker.ts', import.meta.url), { type: 'module' })
      const dpr = window.devicePixelRatio || 1
      workerRef.postMessage(
        {
          type: 'init',
          canvas: off,
          color: props.color,
          density: props.density,
          densityFactor: densityFactor.value,
          effect: props.effect,
          devicePixelRatio: dpr,
          size: {
            width: canvas.clientWidth || window.innerWidth,
            height: canvas.clientHeight || window.innerHeight,
          },
        },
        [off as unknown as Transferable],
      )
      usingWorker = true
      return
    } catch {
      // fall through to main-thread rendering
    }
  }
  // 主线程回退（旧实现）
  switch (props.effect) {
    case 'particles':
      effectInstance = new ParticleNetwork(canvas, ctx)
      break
    case 'code':
      effectInstance = new FloatingCode(canvas, ctx)
      break
    case 'formulas':
      effectInstance = new FloatingFormulas(canvas, ctx)
      break
    case 'hello-world':
      effectInstance = new FloatingHelloWorld(canvas, ctx)
      break
  }
}

const animate = (now?: number) => {
  // 限制刷新率（~30fps），降低移动端压力
  const t = now || performance.now()
  if (!lastTime || t - lastTime >= 33) {
    if (effectInstance) {
      effectInstance.draw()
    }
    lastTime = t
  }
  animationId = requestAnimationFrame(animate)
}

const handleResize = () => {
  const canvas = canvasRef.value
  if (usingWorker && workerRef && canvas) {
    const dpr2 = window.devicePixelRatio || 1
    workerRef.postMessage({
      type: 'resize',
      size: {
        width: canvas.clientWidth || window.innerWidth,
        height: canvas.clientHeight || window.innerHeight,
      },
      devicePixelRatio: dpr2,
    })
    return
  }
  setupCanvas()
  if (effectInstance && 'resize' in effectInstance) {
    effectInstance.resize()
  }
}

onMounted(() => {
  setupCanvas()
  if (!usingWorker) {
    animate()
  }
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (workerRef) {
    workerRef.postMessage({ type: 'dispose' })
    workerRef.terminate()
    workerRef = null
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.dynamic-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.background-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
