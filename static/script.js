
function question_age(){
      var age = prompt('Which year you were born ?');
      var age_day = (2021-age)*365;
      var h2 =document.createElement('h2');
      var text_age =document.createTextNode("You are '"+age_day+"' days old.");
      h2.setAttribute('id','age_day');
      h2.appendChild(text_age);
      document.getElementById('result').appendChild(h2);
}
// you cannot append child in addEventListener

function removal(){
      document.getElementById('age_day').remove();
}

// ------------------------blackjack-------------------------------------------------------------------------------------------
let blackjackgame = {
    'you': {'div':'#your-box', 'scoreSpan':'#your-blackjack-result','score': 0 },
    'dealer': {'div':'#dealer-box', 'scoreSpan':'#dealer-blackjack-result','score': 0 },
    'cards' : ['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
    'cardscore': {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':10,'Q':10,'K':10,'A':[1,11]},
    'wins' : 0,
    'losses' : 0,
    'draws' : 0,
    'isstand': false,
    'isstandonce': false,
    'turnover': false,
};

const YOU = blackjackgame['you']
const DEALER = blackjackgame['dealer']
const hitsound = new Audio('static/sounds/swish.m4a')
const winsound = new Audio('static/sounds/cash.mp3')
const losssound = new Audio('static/sounds/aww.mp3')

document.querySelector('#black-hit-btn').addEventListener('click',blackjackhit);
document.querySelector('#black-deal-btn').addEventListener('click',blackjackdeal);
document.querySelector('#black-stand-btn').addEventListener('click',blackjackstand);


function blackjackhit(){
      if(blackjackgame['isstand'] === false){
      let card = randomcard();
      showcard(card,YOU);
      updatescore(card,YOU);
      showscore(YOU);
}  
}      

function sleep(ms){
      return new Promise(resolve => setTimeout(resolve,ms));
}
async function blackjackstand(){
      blackjackgame['isstand'] = true;   
            while(DEALER['score'] < 16 && blackjackgame['isstand'] === true){
            let card = randomcard();
            showcard(card,DEALER);
            updatescore(card,DEALER);
            showscore(DEALER);
            await sleep(1000);
      }
      blackjackgame['turnover'] = true;
      showresult(computewinner());
   
}  


function blackjackdeal(){
     if(blackjackgame['turnover'] === true) {
        blackjackgame['isstand'] = false;
        
        cardremove(DEALER);
        cardremove(YOU);
        
        YOU['score'] = 0;
        DEALER['score'] = 0;
        
        document.querySelector(YOU['scoreSpan']).style.color = 'white';
        document.querySelector(DEALER['scoreSpan']).style.color = 'white';
        
        document.querySelector(YOU['scoreSpan']).textContent = '0';
        document.querySelector(DEALER['scoreSpan']).textContent = '0';
        
        document.querySelector('#blackjack-result').textContent = "Let's Play" ;
        document.querySelector('#blackjack-result').style.backgroundColor = 'rgb(106, 13, 192)';
        
        blackjackgame['turnover'] = false;
        
     }

}


//  util funcs---------------------------------------------------

function randomcard(){
    let randomindex = Math.floor(Math.random()*13);
    return blackjackgame['cards'][randomindex];
}




function cardremove(activeplayer){
      let imgs = document.querySelector(activeplayer['div']).querySelectorAll('img');
      // for(let i = 0 ; i < imgs.length ; i++){
      //       imgs[i].remove();
      // } 
      for (const i of imgs) {
            i.remove();
      }
     

}

function showcard(card,activeplayer){
           if(activeplayer['score']<=21){
            let cardImage = document.createElement('img');
            cardImage.src = `static/images/${card}.png`;
            document.querySelector(activeplayer['div']).appendChild(cardImage);
            hitsound.play();
           }
}

function updatescore(card,activeplayer){

      if (card === 'A'){
            if(activeplayer['score'] += blackjackgame['cardscore'][card][1] <= 21){
                  activeplayer['score'] += blackjackgame['cardscore'][card][1];
            }
            else {
                  activeplayer['score'] += blackjackgame['cardscore'][card][0];
            }
      }
      else{
            activeplayer['score'] += blackjackgame['cardscore'][card];
          }
 }


function showscore(activeplayer){
      if(activeplayer['score'] >= 21){
            document.querySelector(activeplayer['scoreSpan']).textContent = 'BUST!';
            document.querySelector(activeplayer['scoreSpan']).style.color = 'red';
      }
      else{
            document.querySelector(activeplayer['scoreSpan']).textContent = activeplayer['score'];
      }

}

function computewinner(){
   let winner;
   if(YOU['score'] <= 21) {
         if(YOU['score'] > DEALER['score'] || DEALER['score'] > 21){
               winner = YOU;
               blackjackgame['wins']++;
         }
         else if(YOU['score'] < DEALER['score']){
               winner = DEALER;
               blackjackgame['losses']++;
         }
         else if(YOU['score'] === DEALER['score']){
               blackjackgame['draws']++;
         }
   }
   else if(YOU['score'] > 21 && DEALER['score'] <= 21){
         winner = DEALER;
         blackjackgame['losses']++;
   }
   else if(YOU['score'] > 21 && DEALER['score'] > 21){
      blackjackgame['draws']++;
   }
 return winner;
} 

function showresult(winner){
      let msg,msgcolor;
      if(blackjackgame['turnover'] === true){
            if(winner === YOU){
                  document.querySelector('#wins').textContent = blackjackgame['wins'];
                  msg = 'You won!';
                  msgcolor = 'green';
                  winsound.play();
            } else if(winner === DEALER){
                  document.querySelector('#losses').textContent = blackjackgame['losses'];
                  msg = 'You lost!';
                  msgcolor = 'red';
                  losssound.play();
            } else{
                  document.querySelector('#draws').textContent = blackjackgame['draws'];
                  msg = 'You drew!';
                  msgcolor = 'blue';
            }
      
            document.querySelector('#blackjack-result').textContent = msg ;
            document.querySelector('#blackjack-result').style.backgroundColor = msgcolor;
     } 
}