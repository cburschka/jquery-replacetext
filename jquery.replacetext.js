/*!
 * jQuery replaceText
 *
 * Copyright 2015 Christoph Burschka <christoph@burschka.de>
 * This program is distributed under the terms of the MIT license.
 * Please see the LICENSE file for details.
 */
(function($){
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
  $.fn.replaceText = function(search, replace) {
    // This will be /undefined|/ for strings, with 0 groups.
    var capturing = RegExp(search.source + '|').exec('').length - 1;
    // Convert a static replacement value into a function that returns it.
    var rep = (typeof replace === 'function') ? replace : function() { return replace; };

    return this.each(function() {
      var remove = [];
      for (var node = this.firstChild; node; node = node.nextSibling)
        if (node.nodeType == document.TEXT_NODE)
          if (textNode(node, search, rep, capturing))
            remove.push(node);
      $(remove).remove();
    });
  }

  /**
   * Helper function for processing a text node.
   *
   * The new content is inserted into the node's parent just before the node,
   * leaving everything after it unchanged to preserve the sibling traversal.
   *
   * @param node The text node being processed.
   * @param search The original search argument.
   * @param replace The replacing function.
   * @param capturing The number of capturing groups of the search pattern.
   * @return true or false, depending on whether any matches were found.
   */
  var textNode = function(node, search, replace, capturing) {
    var tokens = node.nodeValue.split(search);
    if (tokens.length < 2) return false;

    // Render the matches and concatenate everything.
    var output = [];
    for (var i = 0; i+capturing+1 < tokens.length; i += capturing+1) {
      var child = replace.apply(this, tokens.slice(i+1, i+1+capturing)) || '';
      output = output.concat(tokens[i], child);
    }
    output.push(tokens[tokens.length-1]);

    // Combine runs of strings into text nodes.
    var nodes = [];
    var text = '';
    for (var i in output) {
      if (typeof output[i] === 'string') text += output[i];
      else {
        if (text) nodes.push(document.createTextNode(text));
        nodes.push(output[i].clone());
        text = '';
      }
    }
    if (text) nodes.push(document.createTextNode(text));

    // Prepend all nodes to the given node, which will be marked for removal.
    return $(node).before(nodes) && true;
  };
})(jQuery);
