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
    this.rate = .05
    this.damping = .3
}

Dot.prototype = {
    calculate() {
        if (towPoint == this) return
        if (this.row == 0 || this.row == rows) return
        if (this.col == 0 || this.col == cols) return

        let up, down, left, right

        up = dots[(this.row - 1) * (cols + 1) + this.col]
        down = dots[(this.row + 1) * (cols + 1) + this.col]
        left = dots[this.row * (cols + 1) + this.col - 1]
        right = dots[this.row * (cols + 1) + this.col + 1]

        this.ax = (up.x - this.x) + (down.x - this.x) +
            (left.x - this.x) + (right.x - this.x)
        this.ay = (up.y - this.y) + (down.y - this.y) +
            (left.y - this.y) + (right.y - this.y)

        this.vx += this.ax * this.rate
        this.vy += this.ay * this.rate

        // this.vx += (this.sx - this.x) * this.rate
        // this.vy += (this.sy - this.y) * this.rate

        // this.vx > 5 ? this.vx = 5 : null
        // this.vx < -5 ? this.vx = -5 : null
        // this.vy > 5 ? this.vy = 5 : null
        // this.vy < -5 ? this.vy = -5 : null
        this.vx > 0 ? this.vx -= Math.abs(this.ax) * this.rate * this.damping  : null
        this.vx < 0 ? this.vx += Math.abs(this.ax) * this.rate * this.damping  : null
        this.vy > 0 ? this.vy -= Math.abs(this.ay) * this.rate * this.damping  : null
        this.vy < 0 ? this.vy += Math.abs(this.ay) * this.rate * this.damping  : null

        // if (Math.abs(this.vx) < 1) this.vx = 0
        // if (Math.abs(this.vy) < 1) this.vy = 0

    }
}

for (let j = 0; j <= rows; j++)
    for (let k = 0; k <= cols; k++)
        dots.push(new Dot(j, k))

const draw = () => {
    ctx.clearRect(0, 0, _w, _h)
    ctx.strokeStyle = 'green'
    ctx.lineWidth = .8
    for (let i = 0; i < dots.length; i++) {
        if (i % (cols + 1) == cols) continue
        dots[i].calculate()
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




