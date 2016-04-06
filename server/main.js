Meteor.publish('getAllRooms',()=>{
  return Rooms.find();
})

Meteor.startup(() => {

});

Meteor.methods({
  'rooms.insert'(roomName){
    check(roomName, String);

    //Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    let roomMembers = [];
    roomMembers.push(Meteor.user().username);

    HTTP.get("http://www.randomtext.me/api/gibberish/p-1/95-105", (err, text) => {
      var string =text.data.text_out.replace("<p>", "").replace("</p>", "");

    Rooms.insert({
        name:roomName,
        members:roomMembers,
        text: string,
        owner: Meteor.userId(),
        username: Meteor.user().username,
      });


    });



  },
})
