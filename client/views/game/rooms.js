Template.rooms.onCreated( function roomsOnCreated() {
  Meteor.subscribe('getAllRooms');
  this.showForm = new ReactiveVar(false);
});

Template.rooms.helpers({
  allRooms(){
    return Rooms.find().fetch();
  },
  showForm(){
    return Template.instance().showForm.get();
  },
  isStarting(){
    let wholeRoomObj = getRoomById(this._id);
    let status = wholeRoomObj && wholeRoomObj.isStarting;
    return status;
  }
});

Template.rooms.events({
  'click #showNewRoomForm'(event, instance) {
    instance.showForm.set(!instance.showForm.get());
  },
  'submit #newRoomForm'(event){
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const name = target[0].value;

    if(Meteor.userId() && name){
      // Insert a task into the collection
      Meteor.call('rooms.insert', name, (err, result)=>{
        if(!err){
         Router.go('gameRoom', { _id: result });
       }else{
         console.log(err.reason);
       }

     });

      // Clear form
      target[0].value = '';

    }else{
      alert('plz login and enter the room name');

    }

  }
});

Template.room.events({
  'click .room'(event) {
    const roomId = event.currentTarget.id;
    let isStarting = Rooms.findOne({_id: roomId}).isStarting;
    if(isStarting){
      alert('the room has already started!');
    }else{
      Meteor.call('rooms.update', roomId, (err, result)=>{
        Router.go('gameRoom', { _id: roomId });
      });
    }
  }
});