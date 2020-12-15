//variable declerations
let seconds;
let minutes;
let matches;
let moves;
const timerText = document.getElementById('seconds_counter');
const setMoves = document.getElementById("moves_made");
const starsScore = document.getElementById("stars_score");
const deckWindow = document.getElementById("deck");
let timer;

//Array of available cards
var cards = ['ditsa1','ditsa1',
             'guni1','guni1',
             'haruv1','haruv1',
             'liz1','liz1',
             'mike1','mike1',
             'ofer1','ofer1',
             'rave1','rave1',
             'ziv1','ziv1'];

//Generates an HTML of a card
function generateCard(card){
  return `<li class="card" data-card="${card}"><img src="./img/${card}.jpg" class="container"></img></li>`;
}

//Sets a START GAME button
var startButton = document.getElementById('start_button');

//Initialize game after clicking button
startButton.addEventListener("mouseup", function(){
  initGame();
  //RESTART BUTTON - MIDGAME
  const resGame = document.querySelector(".restart_game");
  resGame.addEventListener("click", function(e){
    deckWindow.classList.remove("game_over");
    clearInterval(timer);
    timerText.innerHTML = "00:00";
    setMoves.innerText = "0 Moves";
    starsScore.innerText = "★★★";
    initGame();
  });
});

//Main function
function initGame(){
  seconds=0;
  minutes=0;
  matches=0;
  moves=0;
  timer = setInterval(stopWatch, 1000); //timer variable
  shuffle(cards); //shuffles the deck

  // turns cards array into HTML
  var cardHTML = cards.map(function(card){
    return generateCard(card);
  });
  //adds the generated HTML to the HTML file
  var deck = document.getElementById("deck");
  deck.innerHTML = cardHTML.join('');

  //Event listener for clicking the cards
  var allCards = document.querySelectorAll(".card"); //Get all cards
  var flippedCards = []; //array of flipped cards

  //main clicking function
  allCards.forEach(function(card){
    card.addEventListener("click", function(e){
      //We can flip card only if 2 arent showing
      //or if it isn't matched
      if(
        flippedCards.length<2 && 
        !card.classList.contains("card_show") && 
        !card.classList.contains("card_match")&& 
        !card.classList.contains("card_flip")
        ){
        card.classList.add("card_show");
        setTimeout(()=>{card.classList.add("card_flip")},150);
        
        flippedCards.push(card);

        //Moves counter
        if(flippedCards.length==2){
          moves += 1;
          setMoves.innerText = moves+ ` Moves`;
        }

        //Stars counter
        if(moves>13){
          starsScore.innerText = "★★";
        }
        if(moves>18){
          starsScore.innerText = "★";
        }
        if(moves>25){
          starsScore.innerText = "😟";
        }

        //if two cards are already showing
        if(flippedCards.length===2){
          var firstCardType = flippedCards[0].dataset.card;
          var secondCardType = flippedCards[1].dataset.card;

          //do the cards match? - keep them up
          if(firstCardType === secondCardType){
            matches++;
            flippedCards[0].classList.replace("card_show","card_match");
            flippedCards[1].classList.replace("card_show","card_match");

            setTimeout(function(){
              flippedCards[0].classList.add("bounce");
              flippedCards[1].classList.add("bounce");
              flippedCards = []}, 10);
            }
          //if cards don't match - flip them over
          else{
            setTimeout(function(){
              flippedCards.forEach(function(card){
                card.classList.remove("card_show", "card_flip");
              })
              flippedCards = [];
            }, 500);
          }
          //GAME FINISHED
          if(matches===8){
            //Getting results information
            let timeElapsed = document.getElementById("seconds_counter").textContent;
            let starsReceived = document.getElementById("stars_score").textContent;
            let movesMade = document.getElementById("moves_made").textContent;

            //Stops timer
            clearInterval(timer);

            //Message displayed with game statistics
            setTimeout(function(){
              const endModal = document.createElement("H2");
              endModal.classList.add("end_window");

              //Adding text to the ending window
              endModal.innerHTML = "Congratulations! <br/> You've won!!.. <br/> Well, kinda.. <br/><br/> Here are your game results: <br/>"+timeElapsed + "<br/>" + starsReceived + "<br/>" + movesMade;
              endModal.innerHTML += "<br/><br/> Do you want to play again?";
              endModal.innerHTML += `<li><img src="img/restart.png" id="restart"></img></li>`
              deckWindow.appendChild(endModal);

              //Setting the restart button at the end of the game
              var restartButton = document.getElementById("restart");
              restartButton.addEventListener("click",function(e){
                timerText.innerHTML = "00:00";
                setMoves.innerText = "0 Moves";
                starsScore.innerText = "★★★";
                initGame();
              });
            },1000);
          }
        }
      }
    });
  });
}



// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//SECONDS COUNTER
function stopWatch(){
  seconds += 1;
  if(seconds===60){
    seconds = 0;
    minutes++;
  }
  if(seconds<10){
    var secHTML = `:0${seconds}`;
  }
  else{
    var secHTML = `:${seconds}`;
  }
  if(minutes<10){
    var minHTML = `0${minutes}`;
  }
  else{
    var minHTML = `${minutes}`;
  }
  timerText.innerHTML = minHTML+secHTML;
}
