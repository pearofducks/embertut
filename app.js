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
  filteredUser: '',
  userList: function(){ return this.get('model').filterBy('selected',true);}.property('@each.selected'),
  // userList: function() {
  //   return this.get('model').filterBy('selected',true);
  // },
  filterUser: function(){
    filteredUser = this.get('filteredUser').toLowerCase();
    users = this.get('model')
    // if show.get('show.title').toLowerCase().indexOf(filteredShow) >= 0
    // console.log(this.get('model'));
    if (Em.isEmpty(filteredUser)) {
      users.forEach(function(user){
        user.set('selected',false);
      });
    } else {
      users.forEach(function(user){
        // console.log(user.get('name'));
        if (user.get('name').toLowerCase().indexOf(filteredUser) >= 0) {
          console.log(user.get('name'));
          user.set('selected',true);
        } else {
          user.set('selected',false);
        }
      });
    }
  }.observes('filteredUser'),

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
