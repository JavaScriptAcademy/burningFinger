
// const typingProgress = 0;

Meteor.users.allow({
  insert: function (userId, doc) {
    // user can insert
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    // console.log("user "+userId+"wants to modify doc"+doc._id);
    // if (userId && doc._id === userId) {
    //   console.log("user allowed to modify own account!");
       // user can modify own
    //   return true;
    // }
    // admin can modify any
    // var u = Meteor.users.findOne({_id:userId});
    // return (u && u.isAdmin);
    return true;
  },
  remove: function (userId, doc) {
    // only admin can remove
    // var u = Meteor.users.findOne({_id:userId});
    // return (u && u.isAdmin);
    return true;
  }
});