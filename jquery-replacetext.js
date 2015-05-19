(function($){
  var textNode = function(node, search, replace, capturing) {
    var tokens = node.nodeValue.split(search);
    if (tokens.length < 2) return false;

    // Render the matches and concatenate everything.
    var output = [];
    for (var i = 0; i+capturing+1 < tokens.length; i += capturing+1) {
      var child = replace(tokens.slice(i+1, i+1+capturing)) || '';
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
        nodes.push(output[i]);
        text = '';
      }
    }
    if (text) nodes.push(document.createTextNode(text));

    // Prepend all nodes to the given node, which will be marked for removal.
    return $(node).before(nodes);
  };

  /**
   * Replace substrings with HTML.
   *
   * @param search A string or regular expression.
   * @param replace A string, or a DOM node, or a jQuery object,
   *                or an array of any of the above,
   *                or a function that returns any of the above.
   *                The function will receive the group captures as an argument.
   * @return the original jQuery object.
   */
  $.fn.replaceText = function(search, replace) {
    // This will be /undefined|/ for strings, with 0 groups.
    var capturing = RegExp(search.source + '|').exec('').length - 1;
    // Convert a non-function into a function that returns the value.
    var rep = (typeof replace === 'function') ? replace : function() { return replace; };

    return this.each(function() {
      var remove = [];
      for (var node = this.firstChild; node; node = node.nextSibling) {
        if (node.nodeType == document.TEXT_NODE && textNode(node, search, rep, capturing)) {
          remove.push(node);
        }
      }
      $(remove).remove();
    });
  }
})(jQuery);
