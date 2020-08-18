class Board {
    constructor(container) {
        this.container = $(container)
        this.canvas = this.container.children('canvas')[0]
        this.width = 7
        this.height = 7
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
        // draw root note
        this.highlight(3, 3, this.root_color)
        this.drawNote(3, 3, '1')
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
        const x = (col + this.margin) * this.cell_width
        const y = (row + this.margin) * this.cell_height
        this.drawRect(x, y, this.cell_width, this.cell_height, color)
    }
    drawNote(row, col, note) {
        const ctx = this.canvas.getContext("2d")
        const height = this.cell_height * .5
        ctx.font = `${height}px sans-serif`
        ctx.textBaseline = 'top'
        ctx.fillStyle = this.front_color
        const width = ctx.measureText(note).width
        const x = (col + this.margin) * this.cell_width + (this.cell_width - width) / 2
        const y = (row + this.margin) * this.cell_height + height / 2
        ctx.fillText(note, x, y)
    }
    drawRect(x, y, w, h, c) {
        const ctx = this.canvas.getContext("2d")
        ctx.fillStyle = c
        ctx.fillRect(x, y, w, h)
    }
}


class IntervalGame {
    constructor(board) {
        this.board = board
        this.notes = ['1', 'b3', '4', '5', 'b7']
        this.position = [
            [[0, 0], [1, 5], [5, 1], [6, 6]],  // 1
            [[2, 1], [3, 6], [5, 4]],  // b3
            [[2, 3], [4, 1], [5, 6]],  // 4
            [[1, 0], [2, 5], [4, 3]],  // 5
            [[1, 3], [3, 1], [4, 6]]  // b7
        ]
    }
    drawAll() {
        this.board.clear()
        for (var i in this.notes) {
            var n = this.notes[i]
            for (var j in this.position[i]) {
                var pos = this.position[i][j]
                if (n === '1') {
                    this.board.highlight(pos[0], pos[1], this.board.root_color)
                }
                this.board.drawNote(pos[0], pos[1], n)
            }
        }
    }
}


const board = new Board('.container')
const game = new IntervalGame(board)
game.drawAll()
