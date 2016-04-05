Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/game/room/:_id', {
  name:'game',
  // data:function(){
  //   console.log(this.params._id);
  //   console.log( Rooms.findOne({ id: this.params._id }) );
  //   return Rooms.findOne({ id: this.params._id });
  // }
});