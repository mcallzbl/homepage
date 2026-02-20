/// <reference lib="webworker" />

type EffectType = 'particles' | 'formulas' | 'hello-world' | 'code'

interface InitMessage {
  type: 'init'
  canvas: OffscreenCanvas
  color: string
  density: number
  densityFactor: number
  effect: EffectType
  devicePixelRatio: number
  size: { width: number; height: number }
}

interface ResizeMessage {
  type: 'resize'
  size: { width: number; height: number }
  devicePixelRatio: number
}

interface DisposeMessage {
  type: 'dispose'
}

type Message = InitMessage | ResizeMessage | DisposeMessage

let canvas: OffscreenCanvas | null = null
let ctx: OffscreenCanvasRenderingContext2D | null = null
let loopId: number | null = null
let running = false
let effect: EffectType = 'formulas'
let color = '#22c55e'
let density = 1
let densityFactor = 1

// Utilities
const clear = () => {
  if (!ctx || !canvas) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const setupSize = (width: number, height: number, dpr: number) => {
  if (!canvas || !ctx) return
  canvas.width = Math.max(1, Math.floor(width * dpr))
  canvas.height = Math.max(1, Math.floor(height * dpr))
  // Reset transform and scale to DPR to draw in CSS pixels
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

// ===== Effects (worker versions, lightweight) =====

// Particles
class WParticle {
  x: number
  y: number
  vx: number
  vy: number
  constructor(
    private w: number,
    private h: number,
  ) {
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5
  }
  update() {
    this.x += this.vx
    this.y += this.vy
    if (this.x < 0 || this.x > this.w) this.vx *= -1
    if (this.y < 0 || this.y > this.h) this.vy *= -1
  }
}

let particles: WParticle[] = []

const drawParticles = () => {
  if (!ctx || !canvas) return
  const w = canvas.width / (ctx.getTransform().a || 1)
  const h = canvas.height / (ctx.getTransform().d || 1)
  if (!particles.length) {
    const count = Math.floor((w * h) / 10000) * density * densityFactor
    particles = Array.from({ length: Math.max(1, count) }, () => new WParticle(w, h))
  }
  clear()
  // nodes
  for (const p of particles) {
    p.update()
    ctx.beginPath()
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }
  // lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i]
      const p2 = particles[j]
      if (!p1 || !p2) continue
      const dx = p1.x - p2.x
      const dy = p1.y - p2.y
      const dist = Math.hypot(dx, dy)
      if (dist < 120) {
        const alpha = Math.floor((1 - dist / 120) * 40)
        ctx.beginPath()
        ctx.strokeStyle = `${color}${alpha.toString(16).padStart(2, '0')}`
        ctx.lineWidth = 0.5
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()
      }
    }
  }
}

// Formulas (floating texts)
class WFormula {
  x: number
  y: number
  speed: number
  opacity: number
  rot: number
  rSpeed: number
  text: string
  constructor(
    private w: number,
    private h: number,
    text: string,
  ) {
    this.text = text
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.speed = 0.15 + Math.random() * 0.25
    this.opacity = 0.08 + Math.random() * 0.15
    this.rot = Math.random() * Math.PI * 2
    this.rSpeed = (Math.random() - 0.5) * 0.01
  }
  update() {
    this.y -= this.speed
    this.rot += this.rSpeed
    if (this.y < -30) {
      this.y = this.h + 30
      this.x = Math.random() * this.w
    }
  }
}

let formulas: WFormula[] = []
const formulaTexts = [
  'E = mc²',
  'a² + b² = c²',
  'e^(iπ) + 1 = 0',
  '∫ f(x)dx',
  'd/dx',
  'Σ aₙe^(inx)',
  'O(n log n)',
  'Θ(n²)',
  'Ω(n)',
  'F = ma',
  '∇·E = ρ/ε₀',
]

const drawFormulas = () => {
  if (!ctx || !canvas) return
  const w = canvas.width / (ctx.getTransform().a || 1)
  const h = canvas.height / (ctx.getTransform().d || 1)
  if (!formulas.length) {
    const count = Math.floor(40 + Math.random() * 20) * density * densityFactor
    formulas = Array.from({ length: Math.max(1, count) }, () => {
      const idx = Math.floor(Math.random() * formulaTexts.length)
      const text = formulaTexts[idx] || 'E = mc²'
      return new WFormula(w, h, text)
    })
  }
  clear()
  for (const f of formulas) {
    f.update()
    ctx.save()
    ctx.translate(f.x, f.y)
    ctx.rotate(f.rot)
    ctx.font = '14px Arial'
    const alpha = Math.floor(f.opacity * 255)
      .toString(16)
      .padStart(2, '0')
    ctx.fillStyle = `${color}${alpha}`
    ctx.fillText(f.text, 0, 0)
    ctx.restore()
  }
}

const tick = () => {
  if (!running) return
  try {
    switch (effect) {
      case 'particles':
        drawParticles()
        break
      case 'hello-world':
      case 'code':
      case 'formulas':
      default:
        drawFormulas()
        break
    }
  } catch {}
}

const start = () => {
  if (loopId !== null) return
  running = true
  loopId = self.setInterval(tick, 33) // ~30fps
}

const stop = () => {
  running = false
  if (loopId !== null) {
    clearInterval(loopId)
    loopId = null
  }
}

self.addEventListener('message', (e: MessageEvent<Message>) => {
  const data = e.data
  if (!data) return
  switch (data.type) {
    case 'init': {
      canvas = data.canvas
      color = data.color || color
      density = data.density || density
      densityFactor = data.densityFactor || 1
      effect = data.effect || 'formulas'
      ctx = canvas.getContext('2d')
      if (!ctx) return
      setupSize(data.size.width, data.size.height, data.devicePixelRatio || 1)
      // reset state
      particles = []
      formulas = []
      start()
      break
    }
    case 'resize': {
      if (!ctx || !canvas) return
      setupSize(data.size.width, data.size.height, data.devicePixelRatio || 1)
      // clear caches so counts recalculated
      particles = []
      formulas = []
      break
    }
    case 'dispose': {
      stop()
      break
    }
  }
})
