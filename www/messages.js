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
const MESSAGES_TO_FETCH_AT_ONCE = 10;
let nextPageToken;
const messagesUl = document.getElementById('messages');

function fetchMessages() {
  return fetch('//message-list.appspot.com/messages'
    + '?limit=' + MESSAGES_TO_FETCH_AT_ONCE
    + (nextPageToken ? '&pageToken=' + nextPageToken : '')
  )
  .then(function(response) {
    if (response.status !== 200) {
      return;
    }

    return response.json();
  })
  .then(function(data) {
    nextPageToken = data.pageToken;
    return data;
  });
}

function maybeRequestMessages() {
  if (requestInProgress) {
    return;
  }
  requestInProgress = true;
  fetchMessages().then(function(data) {
    appendMessages(data.messages);
    requestInProgress = false;
  });
}

function appendMessages(messages) {
  // Use a `fragment` to construct our DOM for all nodes, before appending to the DOM,
  // so that we don't add to the DOM 1 message at a time.
  const fragment = document.createDocumentFragment();
  messages.forEach((message) => {
    const li = document.createElement('li');
    li.innerText = message.content;
    fragment.appendChild(li);
  });

  messagesUl.appendChild(fragment);

  return;
}

//})(self);
