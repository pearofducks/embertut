App.Router.map(function(){
  this.resource('users', function(){
    this.route('create');
    this.resource('user', { path: '/:user_id' }, function(){
      this.route('edit');
    });
  });
});
