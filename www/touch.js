// Handle swiping of a single message.

(function(scope) {

const list = document.getElementById('messages');
const hammer = new Hammer(list, {
  // Default threshold of 10 is too sensitive. Figure out what creates the best UX.
  // Also need UI transition for the states:
  // 1. Sliding
  // 2. Past the threshold: we're going to delete
  // 2a. If we go back, then cancel?
  // 3. Deleting
  threshold: 150
});
hammer.on('swipe', function(e) {
  const li = e.target.closest('li.message');
  li.style.opacity = '0.4';
  li.remove();
});

})(self);
