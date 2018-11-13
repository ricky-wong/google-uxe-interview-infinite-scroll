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

function formatTime(timestamp) {
  const then = new Date(timestamp).getTime();
  const now = new Date().getTime();
  // For testing purposes, pretend that the current time is closer to the actual messages,
  // so that we can see more relative times in action.
  //const now = new Date('2015-02-01T07:47:24Z').getTime();

  // Say "ago"... but if this message is from the future, say it's from the future
  const ending = (now - then) < 0 ? ' in the future' : ' ago';

  const ms = Math.abs(now - then);
  const seconds = Math.round(ms / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);
  const years = Math.round(weeks / 52);

  // If it's 1 hour ago or more, it might be useful for us to just return
  // an absolute time. We don't really have a spec on this.
  if (years > 0) {
    return years + ' year' + (years > 1 ? 's' : '') + ending;
  } else if (weeks > 0) {
    return weeks + ' week' + (weeks > 1 ? 's' : '') + ending;
  } else if (days > 0) {
    return days + ' day' + (days > 1 ? 's' : '') + ending;
  } else if (hours > 0) {
    return hours + ' hour' + (hours > 1 ? 's' : '') + ending;
  } else if (minutes > 0) {
    return minutes + ' minute' + (minutes > 1 ? 's' : '') + ending;
  } else {
    return seconds + ' second' + (seconds > 1 ? 's' : '') + ending;
  }
}

// Takes care of the actual fetch() call and response
function fetchMessages() {
  return fetch('https://message-list.appspot.com/messages'
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
    // It's unsafe to put externally-provided data into innerHTML,
    // but this isn't a secure application, and we trust the source (for now).
    li.innerHTML = `
    <div class="userinfo">
      <img class="left photo" src="https://message-list.appspot.com${message.author.photoUrl}"/>
      <div class="name">${message.author.name}</div>
      <div class="timestamp">${formatTime(message.updated)}</div>
    </div>
    <div class="message-content">
      ${message.content}
    </div>
    `;
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
