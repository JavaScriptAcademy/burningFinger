let passedWords = [], restWords = [], indexOfWord = 1, wholeTextObj = [];
let activeWord = '', activeIndex = 0;
let _ = lodash;

Template.type.onCreated(() => {
  Meteor.subscribe('getAllRooms');
});

Template.type.helpers({
  passedWords(){
    return '';
  },
  activeWord(){
    let wholeTextObj = Rooms.findOne({_id: this._id});
    if (wholeTextObj) {
      let restWords = wholeTextObj.text && wholeTextObj.text.split(' ');
      return restWords[activeIndex];
    }
    return '';
  },
  restWords(){
    let wholeTextObj = Rooms.findOne({_id: this._id});
    if (wholeTextObj) {
      let restWords = wholeTextObj.text && wholeTextObj.text.split(' ');
      return restWords.slice(1, restWords.length).join(' ');
    }
    return '';
  },
  allPlayer(){
    let wholeRoomObj = Rooms.findOne({_id: this._id});
    let allPlayers = wholeRoomObj && wholeRoomObj.members;

    let sortedFinishedPlayers = _.chain(allPlayers)
      .filter(player => {
        return player.finished;
      })
      .sortBy('speed')
      .reverse()
      .value();

    let sortedInProgressPlayers = _.chain(allPlayers)
      .filter(player => {
        return !player.finished;
      })
      .sortBy('progress')
      .reverse()
      .value();

    return sortedFinishedPlayers
      .concat(sortedInProgressPlayers)
      .map(player => {
        player.speed = player.speed.toFixed(2);
        player.rank = player.finished ? _.indexOf(sortedFinishedPlayers, player) + 1 : 0;
        player.progress = player.progress.toFixed(2);

        return player;
      });
  },
  isStarting(){
    let currentRoom = Rooms.findOne({_id: this._id});
    let roomStarted = currentRoom && currentRoom.isStarting;
    let currentPlayer = currentRoom && currentRoom.members.find(player => {
        return player.id === Meteor.userId();
      });

    return roomStarted && !currentPlayer.finished;
  }
});

Template.type.events({
  'keyup #wordTypingField'(event){
    let inputWord = event.target.value;
    let inputWordArray = inputWord.split(' ');
    let remainWord = '';

    if (inputWordArray.length > 1 && inputWordArray[1] !== "") {
      remainWord = inputWordArray[1];
      inputWord = inputWordArray[0];
    }

    let currentRoom = Rooms.findOne({_id: this._id});
    let allWords = currentRoom && currentRoom.text && currentRoom.text.split(' ');

    let isWordCorrect = checkCorrect(inputWord, allWords[activeIndex]);

    if (!isWordCorrect) {
      return;
    }

    let gameFinished = checkGameFinished(inputWord, allWords, this._id);

    if (!gameFinished && event.keyCode === 32) {
      onWordCompleted(this._id, allWords);
      $('#wordTypingField').val(remainWord);
    }

  }

});

function checkCorrect(inputWord, wordToCompare) {
  let compareWord = wordToCompare.substring(0, inputWord.length);
  var wordIsFinished = inputWord.length > wordToCompare.length && inputWord.substr(wordToCompare.length, 1) === " ";
  let isCorrect = (compareWord === inputWord || wordIsFinished);

  changeBackColor(isCorrect);
  return isCorrect;
}

function changeBackColor(isPassed) {
  if (isPassed) {
    $('#active').css('background-color', 'lightgreen');
  } else {
    $('#active').css('background-color', 'red');
  }
}

function checkGameFinished(inputWord, allWords, roomId) {
  let isWordCompleted = inputWord.length === allWords[activeIndex].trim().length;
  let isLastWord = activeIndex === (allWords.length - 1);

  if (isLastWord && isWordCompleted) {
    Meteor.call('member.update', 100, Meteor.userId(), roomId, true);

    return true;
  }

  return false;
}

function onWordCompleted(roomId, allWords) {
  passedWords.push(allWords[activeIndex]);
  activeWord = allWords[indexOfWord];
  indexOfWord < allWords.length - 1 ? indexOfWord++ : 0;
  $('#passed').html(passedWords.join(' '));
  $('#active').html(activeWord);
  $('#active').css('background-color', 'lightgreen');
  $('#rest').html(allWords.slice((passedWords.length + 1), allWords.length).join(' '));

  let wordsCounts = passedWords.length;
  let progress = (wordsCounts / allWords.length) * 100;
  Meteor.call('member.update', progress, Meteor.userId(), roomId, false);
  activeIndex++;
}

function getText(roomId) {
  let room = Rooms.findOne({_id: roomId});
  return room && room.text;
}
