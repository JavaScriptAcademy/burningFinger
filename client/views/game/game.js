Template.action.onCreated( function actionOnCreated() {
  Meteor.subscribe('getAllRooms');

});

Template.action.helpers({
  isOwner() {
    let roomObj = Rooms.findOne({_id:this._id});
    if(roomObj){
      return roomObj.owner === Meteor.userId();
    }
    return false;
  },
});