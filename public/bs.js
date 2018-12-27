const makeGame = async () => {
    const gameData = await axios.get(`game`)
    const game = gameData.data

    letters = [`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`, `V`, `W`, `X`, `Y`, `Z`]
    row_id = x => letters[x].toLowerCase()

    eCreator = (element, id, html, parent) => {
        const e = document.createElement(element)
        e.setAttribute(`id`, id)
        e.innerHTML = html
        parent.appendChild(e)
        return e
    }

    // for grid
    const grid = document.getElementById(`grid`)
    const numberRow = document.getElementById(`nums`)

    // column (numbers) headers
    game.grid.forEach((row, i) => {
        eCreator(`th`, `num-${i}`, i, numberRow)
        if (i === game.grid.length - 1) { eCreator(`th`, `num-${i + 1}`, i + 1, numberRow) }
    })

    game.grid.forEach((row, y) => {
        // grid rows
        const gridRow = eCreator(`tr`, `row-${row_id(y)}`, null, grid)

        // row (letters) headers
        eCreator(`th`, `let-${row_id(y)}`, letters[y], gridRow)

        row.forEach((cell, x) => {
            // grid cells
            const gridCell = eCreator(`td`, `cell-${row_id(y)}-${x + 1}`, (cell.shot ? cell.shot : null), gridRow)
            // place shot
            gridCell.addEventListener(`click`, async () => {
                // turn shots
                if (cell.shot) return
                const gameTurn = await axios.put(`game/`, cell)
                const { game, turn } = gameTurn.data
                if (turn) {
                    gridCell.innerHTML = game.round
                }
                // end of turn
                else {
                    gridCell.innerHTML = game.round - 1
                    game.players.forEach((player, p) => player.boats.forEach((boat, b) => {
                        boatShots = []
                        boat.cells.forEach(boatCell => boatShots.push(boatCell.shot))
                        boatShots.sort()
                        boatShots.forEach((boatShot, c) => document.getElementById(`bc-${p}-${b}-${c}`).innerHTML = boatShot)
                    }))
                }
            })
        })
    })

    // for players
    game.players.forEach((player, p) => {
        // boats element
        const boats = document.getElementById(`boats`)
        // player names
        eCreator(`span`, `pn-${p}`, `${player.name} - ${player.shots}`, boats)
        // boat tables
        const boatTable = eCreator(`table`, `bt-${p}`, null, boats)

        // boat reveal
        for (let i = 0; i < 2; i++) {
            boatTable.addEventListener([`mousedown`, `mouseup`][i], () => {
                // limit to active player
                // if (event.target.id.split(`-`)[1] == game.currentPlayer) {
                player.boats.forEach(boat => boat.cells.forEach(cell => {
                    const boatCell = document.getElementById(`cell-${row_id(cell.x)}-${cell.y + 1}`)
                    i === 0 ? boatCell.classList.add(`boat`) : boatCell.classList.remove(`boat`)
                }))
                // }
            })
        }

        // for player boats
        player.boats.forEach((boat, b) => {
            // boat rows
            const boatRow = eCreator(`tr`, `br-${p}-${b}`, null, boatTable)
            boatShots = []
            boat.cells.forEach(boatCell => boatShots.push(boatCell.shot))
            boatShots.sort()
            boatShots.forEach((boatShot, c) => eCreator(`td`, `bc-${p}-${b}-${c}`, (boatShot != game.round ? boatShot : null ), boatRow))
        })
    })
}

makeGame()