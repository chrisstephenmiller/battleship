class Game {
    constructor(size) {
        this.grid = Array(size).fill(null).map((_, x) => Array(size).fill(null).map((_, y) => new Cell(x, y)))
        this.players = [...arguments].slice(1).map(name => new Player(name))
        this.currentPlayer = 0
        this.round = 1
    }

    placeShot(cell) {
        if (!cell.x) return
        const gridCell = this.grid[cell.x][cell.y]
        if (gridCell.shot) return true
        else {
            gridCell.shot = this.round
            this.players.forEach(player => player.boats.forEach(boat => boat.cells.forEach(boatCell => boatCell.x == cell.x && boatCell.y == cell.y && (boatCell.shot = gridCell.shot))))
        }

        const currentPlayer = this.players[this.currentPlayer]
        if (currentPlayer.shots > 1) {
            currentPlayer.shots--
            return true
        }
        else {
            this.players.forEach(player => {
                player.shots = 0
                player.boats.forEach(boat => !boat.cells.every(cell => cell.shot) && (player.shots += Math.min(player.boats.length - 1, boat.cells.length - 1)))
            })
            this.round++
            this.currentPlayer++
            this.currentPlayer %= this.players.length
            return false
        }
    }

    placeBoat(boat, cellA, cellB) {
        const ints = (x, y) => {
            const ints = []
            for (let i = 0; i < boat.cells.length; i++) { ints.push(x === y ? x : x > y ? x - i : x + i) }
            return ints
        }
        const intsX = ints(cellA.x, cellB.x)
        const intsY = ints(cellA.y, cellB.y)
        for (let i = 0; i < boat.cells.length; i++) { boat.cells[i] = this.grid[intsX[i]][intsY[i]] }
    }

    placeRandomBoats(player) {
        player.boats.forEach(boat => {
            const l = this.grid.length
            const x = Math.floor(Math.random() * l)
            const y = Math.floor(Math.random() * l)
            const c = () => Math.floor(Math.random() * 2) === 1
            const n = c()
            const dir = z => z <= l / 2 ? z + 1 : z - 1
            this.placeBoat(boat, this.grid[x][y], this.grid[n && c() ? x : dir(x)][!n && c() ? y : dir(y)])
        })
    }
}

class Player {
    constructor(name) {
        this.name = name
        this.boats = [
            new Boat(5),
            new Boat(3),
            new Boat(2),
            new Boat(2)
        ]
        this.shots = this.boats.reduce((total, boat) => total += Math.min(this.boats.length - 1, boat.cells.length - 1), 0)
        this.ids = []
    }
}

class Cell {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.shot = null
    }
}

class Boat {
    constructor(length) {
        this.cells = Array(length).fill(null)
    }
}

module.exports = Game