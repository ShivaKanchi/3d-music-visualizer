// tests/setup.js

const createMockElement = () => ({
  style: {},
  setAttribute: jest.fn(),
  getAttribute: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  classList: {
    add: jest.fn(),
    remove: jest.fn(),
    contains: jest.fn(),
    toggle: jest.fn(),
  },
  appendChild: jest.fn(),
  removeChild: jest.fn(),
  innerHTML: '',
  dataset: {},
  contains: jest.fn(),
});

global.window = global;

global.document = {
  getElementById: jest.fn(),
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(() => []),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  createElement: jest.fn(() => createMockElement()),
};

global.setTimeout = jest.fn((callback) => callback());

// Mock other globals that might be used
global.AudioContext = jest.fn();
global.webkitAudioContext = jest.fn();
global.populateSongList = jest.fn();

module.exports = { createMockElement };
