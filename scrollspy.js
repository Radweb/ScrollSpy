var ScrollSpy = (function() {

  /**
   * @class
   */
  var ScrollSpy = function(options) {
    this.options = mergeCustomOptions(this.defaults, options);

    document.addEventListener('DOMContentLoaded', function() {
      this.syncElementPositions();
      this.bootWindowListeners();
      this.highlightElementsInViewport();
    }.bind(this));
  };

  ScrollSpy.prototype.defaults = {
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
    blockSelector: function() {},

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
    linkSelector: function(id) {},

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
  };

  /**
   * Window event listeners
   */
  ScrollSpy.prototype.bootWindowListeners = function() {
    window.addEventListener('resize', function() {
      this.syncElementPositions();
      this.highlightElementsInViewport();
    }.bind(this));

    window.addEventListener('scroll', this.highlightElementsInViewport.bind(this));
  };

  /**
   * Find positions of all elements defined from the "blockSelector"
   */
  ScrollSpy.prototype.syncElementPositions = function() {
    this.elements = select(this.options.blockSelector()).map(function(el) {
      return {
        link: document.querySelector(this.options.linkSelector(el.id)),
        top: el.offsetTop,
        bottom: el.offsetTop + el.offsetHeight
      };
    }.bind(this));
  };

  /**
   * Find all watched elements in the viewport and call "toggleClass" on them
   */
  ScrollSpy.prototype.highlightElementsInViewport = function() {
    var viewport = {
      top: window.scrollY,
      bottom: window.scrollY + window.innerHeight
    };

    this.elements.forEach(function(block) {
      var isInView = this.isInViewport(viewport, block);

      this.options.toggleClass(block.link, isInView, this.options.classToToggle());
    }.bind(this));
  };

  /**
   * Given two objects - Viewport and Element (containing "top" and "bottom" keys),
   * will return whether the element can be visible within the viewport.
   *
   * @param {object} viewportPosition  Keys "top" and "bottom" define position
   * @param {object} elementPosition   Keys "top" and "bottom" define position
   * @returns {boolean}
   */
  ScrollSpy.prototype.isInViewport = function(viewportPosition, elementPosition) {
    var vTop = viewportPosition.top,
        vBot = viewportPosition.bottom,
        eTop =  elementPosition.top,
        eBot =  elementPosition.bottom;

    return (

      //   Case A: Bottom Showing
      //
      //         ----------         <-- eTop
      //        |xxxxxxxxxx|
      //        |xxxxxxxxxx|
      //        |xxxxxxxxxx|
      //    ----|xxxxxxxxxx|----    <-- vTop
      //   |    |xxxxxxxxxx|    |
      //   |    |xxxxxxxxxx|    |
      //   |     ----------     |   <-- eBot
      //   |                    |
      //   |                    |
      //   |                    |
      //   |                    |
      //   |                    |
      //   |                    |
      //   |                    |
      //   |                    |
      //   |                    |
      //   |                    |
      //    --------------------    <-- vBot

        (eTop <= vTop && eBot > vTop) ||



      //       Case B: Encased
      //
      //    --------------------    <-- vTop
      //   |                    |
      //   |                    |
      //   |     ----------     |   <-- eTop
      //   |    |xxxxxxxxxx|    |
      //   |    |xxxxxxxxxx|    |
      //   |    |xxxxxxxxxx|    |
      //   |    |xxxxxxxxxx|    |
      //   |    |xxxxxxxxxx|    |
      //   |    |xxxxxxxxxx|    |
      //   |     ----------     |   <-- eBot
      //   |                    |
      //   |                    |
      //   |                    |
      //    --------------------    <-- vBot

        (eTop > vTop && eBot < vBot) ||



      //     Case C: Top Showing
      //
      //    --------------------    <-- vTop
      //   |                    |
      //   |                    |
      //   |                    |
      //   |                    |
      //   |                    |
      //   |                    |
      //   |                    |
      //   |                    |
      //   |                    |
      //   |                    |
      //   |     ----------     |   <-- eTop
      //   |    |xxxxxxxxxx|    |
      //   |    |xxxxxxxxxx|    |
      //    ----|xxxxxxxxxx|----    <-- vBot
      //        |xxxxxxxxxx|
      //        |xxxxxxxxxx|
      //        |xxxxxxxxxx|
      //         ----------         <-- eBot

        (eTop > vTop && eTop < vBot) ||



      //      Case D: Covering
      //
      //         ----------         <-- eTop
      //        |xxxxxxxxxx|
      //    ----|xxxxxxxxxx|----    <-- vTop
      //   |    |xxxxxxxxxx|    |
      //   |    |xxxxxxxxxx|    |
      //   |    |xxxxxxxxxx|    |
      //   |    |xxxxxxxxxx|    |
      //   |    |xxxxxxxxxx|    |
      //   |    |xxxxxxxxxx|    |
      //   |    |xxxxxxxxxx|    |
      //   |    |xxxxxxxxxx|    |
      //   |    |xxxxxxxxxx|    |
      //   |    |xxxxxxxxxx|    |
      //   |    |xxxxxxxxxx|    |
      //   |    |xxxxxxxxxx|    |
      //   |    |xxxxxxxxxx|    |
      //    ----|xxxxxxxxxx|----    <-- vBot
      //        |xxxxxxxxxx|
      //         ----------         <-- eBot

        (eTop > vTop && eTop < vBot)

    );
  }


  /**
   * A small helper method to return an _array_ of DOM elements from a selector
   *
   * @param {string} selector
   * @returns {HTMLElement[]} An array of DOM elements
   */
  function select(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  };

  /**
   * Given defaults and custom overrides, return an object combining them
   *
   * @param {object} defaults
   * @param {object} custom
   * @returns {object} The combined inputs
   */
  function mergeCustomOptions(defaults, custom) {
    var options = {};

    for (key in defaults) {
      if (custom[key] === undefined) {
        options[key] = defaults[key];
      }
      else {
        options[key] = custom[key];
      }
    }

    return options;
  };


  return ScrollSpy;

})();
