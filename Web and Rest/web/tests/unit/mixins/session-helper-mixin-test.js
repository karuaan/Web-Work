import Ember from 'ember';
import SessionHelperMixinMixin from 'mock-reader/mixins/session-helper-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | session helper mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let SessionHelperMixinObject = Ember.Object.extend(SessionHelperMixinMixin);
  let subject = SessionHelperMixinObject.create();
  assert.ok(subject);
});
