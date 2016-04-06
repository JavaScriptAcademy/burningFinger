Texts = new Mongo.Collection('texts');
var Schemas = {};

Schemas.Text = new SimpleSchema({
    text: { type: String },
    title: {type :String}
});

Texts.attachSchema(Schemas.Text);

Meteor.methods({


})