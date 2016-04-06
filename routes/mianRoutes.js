Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/game/rooms/:_id', {
  name:'gameRoom',
  template:'game',
  data:function(){
    return Rooms.find({_id:this.params._id}).fetch()[0];
    return {_id:this.params._id};
  }
});

Router.route('/game/rooms', {
  template:'rooms'
});