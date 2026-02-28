// js/modal.test.js

const createMockElement = () => ({
  style: {},
  setAttribute: jest.fn(),
  getAttribute: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  contains: jest.fn(),
  innerHTML: '',
  appendChild: jest.fn(),
  dataset: {},
});

const mockPopup = createMockElement();
const mockPopupContent = createMockElement();
const mockCloseBtn = createMockElement();
const mockUl = createMockElement();

global.document = {
  getElementById: jest.fn((id) => {
    if (id === 'song-selection-popup') return mockPopup;
    if (id === 'close-modal-btn') return mockCloseBtn;
    if (id === 'predefined-songs') return mockUl;
    return null;
  }),
  querySelector: jest.fn((selector) => {
    if (selector === '.popup-content') return mockPopupContent;
    return null;
  }),
  addEventListener: jest.fn(),
  createElement: jest.fn(() => createMockElement()),
};

global.window = {
  addEventListener: jest.fn(),
  currentVisualization: null,
  loadAudioFromUrl: jest.fn(),
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ tracks: [] }),
  })
);

global.setTimeout = jest.fn((cb) => cb());

// Mocking window properties that the script expects
global.window.openSongPopup = null;
global.window.closeSongPopup = null;
global.window.populateSongList = null;
global.window.handleOutsideClick = null;

describe('js/modal.js', () => {
  let modal;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    mockPopup.style.display = '';
    modal = require('./modal');
  });

  test('openSongPopup sets style and calls populateSongList', () => {
    modal.openSongPopup();
    expect(mockPopup.style.display).toBe('flex');
    expect(mockPopup.setAttribute).toHaveBeenCalledWith('aria-hidden', 'false');
  });

  test('closeSongPopup sets style', () => {
    modal.closeSongPopup();
    expect(mockPopup.style.display).toBe('none');
    expect(mockPopup.setAttribute).toHaveBeenCalledWith('aria-hidden', 'true');
    expect(mockPopup.removeEventListener).toHaveBeenCalledWith('click', modal.handleOutsideClick);
  });

  test('handleOutsideClick closes popup if clicked outside', () => {
    const event = { target: {} };
    mockPopupContent.contains.mockReturnValue(false);

    mockPopup.style.display = 'flex';
    modal.handleOutsideClick(event);
    expect(mockPopup.style.display).toBe('none');
  });

  test('handleOutsideClick does not close popup if clicked inside', () => {
    const event = { target: {} };
    mockPopupContent.contains.mockReturnValue(true);

    mockPopup.style.display = 'flex';
    modal.handleOutsideClick(event);
    expect(mockPopup.style.display).toBe('flex');
  });

  test('DOMContentLoaded attaches listener to close button', () => {
    // We need to find the call from the current 'require'
    const calls = global.document.addEventListener.mock.calls;
    const domContentLoadedCall = calls.find(call => call[0] === 'DOMContentLoaded');
    expect(domContentLoadedCall).toBeDefined();

    const callback = domContentLoadedCall[1];
    callback();

    expect(global.document.getElementById).toHaveBeenCalledWith('close-modal-btn');
    expect(mockCloseBtn.addEventListener).toHaveBeenCalledWith('click', modal.closeSongPopup);
  });

  test('populateSongList fetches data and populates UL', async () => {
    const mockData = {
      tracks: [
        { title: 'Song 1', filename: 'song1.mp3', viz: 'spiral' }
      ]
    };
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      })
    );

    modal.populateSongList();

    // Flush microtasks
    await Promise.resolve(); // for fetch
    await Promise.resolve(); // for first then (json)
    await Promise.resolve(); // for second then (data)
    await Promise.resolve(); // just in case

    expect(global.fetch).toHaveBeenCalledWith('data/music-metadata.json');
    expect(mockUl.appendChild).toHaveBeenCalled();
  });
});
