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

  }
});

Template.room.events({
  'click .room'(event, instance) {
    const roomId = event.currentTarget.id;
    Meteor.call('rooms.update', roomId, Meteor.user(), (err, result)=>{
      Router.go('gameRoom', { _id: roomId });
    });
  },
})