class Board {
    constructor(container) {
        this.container = $(container)
        this.build()
        this.canvas = this.container.children('canvas')[0]
        this.question_area = this.container.children('.question')

        this.width = 7
        this.height = 7
        this.margin = 0
        this.root_color = '#DCEBF8'
        this.yes_color = '#A7D6BB'
        this.no_color = '#FA9B9B'
        this.front_color = '#6F7C85'

        this.canvas.width = this.container.width()
        this.canvas.height = this.canvas.width / (16 / 9)
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
        for (var i = 1; i <= this.height + 2 * this.margin; i++) {
            this.drawLine(0, (i - 0.5) * this.cell_height, this.canvas.width, (i - 0.5) * this.cell_height)
        }
        // draw vertical lines
        for (i = 1; i < this.width + 2 * this.margin; i++) {
            this.drawLine(i * this.cell_width, 0, i * this.cell_width, this.canvas.height)
        }
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
        const x = (col + this.margin + 0.5) * this.cell_width
        const y = (row + this.margin + 0.5) * this.cell_height
        this.drawCircle(x, y, this.cell_height / 2, color)
    }
    drawNote(row, col, note) {
        const ctx = this.canvas.getContext("2d")
        const height = this.cell_height * .7
        ctx.font = `${height}px serif`
        ctx.textBaseline = 'middle'
        ctx.fillStyle = this.front_color
        const width = ctx.measureText(note).width
        const x = (col + this.margin + 0.5) * this.cell_width - width / 2
        const y = (row + this.margin + 0.5) * this.cell_height
        ctx.fillText(note, x, y)
    }
    drawRect(x, y, w, h, c) {
        const ctx = this.canvas.getContext("2d")
        ctx.fillStyle = c
        ctx.fillRect(x, y, w, h)
    }
    drawCircle(x, y, r, c) {
        const ctx = this.canvas.getContext("2d")
        ctx.fillStyle = c
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
    }
    showQuestion(text) {
        this.question_area.text(text)
    }
    xyToPosition(x, y) {
        return [
            Math.floor(y / this.cell_height - this.margin),
            Math.floor(x / this.cell_width - this.margin)
        ]
    }
    click(cb_func) {
        $(this.canvas).click(function(event) {
            const rect = this.canvas.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top
            if(x > this.margin * this.cell_width
                && x < (this.width + this.margin) * this.cell_width
                && y > this.margin * this.cell_height
                && y < (this.height + this.margin) * this.cell_height) {
                cb_func(x, y)
            }
        }.bind(this))
    }
    build() {
        this.container.css({
            'width': '100%',
            'max-width': '400px',
            'margin': '0 auto'
        })
      this.container.append($('<canvas></canvas>'))
      this.container.append($('<div class="question"></div>'))
    }
}


class IntervalGame {
    constructor(board) {
        this.board = board
        this.root_note = '1'
        this.root_note_position = [[3, 3], [0, 0], [1, 5], [5, 1], [6, 6]]
        this.notes = ['b3', '4', '5', 'b7']
        this.position = [
            [[2, 1], [3, 6], [5, 4]],  // b3
            [[2, 3], [4, 1], [5, 6]],  // 4
            [[1, 0], [2, 5], [4, 3]],  // 5
            [[1, 3], [3, 1], [4, 6]]  // b7
        ]
        this.state = {
            note: null,
            question: [],
            answer: [],
        }

        const btn_start = $('<button>Start</button>')
        this.board.question_area.append(btn_start)

        this.drawAll()
        btn_start.click(function() {
            this.clear()
            this.board.question_area.empty()
            this.run()
        }.bind(this))
    }
    run() {
        this.board.click(function(x, y) {
            var pos = this.board.xyToPosition(x, y)
            this.click(pos[0], pos[1])
        }.bind(this))
        this.next()
    }
    click(row, col) {
        var note = this.positionToNote(row, col)
        if(note === undefined) {
            this.board.highlight(row, col, this.board.no_color)
            return
        }

        // store answer
        this.state.answer.push([row, col])

        // draw answer
        if(note === this.state.note) {
            if(note === this.root_note) {
                this.board.highlight(row, col, this.board.root_color)
            } else {
                this.board.highlight(row, col, this.board.yes_color)
            }
        } else {
            this.board.highlight(row, col, this.board.no_color)
        }
        this.board.drawNote(row, col, note)

        this.next()
    }
    next() {
        if(!this.state.note) {
            // init game
            this.state.note = this.randomNote()
            this.state.question = this.positionOfNote(this.state.note)
            this.state.answer = []
            this.board.question_area.text('Find out ' + this.state.note + '.')
        }

        // check if answered all
        var correct = 0
        for(var i = 0; i < this.state.answer.length; i++) {
            for(var j = 0; j < this.state.question.length; j++) {
                if(this.state.answer[i][0] === this.state.question[j][0] &&
                    this.state.answer[i][1] === this.state.question[j][1]) {
                    correct++
                }
            }
        }
        if(correct === this.state.question.length) {
            // Correct. Next question.
            this.board.question_area.text('Right!')
            setTimeout(function() {
                this.state.note = null
                this.clear()
                this.next()
            }.bind(this), 500);
        }
    }
    randomNote() {
        return this.notes[Math.floor(Math.random() * this.notes.length)]
    }
    positionOfNote(note) {
        var i = this.notes.indexOf(note)
        if(i === -1) {
            return []
        }
        return this.position[i].slice()
    }
    positionToNote(row, col) {
        for (var i = 0; i < this.position.length; i++) {
            for(var j = 0; j < this.position[i].length; j++) {
                if(row === this.position[i][j][0]
                    && col === this.position[i][j][1]) {
                    return this.notes[i]
                }
            }
        }
    }
    drawAll() {
        this.clear()
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
    clear() {
        this.board.clear()
        // draw root note
        for (var i = 0, len = this.root_note_position.length; i < len; i++) {
            var row = this.root_note_position[i][0], col = this.root_note_position[i][1]
            this.board.highlight(row, col, this.board.root_color)
            this.board.drawNote(row, col, this.root_note)
        }
    }
}


const board = new Board('.interval-train-container')
new IntervalGame(board)
