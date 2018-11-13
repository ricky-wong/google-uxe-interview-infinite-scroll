//(function(scope) {

let requestInProgress = false;

/* Just a thought: (not implemented)
// To reduce network requests, fetch 100 (maximum) messages at once, but only
// display 20 at once. Store all messages in memory, then use indexes to determine
// which messages to display without any additional network request, until we
// have no more downloaded+undisplayed messages.
const MESSAGES_TO_FETCH_AT_ONCE = 100;
const MESSAGES_TO_SCROLL_AT_ONCE = 20;
let currentDisplayCount = 0;
let currentLoadedCount = 0;
*/

// Keep it simple. 10 messages at once, display once we fetch, don't store in memory.
const MESSAGES_TO_FETCH_AT_ONCE = 20;
let nextPageToken;
const messagesUl = document.getElementById('messages');

// Convenience functions to hide/show the loading spinner.
const loading = document.getElementById('loading');
function showLoading() {
  loading.style.display = 'block';
}
function hideLoading() {
  loading.style.display = 'none';
}

// Convenience functions to hide/show the loading error.
const loadingError = document.getElementById('loading-error');
// Use a variable here, to avoid constantly checking the DOM in this less-common case.
let loadingErrorShown = false;
function showLoadingError() {
  loadingErrorShown = true;
  loadingError.style.display = 'block';
}
function hideLoadingError() {
  if (loadingErrorShown) {
    loadingErrorShown = false;
    loadingError.style.display = 'none';
  }
}

// Takes care of the actual fetch() call and response
function fetchMessages() {
  return fetch('//message-list.appspot.com/messages'
    + '?limit=' + MESSAGES_TO_FETCH_AT_ONCE
    + (nextPageToken ? '&pageToken=' + nextPageToken : '')
  )
  .then(function(response) {
    if (!response.ok) {
      throw new Error('Fetch failed', response);
      return;
    }

    return response.json();
  })
  .then(function(data) {
    nextPageToken = data.pageToken;
    return data;
  })
  .catch(function(error) {
    return error;
  });
}

// Wrapper to be called many times.
// Takes care of in-flight requests and error handling
function maybeRequestMessages() {
  if (requestInProgress) {
    return;
  }
  requestInProgress = true;
  showLoading();
  hideLoadingError();
  fetchMessages()
  .then(function(data) {
    appendMessages(data.messages);
    requestInProgress = false;
    hideLoading();
    hideLoadingError();
  })
  .catch(function(error) {
    requestInProgress = false;
    hideLoading();
    showLoadingError();
    return error;
  });
}

function appendMessages(messages) {
  // Use a `fragment` to construct our DOM for all nodes, before appending to the DOM,
  // so that we don't add to the DOM 1 message at a time.
  const fragment = document.createDocumentFragment();
  messages.forEach((message) => {
    const li = document.createElement('li');
    li.classList.add('message');
    li.innerText = message.content;
    fragment.appendChild(li);
  });

  messagesUl.appendChild(fragment);

  return;
}

document.addEventListener('DOMContentLoaded', function() {
  maybeRequestMessages();
});

function nearBottom() {
  return (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 200;
}

function onScroll() {
  if (nearBottom()) {
    maybeRequestMessages();
  }
}
document.addEventListener('scroll', onScroll);
function onResize() {
  onScroll();
}
document.addEventListener('resize', onResize);

loadingError.addEventListener('click', maybeRequestMessages);

//})(self);
