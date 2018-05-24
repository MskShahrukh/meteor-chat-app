import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tasks } from '../api/tasks.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Otherwise, return all of the tasks
    return Tasks.find({}, { sort: { createdAt: -1 } });
      },
    incompleteCount() {
      return Tasks.find({ checked: { $ne: true } }).count();
    },
});


Template.body.events({
 'submit .new-task'(event) {
   // Prevent default browser form submit
   event.preventDefault();
   // Get value from form element
   const target = event.target;
   const text = target.text.value;
   // Insert a task into the collection
if( target.text.value !== ''){
  Tasks.insert({
    text,
    createdAt: new Date(),
    owner: Meteor.userId(),
    username: Meteor.user().username,
  });
}
// Insert a task into the collection

Meteor.call('tasks.insert', text);
   // Clear form
   target.text.value = '';
 },
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },

});

Template.task.helpers({
  isOwner() {

  //  console.log( Meteor.userId());
    return this.owner === Meteor.userId();
  },

});


Template.task.events({
  'click .delete'() {
    Meteor.call('tasks.remove', this._id);
  },
  'click .toggle-private'() {
    Meteor.call('tasks.setPrivate', this._id, !this.private);
  },
});
