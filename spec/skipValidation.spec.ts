import { RomiTopic, skipValidation } from '../lib';

it('skips validation', () => {
  let called = false;
  const topic: RomiTopic<any> = {
    topic: 'test',
    type: 'test',
    validate: () => (called = true),
  };
  const skipped = skipValidation(topic);
  const result = skipped.validate('something');
  expect(called).toBe(false);
  expect(result).toBe('something');
});
