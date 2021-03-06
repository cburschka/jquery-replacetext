/*!
 * jQuery replaceText
 *
 * Copyright 2015 Christoph Burschka <christoph@burschka.de>
 * This program is distributed under the terms of the MIT license.
 * Please see the LICENSE file for details.
 */
(function ($) {
  /**
   * Replace substrings with HTML.
   *
   * @param search A string or regular expression.
   * @param replace A string, or a DOM node, or a jQuery object,
   *                or an array of any of the above,
   *                or a function that returns any of the above.
   *                The function will receive the group captures as arguments.
   * @return the original jQuery object.
   */
  $.fn.replaceText = function (search, replace) {
    // This will be /undefined|/ for strings, with 0 groups.
    const width = RegExp(search.source + '|').exec('').length - 1;
    // Convert a static replacement value into a function that returns it.
    const rep = $.isFunction(replace) ? replace : () => replace;
    const clone = !$.isFunction(replace);

    /**
     * Helper function for processing a text node.
     *
     * The new content is inserted into the node's parent just before the node,
     * leaving everything after it unchanged to preserve the sibling traversal.
     *
     * @param node The text node being processed.
     * @return true or false, depending on whether any matches were found.
     */
    const textNode = node => {
      const tokens = node.nodeValue.split(search);
      if (tokens.length < 2) return false;

      // Render the matches and concatenate everything.
      let output = [];
      for (let i = 0; i + width + 1 < tokens.length; i += width + 1) {
        const child = rep.apply(this, tokens.slice(i + 1, i + 1 + width)) || '';
        output = output.concat(tokens[i], child);
      }
      output.push(tokens[tokens.length - 1]);

      // Combine runs of strings into text nodes.
      const nodes = [];
      let text = '';
      output.forEach(item => {
        if ($.type(item) !== 'string') {
          if (text) nodes.push(document.createTextNode(text));
          nodes.push(clone ? item.clone(true) : item);
          text = '';
        } else text += item;
      });
      if (text) nodes.push(document.createTextNode(text));

      // Prepend all nodes to the given node, which will be marked for removal.
      return $(node).before(nodes) && true;
    };

    return this.each(function () {
      const remove = [];
      for (let node = this.firstChild; node; node = node.nextSibling) {
        if (node.nodeType == document.TEXT_NODE && textNode(node)) {
          remove.push(node);
        }
      }
      $(remove).remove();
    });
  };
})(jQuery);
