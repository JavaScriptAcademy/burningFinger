Meteor.publish('getAllRooms', ()=> {
  return Rooms.find();
});

Meteor.startup(() => {

});

function getInitialMember() {
  return {
    id: Meteor.userId(),
    username: Meteor.user().username,
    progress: 0,
    finished: false,
    speed: 0
  };
}

Meteor.methods({
  'rooms.insert'(roomName){
    check(roomName, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    let roomMembers = [];

    let member = getInitialMember();

    roomMembers.push(member);

    let text = HTTP.call('GET', "http://www.randomtext.me/api/gibberish/p-1/45-50");

    let string = text.data.text_out.replace("<p>", "").replace("</p>", "");
    // let string = 'As you execute your project, you will want to regularly update your stakeholders. Beprepared to discuss the project’s progress, its challenges, and your plan of action forthose challenges. Be careful, though! Your manager may ask you to add deliverables to your final delivery. Your co-worker might realize that their responsibilities require more creep.';

    return Rooms.insert({
      name: roomName,
      members: roomMembers,
      text: string,
      owner: Meteor.userId(),
      isStarting: false,
      startTime: null
    });
  },

  'rooms.update'(roomId){
    let originMembers = Rooms.findOne({_id: roomId}).members;

    let exists = originMembers.findIndex(function (element) {
      return element.id === Meteor.userId();
    });

    // if current player is not exists in the room before.
    if (exists === -1) {
      let member = getInitialMember();
      originMembers.push(member);
      Rooms.update(roomId, {$set: {members: originMembers}});
    }

  },

  'member.update'(progress, userId, roomId, finished){
    let currentRoom = Rooms.findOne({_id: roomId});
    let Members = currentRoom.members;
    let currentPlayer = Members.find((el)=> {
      return el.id === userId;
    });

    currentPlayer.progress = progress;
    currentPlayer.finished = finished;
    let timeSpend = new Date() - currentRoom.startTime;
    currentPlayer.speed = currentRoom.text.length * 60000 / timeSpend;

    Rooms.update(roomId, {$set: {members: Members}});
  },

  'member.remove'(roomId){
    let room = Rooms.findOne({_id: roomId});

    let Members = room && room.members;
    let owner = room && room.owner;

    let memberIndex = Members.findIndex((element, index, array)=> {
      return element.id === Meteor.userId();
    });

    if (Members.length <= 1) {
      Rooms.remove(roomId);
    } else {

      if (Meteor.userId() === owner) {
        Rooms.update(roomId, {$set: {owner: Members[1].id}});
      }
      Members.splice(memberIndex, 1);
      Rooms.update(roomId, {$set: {members: Members}});
    }
  },

  'room.updateStatus'(roomId){
    Rooms.update(roomId, {$set: {isStarting: true, startTime: new Date() }});
  }

});


Accounts.onCreateUser(function (options, user) {
  user.progress = 0;

  if (options.profile) {
    user.profile = options.profile;
  }
  return user;
});