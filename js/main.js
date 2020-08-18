class Board {
    constructor(container) {
        this.container = $(container)
        this.canvas = this.container.children('canvas')[0]
        this.width = 8
        this.height = 8
        this.margin = 1
        this.root_color = '#DCEBF8'
        this.yes_color = '#A7D6BB'
        this.no_color = '#FA9B9B'
        this.front_color = '#6F7C85'
        //this.front_color = '#DCEBF8'

        this.canvas.height = this.canvas.width = this.container.width()
        this.cell_height = this.canvas.height / (this.height + 2 * this.margin)
        this.cell_width = this.canvas.width / (this.width + 2 * this.margin)
        this.drawBoard()
    }
    clear() {
        const ctx = this.canvas.getContext("2d")
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawBoard()
    }
    drawBoard() {
        // draw horizon lines
        for (var i = 1; i < this.height + 2 * this.margin; i++) {
            this.drawLine(0, i * this.cell_height, this.canvas.width, i * this.cell_height)
        }
        // draw vertical lines
        for (var i = 1; i < this.width + 2 * this.margin; i++) {
            this.drawLine(i * this.cell_width, 0, i * this.cell_width, this.canvas.height)
        }
        this.highlight(4, 4, this.root_color)
        this.drawNote(4, 4, '1')
    }
    drawLine(x1, y1, x2, y2) {
        const ctx = this.canvas.getContext("2d")
        ctx.strokeStyle = this.front_color
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
    }
    highlight(row, col, color) {
        const x = col * this.cell_width
        const y = row * this.cell_height
        this.drawRect(x, y, this.cell_width, this.cell_height, color)
    }
    drawNote(row, col, note) {
        const ctx = this.canvas.getContext("2d")
        const height = this.cell_height * .5
        ctx.font = `${height}px sans-serif`
        ctx.textBaseline = 'top'
        ctx.fillStyle = this.front_color
        const width = ctx.measureText(note).width
        const x = col * this.cell_width + (this.cell_width - width) / 2
        const y = row * this.cell_height + height / 2
        ctx.fillText(note, x, y)
    }
    drawRect(x, y, w, h, c) {
        const ctx = this.canvas.getContext("2d")
        ctx.fillStyle = c
        ctx.fillRect(x, y, w, h)
    }
}

const board = new Board('.container')
