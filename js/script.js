const easy = document.getElementById("easy")
const normal = document.getElementById("normal")
const impossible = document.getElementById("impossible")
const difficulty = [easy, normal, impossible]


//--------FACTORYS-------\\
// 1.Player
// 2.Get Players

const Player = (name, symbol) => {
    return {name, symbol}
}

const getPlayers = () => {
    let p1Name = document.getElementById('playerOneText').value !== "" ? document.getElementById('playerOneText').value : "PLAYER 1"
    let p2Name;
    let player1 = Player(p1Name, "X")
    if (gameBoard.getStats("ai") === false){
        p2Name = document.getElementById('playerTwoText').value !== "" ? document.getElementById('playerTwoText').value : "PLAYER 2"
    } else {
        p2Name = "AI"
    }
    let player2 = Player(p2Name, "O")
    gameBoard.displayNames({player1, player2});
    return {player1, player2}
}


//-------MODULE-------\\
// 1. Start Board (Mode/Level Select)
// 2. Page Toggle 
// 3. Game Board 

const startBoard = (() => {

// PLAYER MODE TOGGLE
    const onePlayer = document.getElementById("one-player")
    const twoPlayer = document.getElementById("two-player")
    const playerMode = [onePlayer, twoPlayer]

    const levelSelect = document.getElementById("level-select")
    const playerTwo = document.getElementById("player-two")

    playerMode.forEach(node => node.addEventListener("click", () => {
        let modeSelected;
        if(onePlayer.checked){
            onePlayer.parentNode.classList.remove("not-selected")
            twoPlayer.parentNode.classList.add("not-selected")
            playerTwo.classList.remove("fadeInRightBig")
            playerTwo.classList.add("fadeOutRightBig")
            levelSelect.classList.remove("fadeOutLeftBig")
            levelSelect.classList.add("fadeInLeftBig")
            modeSelected = "ONE PLAYER"
        } else {
            twoPlayer.parentNode.classList.remove("not-selected")
            onePlayer.parentNode.classList.add("not-selected")
            levelSelect.classList.remove("fadeInLeftBig")
            levelSelect.classList.add("animated", "fadeOutLeftBig")
            playerTwo.classList.remove("hidden", "fadeOutRightBig")
            playerTwo.classList.add("fadeInRightBig")
            modeSelected = "TWO PLAYER"
        }
        gameBoard.mode(modeSelected)
    }))

//LEVEL TOGGLE
    
    
    const levelChecked = arr => {
        let level; 
        for(let i = 0; i < arr.length; i++){
            if(arr[i].checked){
                arr[i].parentNode.classList.remove("not-selected")
                level = (arr[i].parentNode.textContent)
            } else {
                arr[i].parentNode.classList.add("not-selected")
            }
        } 
        return level 
    }

    difficulty.forEach(level => level.addEventListener("click", () => {
        gameBoard.level(levelChecked(difficulty))
    }));

    return {levelChecked}
})();

const pageToggle = (() => {

    //SWITCH BETWEEN MAIN MENU AND GAME SCREENS
    const gameForm = document.getElementById("game-form")
    const startBoard = document.getElementById("start-board")
    const gameBoard = document.getElementById("game-board")
    const titleO = document.getElementById("titleO")
    const backButton = document.getElementById("back-button")

    gameForm.addEventListener("submit", e => {
        e.preventDefault()
        gameBoard.classList.remove("rotateOutDownLeft")
        startBoard.classList.remove("rotateInDownLeft")
        startBoard.classList.add("animated", "rotateOutUpLeft")
        setTimeout( () => {startBoard.classList.add("d-none")}, 500)
        setTimeout( () => {
            gameBoard.classList.remove("d-none")
            gameBoard.classList.add("animated", "rotateInUpLeft")
        }
        , 500)
        titleO.classList.remove("flash")
        backButton.classList.remove("fadeOut", "rotateOut")
        backButton.classList.remove("hidden")
        backButton.classList.add("animated", "slower", "fadeIn", "rotateIn")
        getPlayers();
        gamePlay.startGame()
        
    })
    
    backButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to leave this page? All scores will be reset!")){
            backButton.classList.remove("fadeIn", "rotateIn")
            backButton.classList.add("fadeOut", "rotateOut")
            setTimeout( () => {backButton.classList.add("hidden")}, 500)
            gameBoard.classList.remove("rotateInUpLeft")
            gameBoard.classList.add("rotateOutDownLeft")
            setTimeout( () => {gameBoard.classList.add("d-none")}, 500)
            startBoard.classList.remove("rotateOutUpLeft")
            setTimeout( () => {
            startBoard.classList.remove("rotateOutUpLeft", "d-none")
            startBoard.classList.add("rotateInDownLeft")
            }
            , 500)
            titleO.classList.add("flash")
            gameBoard.newGame
        }
    })

    return 
})();

const gameBoard = (() => {
    
    const gameStats = {
        board: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        playerTurn: "PLAYER 1", 
        p1Score: 0,
        tieScore: 0, 
        p2Score: 0, 
        squaresFilled: 0, 
        ai: true, 
        level: "NORMAL"
    }

    const board = gameStats.board

    const getStats = stat => {
        return gameStats[stat]
    }

    const render = () => {
        for(let i = 0; i < board.length; i++){
            let square = document.querySelector(`[data-position="${i}"]`);
            if(board[i] === "X" || board[i] === "O"){
                square.innerHTML = board[i]
            } else {
                square.innerHTML = ""
            }
        }
    }

    const reset = () => {
        for(let i = 0; i < board.length; i++){
            board[i] = i; 
        }
        render()
        gameStats.squaresFilled = 0;
    }

    const newGame = () => {
        gameStats.playerTurn = "PLAYER 1"
        gameStats.p1Score = 0;
        gameStats.p2Score = 0;
        gameStats.tieScore = 0;
        reset(); 
    }

    const rematch = () => gameStats.playerTurn === "PLAYER 1" ? gameStats.playerTurn = "PLAYER 2" : gameStats.playerTurn = "PLAYER 1"
    
    const mode = string => {
        if(string === "TWO PLAYER"){
            gameStats.ai = false 
            gameStats.level = "N/A"
        } else if(string === "ONE PLAYER"){
            gameStats.ai = true
            gameStats.level = level(startBoard.levelChecked(difficulty))
        }
    }

    const level = string => {
        gameStats.level = string.replace(/\s/g, "") 
    }

    const displayNames = ({player1, player2}) => {
        const p1 = document.getElementById("player-one-name")
        const p2 = document.getElementById("other-player-name")
        p1.textContent = player1.name.toUpperCase()
        p2.textContent = player2.name.toUpperCase()
    };

    const displayScores = () => {
        const p1Count = document.getElementById("player-one-score")
        const tieCount = document.getElementById("tie-count")
        const p2Count = document.getElementById("player-two-score")

        p1Count.textContent = gameStats.p1Score 
        tieCount.textContent = gameStats.tieScore 
        p2Count.textContent = gameStats.p2Score 
    }


    return {getStats, render, reset, newGame, rematch, mode, level, displayNames, displayScores}
})();


const gamePlay = (() => {
    const board = gameBoard.getStats("board")
    
    const winLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
    ];

    const addSquareEventListeners = () => {
        for(let i = 0; i < board.length; i++){
            let square = document.querySelector(`[data-position="${i}"]`);
            square.addEventListener("click", takeTurn)
        };
    }

    const removeSquareEventListeners = () => {
        for(let i = 0; i < board.length; i++){
            let square = document.querySelector(`[data-position="${i}"]`);
            square.removeEventListener("click", takeTurn)
        };
    }

    const { player1, player2 } = getPlayers();

    
    let playerTurn = gameBoard.getStats("playerTurn")
    let onePlayerMode = gameBoard.getStats("ai")
    
    
    
    console.log(gameBoard.getStats("board"))
    console.log(gameBoard.getStats.board)


    const takeTurn = e => { 
        let location = e.target.getAttribute('data-position')
        
        if(board[location] !== "X" && board[location] !== "O"){
            
            console.log(board[e.target.getAttribute('data-position') ])

            if(gameBoard.getStats("playerTurn") === "PLAYER 1"){
                board[e.target.getAttribute('data-position')] = player1.symbol
                console.log(board)
                console.log(gameBoard.getStats("board"))
            }
        }

    }

    const startGame = () => {
        addSquareEventListeners();
    }

    

    return {startGame}
})();













 

