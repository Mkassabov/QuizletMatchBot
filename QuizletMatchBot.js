var MAX_TERMS = 6; //1 terms is 2 cards, quizlet only shows up to 6 terms at once in match
var WAIT_TIME = 260; //for some reason this doesn't result in a linear quizlet time, who the fuck knows why
var TIME_PER_TERM = WAIT_TIME / MAX_TERMS; //if this number is less than 43.333 result will be too fast for quizlet

//gets terms and definitions
terms = Quizlet.matchModeData.terms;
wordDefinition = {};
definitionWord = {};
for(let i = 0; i < terms.length; i++){
    wordDefinition[terms[i].word] = terms[i].definition;
    definitionWord[terms[i].definition] = terms[i].word;
}

//fires event (inserts and fires if event is not present)
function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

//starts when screen is clicked
document.onclick = ()=>{
		
        for(let i=0;i<document.querySelector(".MatchModeQuestionGridBoard-tiles").childNodes.length;i++) {
            if(!(document.querySelector(".MatchModeQuestionGridBoard-tiles").childNodes[0].childNodes.length == 0 || document.querySelector(".MatchModeQuestionGridBoard-tiles").childNodes[1].childNodes[0].className == "MatchModeQuestionGridTile is-selected")) {
                let word = document.querySelector(".MatchModeQuestionGridBoard-tiles").childNodes[i].childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerHTML.replace(/<!--([\s\S]*?)-->/mig, '');
                let translatedWord;
				//sets search target to definition of word
				if(wordDefinition[word]){
                    translatedWord = wordDefinition[word];
                }
				//skips word to definition because bugs
				if(definitionWord[word]){
                    continue;
                }
				// find another word in the same dataset ID and click that as well
                for(let o = 0; o < document.querySelector(".MatchModeQuestionGridBoard-tiles").childNodes.length; o++) {
                    if(document.querySelector(".MatchModeQuestionGridBoard-tiles").childNodes[o].innerHTML.includes(translatedWord)) {
						let x = i;
                        setTimeout(()=>{
							//skips click if term has already been clicked
							if(!(document.querySelector(".MatchModeQuestionGridBoard-tiles").childNodes[o].childNodes[0] === undefined)) {
								console.log("Found word pair: "+translatedWord+":"+word);
								eventFire(document.querySelector(".MatchModeQuestionGridBoard-tiles").childNodes[o].childNodes[0], "pointerdown");
								eventFire(document.querySelector(".MatchModeQuestionGridBoard-tiles").childNodes[x].childNodes[0], "pointerdown");
							}
						},i * TIME_PER_TERM); //any number below 60 generates a score too low for quizlet to accept :(
                    }
                }
            }
        }
};