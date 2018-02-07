import DS from 'ember-data';

export default DS.RESTAdapter.extend({
	//namespace: 'api',
	//host: 'http://localhost:3000/login'
	login: function(){
          return Ember.$.getJSON('http://localhost:3000/login');
        }
});
