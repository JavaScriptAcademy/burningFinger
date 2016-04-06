Rooms = new Mongo.Collection('rooms');
var Schemas = {};

Schemas.Room = new SimpleSchema({
  name:{ type:String },
  text: { type: String },
  members:  { type: [ String ]  },
  owner:{ type: String}
});

Rooms.attachSchema(Schemas.Room);
Rooms.allow({
  insert(userId, doc){
    return true;
  }
});
