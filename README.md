Infinitely-Scrolling Message List
===

Limited functionality: Messages load over the network, and you can load more messages from scrolling. All done with native JS, no libraries to keep it lean while features are still simple.

Not done: swipe to remove a message. Might need to involve some libraries for this.

Process:
1. I started with looking through Firebase and App Engine docs to figure out how to bootstrap a static site. Because I'm just serving some HTML/CSS/JS (no backend, database, authentication...), I went with App Engine.
2. I then started a Git repository with my bare project. To develop locally, I chose to use Node.js's `http-server` while in my `www` directory, which simply serves the content of the directory.
3. (Git logs mostly show my process from here.) I started by getting fetches to work and appending messages to DOM - no styles, timestamps, usernames, photos, scrolling/eventing, or error handling.
4. I filled in styles for messages and the navbar. At this point, I could/should probably just style the usernames/timestamps/photos, too.
5. I added loading spinners and error handling for the API call. I decided to leave static elements on the page, and show/hide them. The error handling itself is a bit messy - I'm still getting used to ES6 promises and `fetch()`.
6. I wrote this document up to this point, mostly derived from my Git logs. If I didn't have those logs, I probably would've started even sooner.
6. I finally filled in usernames/timestamps/photos. I had to come up with conversions from absolute to relative time, and it was a bit problematic that all of the sample data referenced chats around February 2015. To test, I could've written some tests, but alternatively, I just set my "now" time to February 2015, and we get a nicer flavor of the time-conversion in action.
7. For the horizontal swipe feature, I'd start by Googling around for libraries to detect a swipe, and add some transition animation. There were bits and pieces everywhere, and I struggled to get `dragstart` to fire in Chrome (worked in Firefox). I went with a simple Hammer.js solution to detect a swipe and remove the message, but we need a lot of UI/UX added here (noted in code). The user should see a slow transition for "dragging", "going to delete this", and "deleting" states.
8. Wrapping up the submission (this document, uploading source, hosting a demo)

Some things I'd do with more time:
- Finish the swipe feature.
- Don't leave a big `innerHTML` security hole.
- Organize code a little more. There are a few different responsibilities here, already.
- Next level of organizing code could involve using a framework for storing messages in a collection, and rendering views of messages based on data. However, our requirements are quite simple, we don't have much interactivity, and our collection of messages doesn't change very much.
- Recalculate relative timestamps as the page stays open.
- If the message is older than 1 hour, it might be useful for us to just show an absolute time. We don't really have a spec on this.
- Figure out the best practice for catching network errors in ES6 Promises, without catching everything (non-network errors).
