import { Meteor } from 'meteor/meteor';

Meteor.publish('randomtext', () => {
  let id =  Random.choice(Texts.find().fetch())._id;
  let randomtext = Texts.find({_id: id});
   return randomtext;
});

Meteor.publish('rooms',()=>{
  return Rooms.find();
})
Meteor.startup(() => {
  Rooms.remove();
  console.log(Rooms.find().count());
  if(Texts.find().count() === 0){

    _.forEach(texts, (text) => {
      Texts.insert({
        title: text.title,
        text: text.text
      });
    });

  }
let shuffledTexts = _.shuffle(Texts.find().fetch());

// if( Rooms.find().count() === 0){
//   let id = 0;

//    _.forEach(shuffledTexts, (text)=>{
//     Rooms.insert({
//       id: id,
//       text: text.text
//     });
//     id++;
//   })

// }else{
//   let rooms = Rooms.find().fetch();
//   _.forEach(rooms, (room) =>{
//     room.update()
//   })

// }

console.log('rooms', Rooms.find().count() );


});


texts = [
  {
    title : 'That Time You Went to the Store and Never Returned',
    text: 'It has always been inevitable that you would leave, tonight, for the grocery store, and never come back. There has never been any other choice but for you to go, and for me to let you. You have always thrown your jacket over your shoulders and run across the street in the rain. There is no alternate dimension where you said, or I said, we’ll get the eggs tomorrow, it can wait, only the sound of falling rain for me, the squealing of brakes on the street outside. And in the distance, the sound of sirens, coming near, coming near.'
  },{
    title: 'The Necessary Paternal Directions',
    text: 'School let out, and we headed down for swimming at the spring. But my friends got held up dreading turtles. They come so close. I hear they break skin.We arrived, and I tore yellowed leaves from a fallen limb. I stood with it raised above the waters and the swimmers.I’d only hit the surface once, when a loud voice called from rocks across the pond – “Don’t you hurt those turtles!” – a dad voice, unyielding, but we couldn’t see the person who was calling.O creatures, who is your protector? O stick, you think we can take him too?'
  },{
    title: 'Glyph',
    text: 'He’d loved hieroglyphs ever since Indiana Jones twisted one, a stone temple figure, and the walls rumbled open. Now he was just a guy with a sputtering Ducati motorcycle taking business classes who fell in love with a girl, and took a poetry class to be with her. He learned all glyphs, hiero or otherwise, were images, which could take form in any of the senses, so her scent in bed was a glyph, her touch was sometimes a glyph, and between her lips when she said goodbye, though he pleaded for her not to, his name was a glyph.'
  },{
    title: 'Holding onto a Shadow',
    text: 'He loved a girl named Claire, who was a three-dimensional shadow. He watched his shadow merging into her, her graceful slides, her stretches at sunset. Things were good.One night, he said, “I kinda wish I could feel your heartbeat.”She turned, said nothing. Things got worse.They took a bus downtown. Sitting by the window, he looked out and watched a girl chasing the bus, which slowed, stopped. She got on, sat next to him. Her body slid into, and vanished, Claire.“God, my heart’s freaking sprinting,” she said, her eyes sea-green. “Sorry, were you waiting for someone?”'
  },{
    title: 'Useless Things',
    text: 'Forgetting the uses for things was, in a way, a relief. It was less painful, for instance, when her grandmother’s teacups shattered on the tile floor. They seemed to have fulfilled their purpose. She wiped up the mess, then tied the wet washrag in her hair. She was no longer afraid to drive backwards, or paint her clothes, or weed indiscriminately. It was now impossible to make a mistake. As she lifted the hot kettle and embraced it, tea splashed onto her bare legs. These burns are what I was made for, she thought. These marks are who I am.'
  }
]