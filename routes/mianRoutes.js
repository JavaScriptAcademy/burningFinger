Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/rooms/:_id', {
  name:'gameRoom',
  template:'game',
  onBeforeAction: function(){
    var currentUser = Meteor.userId();
    if(currentUser){
      this.next();
    } else {
     Router.go('rooms');
   }
 },
  data: function(){
    return {_id:this.params._id};
  },
});

Router.route('/rooms', {
  name:'rooms',
  template:'rooms'
});