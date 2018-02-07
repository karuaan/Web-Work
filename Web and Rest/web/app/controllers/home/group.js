import Ember from 'ember';

export default Ember.Controller.extend({
  members: [],
  addMember: function() {
    //if(this.get('name') !== undefined && this.get('name') !== null && this.get('name') !== '' &&
    if(this.get('mail') !== undefined && this.get('mail') !== null && this.get('mail') !== '') {
      var array = this.get('mail').split(',');
      for(let i = 0; i < array.length; i++) {
        this.get('members').pushObject({
          'mail': array[i]
        });
      }
      /*
      this.get('members').pushObject({
        'name': this.get('name'),
        'mail': this.get('mail')
      });
      */
      /*this.set('name', undefined);*/
      this.set('mail', undefined);
      document.getElementById('group-form-mail').focus();
      document.getElementById('added-table').style.display = 'block';
    }
  },
  onCreateGroup(){
	  return {
		admin_id: 1,
		user_ids: this.get('members'),
		group_name: this.get('group_name')
	  };
  }
});
