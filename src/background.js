// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCookies") {
    chrome.cookies.getAll({ domain: request.domain }, (cookies) => {
      sendResponse({ cookies: cookies });
    });
    return true; // Indicates that the response is asynchronous
  }
});
