import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';
import SessionHelperMixin from '../mixins/session-helper-mixin';

export default Base.extend(SessionHelperMixin, {
  session: Ember.inject.service('session'),
  restore: function(data) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      resolve({
        access_token: 'access_token',
        token_type: 'token_type',
        refresh_token: 'response.refresh_token',
        expires_in: 'expires_in',
        company_hierarchy: 'company_hierarchy',
        sessionId: data.sessionId,
        sessionType: data.sessionType
      });
    });
  },

  authenticate: function(options) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if(options.identification === 'admin' || options.identification === 'customer') {
        _this.setCookie("SESSIONID", options.identification);
        resolve({
          access_token: 'access_token',
          token_type: 'token_type',
          refresh_token: 'response.refresh_token',
          expires_in: 'expires_in',
          company_hierarchy: 'company_hierarchy',
          sessionId: options.identification,
          sessionType: options.identification
        });
      } else {
        var errorObj = {
          errorMessage: 'Invalid ID or Password'
        }
        reject(errorObj);
      }
    });
  },

  invalidate(data) {
    var _this = this;
    function success(resolve) {
      _this.trigger('sessionInvalidationSucceeded');
    }
    return new Ember.RSVP.Promise(function(resolve, reject) {
      success(resolve());
    });
  }
});
