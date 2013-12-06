window.App = Ember.Application.create({
  LOG_TRANSITIONS: true
});
App.ApplicationAdapter = DS.FixtureAdapter;
App.User = DS.Model.extend({
  name         : DS.attr(),
  email        : DS.attr(),
  bio          : DS.attr(),
  avatarUrl    : DS.attr(),
  creationDate : DS.attr()
});
App.User.FIXTURES = [{
  id: 1,
    name: 'Sponge Bob',
    email: 'bob@sponge.com',
    bio: 'Lorem ispum dolor sit amet in voluptate fugiat nulla pariatur.',
    avatarUrl: '../assets/images/avatars/sb.jpg',
    creationDate: '2013-08-26'
}, {
  id: 2,
    name: 'John David',
    email: 'john@david.com',
    bio: 'Lorem ispum dolor sit amet in voluptate fugiat nulla pariatur.',
    avatarUrl: '../assets/images/avatars/jk.jpg',
    creationDate: '2013-08-07'
}];
App.Router.map(function(){
  this.resource('users', function(){
    this.resource('user', { path:'/:user_id' }, function(){
      this.route('edit');
    });
    this.route('create');
  });
});
App.UsersRoute = Em.Route.extend({
  model: function(){
    return this.store.find('user');
  }
});
App.UsersController = Em.ArrayController.extend({
  sortProperties: ['name'],
  sortAscending: true, // false = descending

  usersCount: function(){
    return this.get('model.length');
  }.property('@each')
});
App.UserController = Ember.ObjectController.extend({
  deleteMode: false,
  actions: {
    edit: function(){
      this.transitionToRoute('user.edit');
    },
    delete: function(){
      this.toggleProperty('deleteMode');
    },
    cancelDelete: function(){
      this.set('deleteMode',false);
    },
    confirmDelete: function(){
      this.get('model').deleteRecord();
      this.get('model').save();
      this.transitionToRoute('users');
      this.set('deleteMode', false);
    }
  }
});
App.UserEditController = Ember.ObjectController.extend({
  actions: {
    save: function() {
      var user = this.get('model');
      user.save();
      this.transitionToRoute('user', user);
    }
  }
});
App.UserEditRoute = Ember.Route.extend({
  model: function(){
    return this.modelFor('user');
  }
});
App.UsersCreateRoute = Ember.Route.extend({
  model: function(){
    return Em.Object.create({});
  },
  renderTemplate: function(){
    this.render('user.edit', { controller: 'usersCreate' });
  }
});
App.UsersCreateController = Ember.ObjectController.extend({
  actions: {
    save: function(){
      this.get('model').set('creationDate', new Date());
      var newUser = this.store.createRecord('user', this.get('model'));
      newUser.save();
      this.transitionToRoute('user', newUser);
    }
  }
});
