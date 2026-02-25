// tests/modal.test.js
const { createMockElement } = require('./setup');

describe('openSongPopup', () => {
  let mockPopup;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.isolateModules(() => {
      require('../js/modal.js');
    });
    mockPopup = createMockElement();
    document.getElementById.mockImplementation((id) => {
      if (id === 'song-selection-popup') {
        return mockPopup;
      }
      return null;
    });
  });

  test('should show the popup and populate the song list', () => {
    // Call the function
    window.openSongPopup();

    // Verify popup style and attributes
    expect(mockPopup.style.display).toBe('flex');
    expect(mockPopup.setAttribute).toHaveBeenCalledWith('aria-hidden', 'false');

    // Verify populateSongList was called
    expect(global.populateSongList).toHaveBeenCalled();
  });

  test('should add a click event listener to the popup after a timeout', () => {
    // In our setup.js, window.setTimeout is mocked to execute the callback immediately
    window.openSongPopup();

    expect(window.setTimeout).toHaveBeenCalledWith(expect.any(Function), 100);
    expect(mockPopup.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
  });

  test('should close popup when clicking outside content', () => {
    const mockPopupContent = createMockElement();
    document.querySelector.mockImplementation((selector) => {
      if (selector === '.popup-content') return mockPopupContent;
      return null;
    });
    mockPopupContent.contains.mockReturnValue(false); // Not containing the target

    window.openSongPopup();

    // Find the click handler added to the popup
    const clickHandler = mockPopup.addEventListener.mock.calls.find(call => call[0] === 'click')[1];

    // Simulate click outside
    clickHandler({ target: {} });

    expect(mockPopup.style.display).toBe('none');
    expect(mockPopup.setAttribute).toHaveBeenCalledWith('aria-hidden', 'true');
  });

  test('should NOT close popup when clicking inside content', () => {
    const mockPopupContent = createMockElement();
    document.querySelector.mockImplementation((selector) => {
      if (selector === '.popup-content') return mockPopupContent;
      return null;
    });
    mockPopupContent.contains.mockReturnValue(true); // Containing the target

    window.openSongPopup();

    const clickHandler = mockPopup.addEventListener.mock.calls.find(call => call[0] === 'click')[1];

    // Simulate click inside
    mockPopup.style.display = 'flex'; // Ensure it's flex before click
    clickHandler({ target: {} });

    expect(mockPopup.style.display).toBe('flex'); // Should remain flex
  });

  test('should do nothing if popup element is not found', () => {
    document.getElementById.mockImplementation(() => null);

    window.openSongPopup();

    expect(global.populateSongList).not.toHaveBeenCalled();
    expect(mockPopup.setAttribute).not.toHaveBeenCalled();
  });

  test('should register close button listener on DOMContentLoaded', () => {
    const domContentLoadedCall = document.addEventListener.mock.calls.find(call => call[0] === 'DOMContentLoaded');
    expect(domContentLoadedCall).toBeDefined();
    const callback = domContentLoadedCall[1];

    const mockCloseBtn = createMockElement();
    document.getElementById.mockImplementation((id) => {
      if (id === 'close-modal-btn') return mockCloseBtn;
      if (id === 'song-selection-popup') return mockPopup;
      return null;
    });

    callback();

    expect(mockCloseBtn.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));

    // Test that the registered callback calls closeSongPopup
    const closeCallback = mockCloseBtn.addEventListener.mock.calls[0][1];
    closeCallback();
    expect(mockPopup.style.display).toBe('none');
  });
});

describe('closeSongPopup', () => {
  let mockPopup;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.isolateModules(() => {
      require('../js/modal.js');
    });
    mockPopup = createMockElement();
    document.getElementById.mockImplementation((id) => {
      if (id === 'song-selection-popup') {
        return mockPopup;
      }
      return null;
    });
  });

  test('should hide the popup and remove event listener', () => {
    window.closeSongPopup();

    expect(mockPopup.style.display).toBe('none');
    expect(mockPopup.setAttribute).toHaveBeenCalledWith('aria-hidden', 'true');
    expect(mockPopup.removeEventListener).toHaveBeenCalledWith('click', expect.any(Function));
  });
});
