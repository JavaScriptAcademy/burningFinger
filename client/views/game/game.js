Template.action.onCreated(function actionOnCreated() {
  Meteor.subscribe('getAllRooms');
});

Template.action.helpers({
  isOwner() {
    let roomObj = Rooms.findOne({_id: this._id});
    if (roomObj) {
      return roomObj.owner === Meteor.userId();
    }
    return false;
  }
});

Template.action.events({
  'click #quitBtn'(event){
    Meteor.call('member.remove', this._id, ()=> {
      Router.go('rooms');
    })
  },
  'click #startBtn'(){
    Meteor.call('room.updateStatus', this._id);
    $('#wordTypingField').focus();
  }
});