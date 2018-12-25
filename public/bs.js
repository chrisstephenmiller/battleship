class Game {
    constructor(size) {
        this.grid = Array(size).fill(null).map((_, x) => Array(size).fill(null).map((_, y) => new Cell(x, y)))
        this.round = 1
        this.currentPlayer = 0
        this.players = [...arguments].slice(1).map(name => new Player(name, this))
        // alert(`${this.players[this.currentPlayer].name}'s turn!`)
    }

    placeShot(cell) {
        return this.players[this.currentPlayer].placeShot(cell)
    }
}

class Player {
    constructor(name, game) {
        this.name = name
        this.boats = [
            new Boat(5),    
            new Boat(3),
            new Boat(2),
            new Boat(2)
        ]
        this.game = game
        this.grid = game.grid
        this.shots = this.boats.reduce((total, boat) => total += Math.min(this.boats.length - 1, boat.cells.length - 1), 0)
    }

    randomCells() {
        const l = this.grid.length
        const x = Math.floor(Math.random() * l)
        const y = Math.floor(Math.random() * l)
        const c = () => Math.floor(Math.random() * 2) === 1
        const n = c()
        const dir = z => z <= l / 2 ? z + 1 : z - 1
        return [this.grid[x][y], this.grid[n && c() ? x : dir(x)][!n && c() ? y : dir(y)]]
    }

    placeShot(cell) {
        if (cell.shot) return true
        cell.placeShot(this.game.round)
        if (this.shots > 1) {
            console.log(this.game)
            this.shots--
            return true
        }
        else {
            game.players.forEach(player => {
                player.shots = 0
                player.boats.forEach(boat => {if (!boat.cells.every(cell => cell.shot)) { player.shots += Math.min(this.boats.length - 1, boat.cells.length - 1) }})
            })
            this.game.round++
            this.game.currentPlayer++
            this.game.currentPlayer %= game.players.length
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

    placeBoats() {
        this.boats.forEach(boat => this.placeBoat(boat, ...this.randomCells()))
    }

}

class Cell {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.shot = null
    }

    placeShot(shot) {
        if (!this.shot) this.shot = shot
    }
}

class Boat {
    constructor(length) {
        this.cells = Array(length).fill(null)
    }
}

const game = new Game(15, `peter`, `chris`, `john`)