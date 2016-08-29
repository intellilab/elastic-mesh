const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const _w = canvas.width = 800
const _h = canvas.height = 500
const space = 8
const cols = ~~(_w / space)
const rows = ~~(_h / space)
const dots = []
let towPoint
let down = false
const mouse = {
    x: 0,
    y: 0
}

function Dot(row, col) {
    this.row = row
    this.col = col
    this.x   = col * space
    this.y   = row * space
    this.vx  = 0
    this.vy  = 0
    this.sx  = this.x
    this.sy  = this.y
    this.ax  = 0
    this.ay  = 0
    this.rate = .06      // a = f/m = kx/m = rate * x
    this.damping = .3    // 阻尼系数
}

Dot.prototype = {
    throb() {
        if (towPoint == this) return
        if (this.row == 0 || this.row == rows) return
        if (this.col == 0 || this.col == cols) return

        let up, down, left, right,
            cx, cy, mAx, mAy

        up = dots[(this.row - 1) * (cols + 1) + this.col]
        down = dots[(this.row + 1) * (cols + 1) + this.col]
        left = dots[this.row * (cols + 1) + this.col - 1]
        right = dots[this.row * (cols + 1) + this.col + 1]

        cx = (up.x + down.x + left.x + right.x) * .25
        cy = (up.y + down.y + left.y + right.y) * .25

        this.ax = (cx - this.x) * this.rate
        this.ay = (cy - this.y) * this.rate

        this.vx += this.ax
        this.vy += this.ay

        // 衰减
        this.attenuate()
    },
    attenuate() {
        const ax = Math.abs(this.ax) * this.damping
        const ay = Math.abs(this.ay) * this.damping

        // 速度衰减
        this.vx > 0 ? this.vx -= ax : null
        this.vx < 0 ? this.vx += ax : null
        this.vy > 0 ? this.vy -= ay : null
        this.vy < 0 ? this.vy += ay : null
    }
}

for (let j = 0; j <= rows; j++)
    for (let k = 0; k <= cols; k++)
        dots.push(new Dot(j, k))

const draw = () => {
    ctx.clearRect(0, 0, _w, _h)
    ctx.strokeStyle = 'green'
    for (let i = 0; i < dots.length; i++) {
        if (i % (cols + 1) == cols) continue
        dots[i].throb()
        ctx.beginPath()
        ctx.moveTo(
            dots[i].x += dots[i].vx,
            dots[i].y += dots[i].vy
        )
        ctx.lineTo(
            dots[i+1].x += dots[i+1].vx,
            dots[i+1].y += dots[i+1].vy
        )
        ctx.stroke()
        if (i + cols + 1 >= dots.length) continue
        ctx.beginPath()
        ctx.moveTo(
            dots[i].x += dots[i].vx,
            dots[i].y += dots[i].vy
        )
        ctx.lineTo(
            dots[i+cols+1].x += dots[i+cols+1].vx,
            dots[i+cols+1].y += dots[i+cols+1].vy
        )
        ctx.stroke()
    }
    requestAnimationFrame(draw)
}

document.addEventListener('mouseup', () => {
    down = false
    towPoint = null
})

canvas.addEventListener('mousedown', e => {
    down = true
    const i = ~~(e.offsetY / space) * (cols + 1) +
    ~~(e.offsetX / space)
    towPoint = dots[i]
    mouse.x = e.offsetX
    mouse.y = e.offsetY
})

canvas.addEventListener('mousemove', e => {
    if (!down) return
    towPoint.x = towPoint.sx + e.offsetX - mouse.x
    towPoint.y = towPoint.sy + e.offsetY - mouse.y
})

draw()




