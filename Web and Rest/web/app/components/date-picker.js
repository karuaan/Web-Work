import Ember from 'ember';

export default Ember.Component.extend({
  time: false,
  minDate: null,
  maxDate: null,
  format: null,
  formatSelection: null,
  range: null,
  minSelected: false,
  maxSelected: false,
  didInsertElement: function() {
    if(this.get('minDate') !== null) {
      if(this.get('minDate') === 'now') {
        this.set('minDate', moment());
      } else {
        this.set('minDate', moment(this.get('minDate')));
      }
    }

   if(this.get('maxDate') !== null) {
      if(this.get('maxDate') === 'now') {
        this.set('maxDate', moment());
      } else {
        this.set('maxDate', moment(this.get('maxDate')));
      }
    }

   if(!this.get('format')) {
      this.set('format', 'YYYY-MM-DD');
    }

   let parent = this;
    if(this.get('range')) {
      this.$('#date-start').bootstrapMaterialDatePicker({
            weekStart : 0,
            time : parent.get('time'),
            clearButton : true,
        format : parent.get('format'),
        minDate: parent.get('minDate'),
        maxDate: parent.get('maxDate')}).on('change', function(e, date) {
          if(date != undefined) {
            parent.$('#date-end').bootstrapMaterialDatePicker('setMinDate', date);
            parent.set('minSelected', true);
            if(parent.get('minSelected') && parent.get('maxSelected')) {
              parent.sendAction('update');
            }
          } else {
            parent.$('#date-end').bootstrapMaterialDatePicker('setMinDate', null);
            parent.set('minSelected', false);
          }
      });

     this.$('#date-end').bootstrapMaterialDatePicker({
            weekStart : 0,
            time : parent.get('time'),
            clearButton : true,
        format : parent.get('format'),
        minDate: parent.get('minDate'),
        maxDate: parent.get('maxDate')}).on('change', function(e, date) {
          if(date != undefined) {
            parent.$('#date-start').bootstrapMaterialDatePicker('setMaxDate', date);
            parent.set('maxSelected', true);
            if(parent.get('minSelected') && parent.get('maxSelected')) {
              parent.sendAction('update');
            }
          } else {
            parent.$('#date-start').bootstrapMaterialDatePicker('setMaxDate', null);
            parent.set('maxSelected', false);
          }
      });

     if(this.get('formatSelection') !== null && $('#' + this.get('formatSelection')) !== null) {
        $('#' + this.get('formatSelection')).on("change", function() {
          let form = $(this).val();
          parent.$('#date-start').bootstrapMaterialDatePicker('setFormatDate', form);
          parent.$('#date-end').bootstrapMaterialDatePicker('setFormatDate', form);
        });
      }
    } else {
      this.$('#date').bootstrapMaterialDatePicker({
            weekStart : 0,
            time : parent.get('time'),
            clearButton : true,
        format : parent.get('format'),
        minDate: parent.get('minDate'),
        maxDate: parent.get('maxDate')
        });

     /* Use A Custom Format */
      if(this.get('formatSelection') !== null && $('#' + this.get('formatSelection')) !== null) {
        $('#' + this.get('formatSelection')).on("change", function() {
          let form = $(this).val();
          parent.$('#date').bootstrapMaterialDatePicker('setFormatDate', form);
        });
      }
    }

   Ember.run.next(function() {
      let icon = parent.$('.date-input-icon');
      let input = parent.$('.date-input');
      for(let i = 0; i < icon.length; i++) {
        icon[i].addEventListener('click', function() {
          input[i].focus();
        });
      }
    });
  }
});
