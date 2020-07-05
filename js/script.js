



//--------FACTORYS-------\\
// 1.Player

const Player = (name, symbol, difficulty) => {
    return {name, symbol, difficulty}
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
        if(onePlayer.checked){
            onePlayer.parentNode.classList.remove("not-selected")
            twoPlayer.parentNode.classList.add("not-selected")
            playerTwo.classList.remove("fadeInRightBig")
            playerTwo.classList.add("fadeOutRightBig")
            levelSelect.classList.remove("fadeOutLeftBig")
            levelSelect.classList.add("fadeInLeftBig")

        } else {
            twoPlayer.parentNode.classList.remove("not-selected")
            onePlayer.parentNode.classList.add("not-selected")
            levelSelect.classList.remove("fadeInLeftBig")
            levelSelect.classList.add("animated", "fadeOutLeftBig")
            playerTwo.classList.remove("hidden", "fadeOutRightBig")
            playerTwo.classList.add("fadeInRightBig")
        }
    }))

//LEVEL TOGGLE
    const easy = document.getElementById("easy")
    const normal = document.getElementById("normal")
    const impossible = document.getElementById("impossible")
    const difficulty = [easy, normal, impossible]

    difficulty.forEach(level => level.addEventListener("click", () => {
        for( let i = 0; i < difficulty.length; i++){
            if(difficulty[i].checked){
                difficulty[i].parentNode.classList.remove("not-selected")
            } else {
                difficulty[i].parentNode.classList.add("not-selected")
            }
        } 
    }))

    return 
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
            newGame();
        }
    })

    return 
})();

const gameBoard = (() => {
    const board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    const gameStats = {
        playerTurn: "PLAYER 1", 
        p1Score: 0,
        tieScore: 0, 
        p2Score: 0, 
        squaresFilled: 0, 
        ai: true, 
        level: "normal"
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
        if(string === "PLAYER 2"){
            gameStats.ai = false 
            gameStats.level = "N/A"
        } else {
            gameStats.ai = true
        }
    }

    const level = () => {

    }


    return {render, reset, newGame, rematch}
})();


const gamePlay = (() => {

    

    return {}
})();













 

