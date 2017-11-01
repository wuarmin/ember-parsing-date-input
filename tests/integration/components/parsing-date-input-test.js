import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import moment from 'moment';
import { find, fillIn, click } from 'ember-native-dom-helpers';

moduleForComponent('parsing-date-input', 'Integration | Component | date input', {
  integration: true
});

test('Rendered without any arguments, it displays the parsing-parsing-date-input-control', async function(assert) {
  assert.expect(3);
  await this.render(hbs`
    {{parsing-date-input}}
  `);
  assert.ok(find('.ember-parsing-date-input'), 'The parsing-parsing-date-input-wrapper is visible');
  assert.ok(find('.ember-parsing-date-input > input[type=text]'), 'The text-input is visible')
  assert.ok(!find('.ember-parsing-date-input').classList.contains('invalid'), 'The inital state is valid');
});

test('Rendered with argument `placeholder`, the parsing-parsing-date-input-control has an placeholder', async function(assert) {
  assert.expect(1);
  await this.render(hbs`
    {{parsing-date-input
      placeholder='Yesss!!'}}
  `);
  assert.equal(find('.ember-parsing-date-input > input[type=text]').placeholder, 'Yesss!!', 'The placeholder is shown');
});

test('Rendered with argument `value`, the parsing-parsing-date-input-control contains the value', async function(assert) {
  assert.expect(1);
  await this.render(hbs`
    {{parsing-date-input
      value='Invalid Date'}}
  `);
  assert.equal(find('.ember-parsing-date-input > input[type=text]').value, 'Invalid Date', 'The value is shown');
});

test('Rendered with argument `disabled`(true), the parsing-parsing-date-input-control is disabled', async function(assert) {
  assert.expect(1);
  await this.render(hbs`
    {{parsing-date-input
      value='Invalid Date'
      disabled=true}}
  `);
  assert.ok(find('.ember-parsing-date-input > input[type=text]').disabled, 'The input is disabled');
});

test('If a valid date is parsed during user input, the `onChange` action is triggered with the valid date', async function(assert) {
  assert.expect(3);
  this.didChange = function(date) {
    assert.ok(moment.isMoment(date), 'The passed date is a moment object')
    assert.ok(date.isValid(), 'The passed date is a valid moment object')
    assert.equal(date.format('YYYY-MM-DD'), '1998-12-12', 'The passed date matches `1998-12-12`');
  };
  await this.render(hbs`
    {{parsing-date-input
      value='Invalid Date'
      onChange=(action didChange)}}
  `);

  await click('.ember-parsing-date-input > input[type=text]')
  await fillIn('.ember-parsing-date-input > input[type=text]', '1998-12-12');
});

test('During parsing a loading-css-class-indicator is added', async function(assert) {
  assert.expect(2);
  await this.render(hbs`
    {{parsing-date-input
      value='Invalid Date'}}
  `);

  await click('.ember-parsing-date-input > input[type=text]')
  fillIn('.ember-parsing-date-input > input[type=text]', '1998-12-12');
  assert.ok(find('.ember-parsing-date-input').classList.contains('loading'), 'During date-parsing css-class `loading` is added');

  return wait().then(() => {
    assert.ok(!find('.ember-parsing-date-input').classList.contains('loading'), 'After date-parsing css-class `loading` is removed');
  });
});

test('If user inputs an invalid date, a invalid-css-class-indicator is added', async function(assert) {
  assert.expect(1);
  await this.render(hbs`
    {{parsing-date-input
      value='Invalid Date'}}
  `);

  await click('.ember-parsing-date-input > input[type=text]')
  await fillIn('.ember-parsing-date-input > input[type=text]', '1998-14-12');
  assert.ok(find('.ember-parsing-date-input').classList.contains('invalid'), 'Invalid-css-indicator is present');
});