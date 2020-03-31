/* eslint-disable @typescript-eslint/no-explicit-any */

import { RomiService, RomiTopic, skipValidation } from '../lib';

it('skips topic validation', () => {
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

it('skips service request validation', () => {
  let called = false;
  const topic: RomiService<any, any> = {
    service: 'test',
    type: 'test',
    validateRequest: () => (called = true),
    validateResponse: () => (called = true),
  };
  const skipped = skipValidation(topic);
  const result = skipped.validateRequest('something');
  expect(called).toBe(false);
  expect(result).toBe('something');
});

it('skips service response validation', () => {
  let called = false;
  const topic: RomiService<any, any> = {
    service: 'test',
    type: 'test',
    validateRequest: () => (called = true),
    validateResponse: () => (called = true),
  };
  const skipped = skipValidation(topic);
  const result = skipped.validateResponse('something');
  expect(called).toBe(false);
  expect(result).toBe('something');
});
