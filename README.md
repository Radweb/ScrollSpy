[<img src="http://i.imgur.com/Qslhr5z.png" align="right" height="40">](http://radweb.co.uk)

# ScrollSpy

_Looking for a better name..._

Highlight links in your navigation as the content scrolls in your viewport.

[View Demo](https://radweb.github.io/ScrollSpy)

### Usage

* Include `scrollspy.js`
* Initialise:

```js
new ScrollSpy({
  blockSelector: function() {
    return 'article';  // target all <article> elements (they must have an ID)
  },
  linkSelector: function(id) {
    return 'nav a[href="#'+id+'"]';  // match up ID on <article> to a link to highlight
  }
});
```

That's it!

### Configuration

Available options to provide when initialising `ScrollSpy`. Only the two shown above (`blockSelector` and `linkSelector` are required).

```js
/**
 * Should return a selector string which will find all the elements
 * in the DOM you want to watch their position of within the viewport.
 *
 * For example, if you had a sidebar of "chapters" in a book, and the
 * body of the page consisted of the entire contents, each chapter wrapped
 * in <article class="chapter">, you would return "article.chapter".
 *
 * @returns {string}
 */
blockSelector: function() {
  return 'article.chapter';
},

/**
 * Should return a selector string which will find the link associated
 * with the a block on the page.
 *
 * Continuing the "chapters" example, if "id" is "chapter-introduction", you
 * may return ".sidebar a[href='#chapter-introduction']"
 *
 * By default, an "active" class will be toggled on the element targeted
 * from your selector - you can override either the class or method below.
 *
 * @returns {string}
 */
linkSelector: function(id) {
  return '.sidebar a[href="#'+id+'"]';
},

/**
 * The class to toggle on the activated "link"
 *
 * @returns {string}
 */
classToToggle: function() {
  return 'active';
},

/**
 * This method allows you to customise _how_ the class is toggled on the
 * associated "link" with a block in the viewport.
 *
 * By default, we toggle the class on the element itself.
 *
 * @param {HTMLElement} el       The "link" to highlight
 * @param {boolean} isInView     Should you show or hide the highlight
 * @param {string} classToToggle
 */
toggleClass: function(el, isInView, classToToggle) {
  if (isInView) {
    el.classList.add(classToToggle);
  }
  else {
    el.classList.remove(classToToggle);
  }
}
```
