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
    let member ={
      id: Meteor.userId(),
      username: Meteor.user().username,
      progress: Meteor.user().progress,
    }
    roomMembers.push(member);

    let text = HTTP.call('GET',"http://www.randomtext.me/api/gibberish/p-1/30-45");

    let string =text.data.text_out.replace("<p>", "").replace("</p>", "");
    let id = Rooms.insert({
      name:roomName,
      members:roomMembers,
      text: string,
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
    return id;
  },
  'rooms.update'(roomId, user){
    let newMembers = Rooms.findOne({_id:roomId}).members;
    let member ={
      id: Meteor.userId(),
      username: Meteor.user().username,
      progress: Meteor.user().progress,
    }
    newMembers.push(member);
    Rooms.update(roomId, { $set: { members: newMembers } });
  },
  'member.update'(progress, userId, roomId){
    let Members = Rooms.findOne({_id:roomId}).members;
    let currentPlayer = Members.find((el)=>{
      return el.id === userId;
    });
    currentPlayer.progress = progress;

    Rooms.update(roomId, { $set: { members: Members } });
    console.log(Members);
  }


})


Accounts.onCreateUser(function(options, user) {
  user.progress = 0;
  if (options.profile){
    user.profile = options.profile;
  }
  return user;
});