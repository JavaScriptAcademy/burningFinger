import { Template } from 'meteor/templating';
import { Meteor }  from 'meteor/meteor';

import './type.html';

let passedWords = [], restWords = [], indexOfWord = 1;
let activeWord = '', indexOfInputWord = 0;

Template.type.onCreated( () => {
  Meteor.subscribe('randomtext');
  Meteor.subscribe('rooms');
  $('#wordTypingField').focus();

});

Template.type.helpers({
  randomText(){
    return getRandomText();
  },
  passedWords(){
    return '';
  },
  activeWord(){
    let wholeTextObj = getRandomText();
    let restWords = wholeTextObj.text.split(' ');
    passedWords.push(restWords[0]);
    activeWord = restWords[0];
    return activeWord;
  },
  restWords(){
    let wholeTextObj = getRandomText();
    let restWords = wholeTextObj.text.split(' ');
    return restWords.slice(1, restWords.length).join(' ');
  }
});

Template.type.events({
  'keyup #wordTypingField'(event){
    let wholeTextObj = getRandomText();
    let restWords = wholeTextObj.text.split(' ');
    let inputWord = event.target.value;

    checkCorrect(inputWord, activeWord);

    if(event.keyCode === 32){
      if(checkCompleteAWord(inputWord.trim(), activeWord)){
        activeWord = getActiveWord(indexOfWord, restWords);
        indexOfWord < restWords.length - 1 ? indexOfWord ++ : 0;
        $('#passed').html(passedWords.join(' '));
        passedWords.push(activeWord);
        $('#active').html(activeWord);
        $('#active').css('background-color','lightgreen')
        $('#rest').html(restWords.slice(passedWords.length, restWords.length).join(' '));
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
}

function checkCorrect(inputWord, activeWord){
  let isCorrect = isCorrectWord(inputWord, activeWord);
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

function getRandomText(){
  return Texts.findOne();
}

function getActiveWord(indexOfWord, restWords){
  return restWords[indexOfWord];
}

