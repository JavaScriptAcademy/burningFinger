let passedWords = [], restWords = [], indexOfWord = 1,wholeTextObj = [];
let activeWord = '', activeIndex= 0;
let  _ = lodash;

Template.type.onCreated( function typeOnCreated() {
  Meteor.subscribe('getAllRooms');
  $('#wordTypingField').focus();
});

Template.type.helpers({
  passedWords(){
    return '';
  },
  activeWord(){
    let wholeTextObj = getRoomById(this._id);
    if(wholeTextObj){
      let restWords = wholeTextObj.text && wholeTextObj.text.split(' ');
      return restWords[activeIndex];
    }
    return '';
  },
  restWords(){
    let wholeTextObj = getRoomById(this._id);
    if(wholeTextObj){
      let restWords = wholeTextObj.text && wholeTextObj.text.split(' ');
      return restWords.slice(1, restWords.length).join(' ');
    }
    return '';
  },
  allPlayer(){
    let wholeRoomObj = getRoomById(this._id);
    let allPlayers = wholeRoomObj && wholeRoomObj.members;
    allPlayers =  _.sortBy(allPlayers, ['name', 'progress']);
    return allPlayers;
  },
  isStarting(){
    let wholeRoomObj = getRoomById(this._id);
    let status = wholeRoomObj && wholeRoomObj.isStarting;
    return status;
  }
});

Template.type.events({
  'keyup #wordTypingField'(event){
    let inputWord = event.target.value;
    let wholeTextObj = getRoomById(this._id);
    let restWords = wholeTextObj && wholeTextObj.text && wholeTextObj.text.split(' ');

    checkCorrect(inputWord, restWords[activeIndex]);

    if(event.keyCode === 32){
      if(checkCompleteAWord(inputWord.trim(), restWords[activeIndex])){
        // passed the active word to passedWords array
        passedWords.push(restWords[activeIndex]);
        // and get the new active word
        activeWord = getActiveWord(indexOfWord, restWords);
        indexOfWord < restWords.length - 1 ? indexOfWord ++ : 0;
        $('#passed').html(passedWords.join(' '));
        $('#active').html(activeWord);
        $('#active').css('background-color','lightgreen')
        $('#rest').html(restWords.slice((passedWords.length + 1), restWords.length).join(' '));

        let wordsCounts = passedWords.length;
        let progress = (wordsCounts / restWords.length) * 100;
        progress = parseFloat(Math.round(progress * 100) / 100).toFixed(2);
        Meteor.call('member.update',progress, Meteor.userId(), this._id);
        activeIndex++;
        $('#wordTypingField').val('');
      }
    }


  }
  // end of keyup function

});

function checkCompleteAWord(inputWord, activeWord){
  if(inputWord.length === activeWord.length &&
    checkCorrect(inputWord, activeWord)){
    return true;
}else{
  changeBackColor(false);
  return false;
}
};

function checkCorrect(inputWord, WordToCompare){
  let isCorrect = isCorrectWord(inputWord, WordToCompare);
  changeBackColor(isCorrect);
  return isCorrect;

}

function isCorrectWord(inputWord, currentWord){
  let inputWordArray = inputWord.split('');
  let activeWordArray = currentWord.split('');

  for(let index = 0; index < inputWordArray.length; index ++){
    let result = (inputWordArray[index] === activeWordArray[index]);
    if(!result){
      return false;
    }
  }
  return true;
}

function changeBackColor(isPassed){
  if(isPassed){
    $('#active').css('background-color','lightgreen');
  }else{
    $('#active').css('background-color','red');
  }
}

function getRoomById(id){
  return Rooms.findOne({_id:id});
}

function getText(roomId){
  let room = Rooms.findOne({_id:roomId});
  let text = room && room.text;
  return text;
}

function getActiveWord(indexOfWord, restWords){
  return restWords[indexOfWord];
}

