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

    // let text = HTTP.call('GET',"http://www.randomtext.me/api/gibberish/p-1/30-45");

    // let string =text.data.text_out.replace("<p>", "").replace("</p>", "");
    let string = 'As you execute your project, you’ll want to regularly update your stakeholders. Beprepared to discuss the project’s progress, its challenges, and your plan of action forthose challenges. Be careful, though! Your manager may ask you to add deliverables to your final delivery. Your co-worker might realize that their responsibilities require more creep.';

    let id = Rooms.insert({
      name:roomName,
      members:roomMembers,
      text: string,
      owner: Meteor.userId(),
      username: Meteor.user().username,
      isStarting: false
    });
    return id;
  },
  'rooms.update'(roomId){
    let originMembers = Rooms.findOne({_id:roomId}).members;

    let exists = originMembers.findIndex(function (element) {
      return element.id === Meteor.userId();
    });

    // if current player is not exists in the room before.
    if(exists === -1){
      let member ={
        id: Meteor.userId(),
        username: Meteor.user().username,
        progress: 0,
      };
      originMembers.push(member);
      Rooms.update(roomId, { $set: { members: originMembers } });
    }

  },
  // update the progress of current player
  'member.update'(progress, userId, roomId){
    let Members = Rooms.findOne({_id:roomId}).members;
    let currentPlayer = Members.find((el)=>{
      return el.id === userId;
    });
    currentPlayer.progress = progress;

    Rooms.update(roomId, { $set: { members: Members } });
  },
  'member.remove'(roomId){
    let room = Rooms.findOne({_id:roomId});

    let Members =room && room.members;
    let owner = room && room.owner;

    let memberIndex = Members.findIndex((element, index, array)=>{
      return element.id === Meteor.userId();
    });

    if(Members.length <= 1){
      Rooms.remove(roomId);
    }else{

      if(Meteor.userId() === owner){
        Rooms.update(roomId,{ $set: { owner: Members[1].id } });
      }
      Members.splice(memberIndex,1);
      Rooms.update(roomId,{ $set: { members: Members } });
    }
  },
  'room.updateStatus'(roomId){
    Rooms.update(roomId,{ $set:{ isStarting: true }});
  }


})


Accounts.onCreateUser(function(options, user) {
  user.progress = 0;
  if (options.profile){
    user.profile = options.profile;
  }
  return user;
});