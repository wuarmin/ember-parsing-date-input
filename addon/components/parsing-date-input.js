import Component from '@ember/component';
import { computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import moment from 'moment';
import layout from '../templates/components/parsing-date-input';

export default Component.extend({
  layout,
  
  classNames: ['ember-parsing-date-input'],
  classNameBindings: ['isLoading:loading', 'isInvalid:invalid'],
  value: null,
  formats: ['YYYYMMDD', 'YYYY-MM-DD'],
  timeout: 600,

  _currentDate: null,

  isLoading: computed('parseDateTask.isRunning', function() {
    return this.get('parseDateTask.isRunning');
  }),

  isInvalid: computed('isValid', function() {
    if(!this.get('_currentDate')) {
      return false;
    }
    return !moment(this.get('_currentDate')).isValid();
  }),

  parseDateTask: task(function* (dateString) {
    yield timeout(this.get('timeout'));
    this.set('_currentDate', moment(dateString, this.get('formats'), true));
    if(this.get('_currentDate').isValid()) {
      this.sendAction('onChange', this.get('_currentDate'));
    }
  }),
})