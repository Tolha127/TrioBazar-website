// This is a simple polyfill for the 'process' global in browser environments
window.process = window.process || {};
window.process.browser = true;
window.process.env = window.process.env || {};

// Export the process object
export default window.process;
