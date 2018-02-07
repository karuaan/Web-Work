import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login', { path: '/' });
  this.route('home', function() {
    this.route('view');
    this.route('assign');
    this.route('group');
    this.route('assignment');
    this.route('parse');
  });
  this.route('example');
});

export default Router;
