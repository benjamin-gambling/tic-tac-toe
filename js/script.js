const easy = document.getElementById("easy")
const normal = document.getElementById("normal")
const impossible = document.getElementById("impossible")
const difficulty = [easy, normal, impossible]


//--------FACTORYS-------\\
// 1.Player

const Player = (name, symbol) => {
    return {name, symbol}
}



//-------MODULE-------\\
// 1. Start Board (Mode/Level Select)
// 2. Page Toggle 
// 3. Game Board
// 4. Game Play  

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
    const gameGrid = document.getElementById("game-board")
    const titleO = document.getElementById("titleO")
    const backButton = document.getElementById("back-button")
    const rematch = document.getElementById("rematch")

    gameForm.addEventListener("submit", e => {
        e.preventDefault()
        gameGrid.classList.remove("rotateOutDownLeft")
        startBoard.classList.remove("rotateInDownLeft")
        startBoard.classList.add("animated", "rotateOutUpLeft")
        setTimeout( () => {startBoard.classList.add("d-none")}, 500)
        setTimeout( () => {
            gameGrid.classList.remove("d-none")
            gameGrid.classList.add("animated", "rotateInUpLeft")
        }
        , 500)
        titleO.classList.remove("flash")
        backButton.classList.remove("fadeOut", "rotateOut")
        backButton.classList.remove("hidden")
        backButton.classList.add("animated", "slower", "fadeIn", "rotateIn")
        gameBoard.getPlayers();
        gamePlay.startGame()
        
    })
    
    backButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to leave this page? All scores will be reset!")){
            backButton.classList.remove("fadeIn", "rotateIn")
            backButton.classList.add("fadeOut", "rotateOut")
            setTimeout( () => {backButton.classList.add("hidden")}, 500)
            gameGrid.classList.remove("rotateInUpLeft")
            gameGrid.classList.add("rotateOutDownLeft")
            setTimeout( () => {gameGrid.classList.add("d-none")}, 500)
            startBoard.classList.remove("rotateOutUpLeft")
            setTimeout( () => {
            startBoard.classList.remove("rotateOutUpLeft", "d-none")
            startBoard.classList.add("rotateInDownLeft")
            }
            , 500)
            titleO.classList.add("flash")
            removeClasses()
            gameBoard.newGame()
            rematch.classList.remove("flipInY")
            rematch.classList.add("flipOutY")
            setTimeout(rematch.classList.add("hidden"), 200)
        }
    })

    rematch.addEventListener("click", () => {
        gameBoard.replay()
        removeClasses()
        gameBoard.reset()
        gamePlay.startGame()
        rematch.classList.remove("flipInY")
        rematch.classList.add("flipOutY")
        setTimeout(rematch.classList.add("hidden"), 200)

    })

    const removeClasses = () => {
        for(let i = 0; i < 9; i++){
            let square = document.querySelector(`[data-position="${i}"]`);
            if(square.textContent === "X" || square.textContent === "O"){
                square.classList.remove("noughts-end", "crosses-end")
                square.removeAttribute('id');
            }
        }
    }

    return 
})();

const gameBoard = (() => {
    
    const gameStats = {
        board: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        firstMove: "PLAYER 1",
        playerTurn: "PLAYER 1",
        player1: {},
        p1Score: 0,
        tieScore: 0,
        player2: {}, 
        p2Score: 0, 
        squaresFilled: 0, 
        ai: true, 
        level: "NORMAL"
    }

    const board = gameStats.board

    const getStats = stat => {
        return gameStats[stat]
    }

    const updateStats = stat => {
        gameStats[stat]++
    }

    const render = () => {
        for(let i = 0; i < board.length; i++){
            let square = document.querySelector(`[data-position="${i}"]`);
            if(board[i] === "X" || board[i] === "O"){
                square.innerHTML = board[i]
                board[i] === "X" ? square.id = "crosses" : square.id = "noughts"
            } else {
                square.innerHTML = ""
                square.id = ""
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
        gameStats.firstMove = "PLAYER 1"
        gameStats.p1Score = 0;
        gameStats.p2Score = 0;
        gameStats.tieScore = 0;
        gameBoard.displayScores()
        gamePlay.startGame()
        reset(); 
        
    }
    const updatePlayerTurn = () => gameStats.playerTurn === "PLAYER 1" ? gameStats.playerTurn = "PLAYER 2" : gameStats.playerTurn = "PLAYER 1"
    
    const replay = () => {
        if(gameStats.firstMove === "PLAYER 1"){
            gameStats.firstMove = "PLAYER 2"
            gameStats.playerTurn = "PLAYER 2"
        } else {
            gameStats.firstMove = "PLAYER 1"
            gameStats.playerTurn = "PLAYER 1"
        }
    }
    
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

    const getPlayers = () => {
        let p1Name = document.getElementById('playerOneText').value !== "" ? document.getElementById('playerOneText').value : "PLAYER 1"
        let p2Name;
        gameStats.player1 = Player(p1Name.toUpperCase(), "X")
        if (gameStats.ai){
            p2Name = "AI"           
        } else {
            p2Name = document.getElementById('playerTwoText').value !== "" ? document.getElementById('playerTwoText').value : "PLAYER 2"   
        }
        gameStats.player2 = Player(p2Name.toUpperCase(), "O")
        const p1 = gameStats.player1
        const p2 = gameStats.player2
        displayNames(p1, p2);
        gamePlay.transferPlayers({p1, p2})
        return gameStats.player1, gameStats.player2
    }

    const displayNames = (player1, player2) => {
        const p1 = document.getElementById("player-one-name")
        const p2 = document.getElementById("other-player-name")
        p1.textContent = player1.name.toUpperCase()
        p2.textContent = player2.name.toUpperCase()
    };

    const displayScores = () => {
        const p1Count = document.getElementById("player-one-score")
        const tieCount = document.getElementById("tie-count")
        const p2Count = document.getElementById("other-player-score")

        p1Count.textContent = gameStats.p1Score 
        tieCount.textContent = gameStats.tieScore 
        p2Count.textContent = gameStats.p2Score 
    }


    return {
        getStats, 
        updateStats,
        render, 
        reset, 
        newGame, 
        updatePlayerTurn, 
        replay, 
        mode,
        getPlayers, 
        level, 
        displayNames, 
        displayScores
    }
})();


const gamePlay = (() => {

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

    const annouceResult = document.getElementById("game-name")
    const board = gameBoard.getStats("board")

    //EVENT LISTENERS TO ALLOW PLACEMENT 

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

    //GAME FUCNTIONALITY
    
    let { player1, player2 } = {}

    const transferPlayers = ({p1, p2}) => {
        player1 = p1
        player2 = p2
    }


    const startGame = () => {
        annouceResult.classList.remove("noughts-win", "crosses-win", "flip",)
        annouceResult.classList.add("flip",)
        annouceResult.textContent = "TIC " + "\xa0\xa0" + " TAC " + "\xa0\xa0" +  "TOE"
        addSquareEventListeners();
        if(gameBoard.getStats("firstMove") === "PLAYER 2" && gameBoard.getStats("ai") && gameBoard.getStats("squaresFilled") === 0){
            aiTurn()
        }
    }

    const takeTurn = e => { 
        let location = e.target.getAttribute('data-position')
        let aiStatus = gameBoard.getStats("ai")
        let winner
        
        if(board[location] !== "X" && board[location] !== "O"){
            if(gameBoard.getStats("playerTurn") === "PLAYER 1"){
                board[e.target.getAttribute('data-position')] = player1.symbol
                gameBoard.updateStats("squaresFilled")
                winner = checkWin(player1.symbol)
                if(winner === null){
                    gameBoard.updatePlayerTurn();
                }
            } else if(gameBoard.getStats("playerTurn") === "PLAYER 2" && aiStatus === false){
                board[e.target.getAttribute('data-position')] = player2.symbol
                gameBoard.updateStats("squaresFilled")
                winner = checkWin(player2.symbol)  
                if(winner === null){
                    gameBoard.updatePlayerTurn();
                }     
            }
            
            if(gameBoard.getStats("playerTurn") === "PLAYER 2" && aiStatus && winner === null){
                aiTurn() 
                            
            }
            gameBoard.render()
        }    
    }

    const aiTurn = () => {
        removeSquareEventListeners()
        const level = gameBoard.getStats("level")
        let aiIndex; //Index of AI move
        let emptySpaces = emptySpots(board)

        // 1.Find Empty Squares using Filter (EASY MODE)
        if(level === "EASY"){
            
            aiIndex = emptySpaces[Math.floor(Math.random() * emptySpaces.length)]
        
        // 2. (NORMAL MODE) 
        } else if(level === "NORMAL"){
            if(gameBoard.getStats("squaresFilled") < 2 || gameBoard.getStats("squaresFilled") >7){
                aiIndex = minimax(board, player2.symbol).index 
            } else {
                let winningSpots = winLines.map(squares => squares.map(i => board[i]))
                for(let i = 0; i < winningSpots.length; i++){
                    let X = 0
                    let O = 0
                    for(let j = 0; j < winningSpots[i].length; j++ ){
                        if(winningSpots[i][j] === player1.symbol){
                            X++
                        } else if(winningSpots[i][j] === player2.symbol){
                            O++
                        }
                    }
                    if((O === 2 && X === 0) || (X === 2 && O === 0)){
                        aiIndex = minimax(board, player2.symbol).index 
                    } else {
                        let easy = emptySpaces[Math.floor(Math.random() * emptySpaces.length)]
                        let hard = minimax(board, player2.symbol).index 
                        let levelArr = [easy, hard]
                        aiIndex = levelArr[Math.floor(Math.random() * levelArr.length)]
                    }
                }
            }
        // 3. Find best possible loaction using MiniMax Algorithem (IMPOSSIBLE MODE)
        } else if(level === "IMPOSSIBLE"){
            aiIndex = minimax(board, player2.symbol).index   
        }
             

        setTimeout(() => {
            board[aiIndex] = player2.symbol
            gameBoard.updateStats("squaresFilled")
            gameBoard.render() 
            winner = checkWin(player2.symbol) 
                if(winner === null){
                    gameBoard.updatePlayerTurn();
                    addSquareEventListeners(); 
                } 
        }, 1200)        
    }

    //Find empty spots by filtering out Xs & Os
    const emptySpots = board => {
        return  board.filter(square => square != "X" && square != "O");
    };


    const winning = (board, player) => {
        if (
            (board[0] == player && board[1] == player && board[2] == player) ||
            (board[3] == player && board[4] == player && board[5] == player) ||
            (board[6] == player && board[7] == player && board[8] == player) ||
            (board[0] == player && board[3] == player && board[6] == player) ||
            (board[1] == player && board[4] == player && board[7] == player) ||
            (board[2] == player && board[5] == player && board[8] == player) ||
            (board[0] == player && board[4] == player && board[8] == player) ||
            (board[2] == player && board[4] == player && board[6] == player)
          ) {
            return true;
          } else {
            return false;
          }
    }

    const minimax = (newBoard, player) => {
        let human = "X"
        let ai = "O"
        let empty = emptySpots(newBoard)

        // Checks for the terminal states such as W, L, and D and returning a value accordingly
        if (winning(newBoard, human)){
            return { score: -10 };
        } else if (winning(newBoard, ai)){
            return { score: 10 };
        } else if (empty.length === 0){
            return { score: 0} ;
        }

        let moves = []; // An array to collect all the objects

        // Loop through available spots
        for(let i = 0; i < empty.length; i++){
            let  move = {}; //create an object for each and store the index of that spot that was stored as a number in the object's index key
            move.index = newBoard[empty[i]];
            newBoard[empty[i]] = player; // set the empty spot to the current player
            
            //if collect the score resulted from calling minimax on the opponent of the current player
            if (player === ai){
                let result = minimax(newBoard, human);
                move.score = result.score;
            } else {
                let result = minimax(newBoard, ai);
                move.score = result.score;
            }

        newBoard[empty[i]] = move.index; //reset the spot to empty
        moves.push(move); // push the object to the array
        }
        
        // if it is the computer's turn loop over the moves and choose the move with the highest score
        let bestMove;
        if(player === ai) {
            let bestScore = -10000;
            for(let i = 0; i < moves.length; i++){
                if(moves[i].score > bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        // else loop over the moves and choose the move with the lowest score
        } else {
            let bestScore = 10000;
            for(let i = 0; i < moves.length; i++){
                if(moves[i].score < bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        // return the chosen move (object) from the array to the higher depth
        return moves[bestMove];
    }

    const checkWin = symbol => {
        let winner = null
        let currentLine = []
        if(winning(board, symbol)){
            winner = gameBoard.getStats("playerTurn") 
            winLines.forEach(arr => {
                let count = 0
                arr.forEach(prop =>{
                    if(board[prop] === symbol){
                        count++
                        if(count === 3){
                            currentLine = arr
                        }
                    }
                })
            })
            winner === "PLAYER 1" ? gameBoard.updateStats("p1Score") : gameBoard.updateStats("p2Score")
            removeSquareEventListeners()
            endGame(winner, currentLine)
        } else if(gameBoard.getStats("squaresFilled") === 9 && winner === null){
            gameBoard.updateStats("tieScore")
            winner = "DRAW"
            endGame(winner, currentLine)
        }
        return winner   
    }

    const endGame = (winner, currentLine) => {
        annouceResult.classList.remove("flip",)
        setTimeout( () => {
            annouceResult.classList.add("animated", "flip")
            setTimeout(gameBoard.displayScores(), 500)
            for(let i = 0; i < board.length; i++){
            let square = document.querySelector(`[data-position="${i}"]`);
                if(currentLine.includes(i) === false){
                    if(square.id == "crosses"){
                    square.classList.add("crosses-end")   
                    } else if(square.id == "noughts"){
                    square.classList.add("noughts-end")
                    } 
                }
            }
            if(winner === "PLAYER 1"){
                annouceResult.textContent = player1.name + "\xa0\xa0" + "  WINS!" 
                annouceResult.classList.add("crosses-win")
                document.getElementById("player-one-div").classList.add("animated", "flash")
            } else if(winner === "PLAYER 2"){
                annouceResult.textContent = player2.name + "\xa0\xa0" + " WINS!"
                annouceResult.classList.add("noughts-win")
                document.getElementById("other-player-div").classList.add("animated", "flash")
            } else {
                annouceResult.textContent = "ITS " + "\xa0\xa0" + "A" + "\xa0\xa0" + " DRAW"
                document.getElementById("tie-div").classList.add("animated", "flash")
            }
            setTimeout( () => {
                document.getElementById("rematch").classList.remove("flipOutY", "hidden")
                document.getElementById("rematch").classList.add("flipInY")
                
            }, 500)  
        }, 500)
    }   

 
    
    

    return {
        transferPlayers, 
        startGame
    }

})();




    













 

