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
    let wholeTextObj = Rooms.findOne({_id:this._id});
    if(wholeTextObj){
      let restWords = wholeTextObj.text && wholeTextObj.text.split(' ');
      return restWords[activeIndex];
    }
    return '';
  },
  restWords(){
    let wholeTextObj = Rooms.findOne({_id:this._id});
    if(wholeTextObj){
      let restWords = wholeTextObj.text && wholeTextObj.text.split(' ');
      return restWords.slice(1, restWords.length).join(' ');
    }
    return '';
  },
  allPlayer(){
    let wholeRoomObj = Rooms.findOne({_id:this._id});
    let allPlayers = wholeRoomObj && wholeRoomObj.members;
    allPlayers =  _.chain(allPlayers)
    .sortBy(['progress', 'name'])
    .reverse()
    .map(player => {
      player.progress = player.progress.toFixed(2);
      return player;
    })
    .value();
    return allPlayers;
  },
  isStarting(){
    let wholeRoomObj = Rooms.findOne({_id:this._id});
    let status = wholeRoomObj && wholeRoomObj.isStarting;
    return status;
  }
});

Template.type.events({
  'keyup #wordTypingField'(event){
    let inputWord = event.target.value;
    let inputWordArray = inputWord.split(' ');
    let remainWord = '';

    // check if the user press two keys at the same time.
    if(inputWordArray.length > 1){
      remainWord = inputWordArray.slice(inputWordArray.length - 1, inputWordArray.length);
      inputWordArray.splice(inputWordArray.length - 1, inputWordArray.length);
      inputWord = inputWordArray.join();
    }

    let wholeTextObj = Rooms.findOne({_id:this._id});
    let restWords = wholeTextObj && wholeTextObj.text && wholeTextObj.text.split(' ');

    let isWordCorrect = checkCorrect(inputWord.trim(), restWords[activeIndex].trim());
    let isCompleted = checkCompleteAWord(inputWord.trim(), restWords[activeIndex].trim());

    if (!isWordCorrect) { return; }

    // to finish the game
    console.log(isCompleted, activeIndex === (restWords.length -1) );
    if( activeIndex === (restWords.length -1) && isCompleted ){

      alert('congretulations!');
    }


    if(event.keyCode === 32){
      if(isCompleted){
        // passed the active word to passedWords array
        passedWords.push(restWords[activeIndex]);
        // and get the new active word
        activeWord =  restWords[indexOfWord];
        indexOfWord < restWords.length - 1 ? indexOfWord ++ : 0;
        $('#passed').html(passedWords.join(' '));
        $('#active').html(activeWord);
        $('#active').css('background-color','lightgreen')
        $('#rest').html(restWords.slice((passedWords.length + 1), restWords.length).join(' '));

        let wordsCounts = passedWords.length;
        let progress = (wordsCounts / restWords.length) * 100;
        progress = parseFloat(Math.round(progress * 100) / 100);
        Meteor.call('member.update',progress, Meteor.userId(), this._id);
        activeIndex++;

        $('#wordTypingField').val(remainWord);
      }
    }


  }
  // end of keyup function

});

function checkCompleteAWord(inputWord, activeWord){
  if(inputWord.length === activeWord.length) {
    return true;
  }else{
    return false;
  }
};

function checkCorrect(inputWord, WordToCompare){
  let isCorrect =  true;
  let inputWordArray = inputWord.split('');
  let activeWordArray = WordToCompare.split('');

  for(let index = 0; index < inputWordArray.length; index ++){
    let result = (inputWordArray[index] === activeWordArray[index]);
    if(!result){
      isCorrect = false;
      continue;
    }
  }
  changeBackColor(isCorrect);
  return isCorrect;

}

function changeBackColor(isPassed){
  if(isPassed){
    $('#active').css('background-color','lightgreen');
  }else{
    $('#active').css('background-color','red');
  }
}

function getText(roomId){
  let room = Rooms.findOne({_id:roomId});
  let text = room && room.text;
  return text;
}
