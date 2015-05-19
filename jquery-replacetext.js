(function($){
  var textNode = function(node, search, replace, capturing) {
    var tokens = node.nodeValue.split(search);
    if (tokens.length < 2) return false;
    for (var i = 0; i+capturing+1 < tokens.length; i += capturing+1) {
      $(node).before(document.createTextNode(tokens[i]));
      $(node).before(replace(tokens.slice(i+1, i+1+capturing)));
    }
    $(node).before(document.createTextNode(tokens[tokens.length-1]));
    return true;
  };

  /**
   * Replace substrings with HTML.
   *
   * @param node A text node.
   * @param search A RegExp object.
   * @param replace A function that generates the replacement jQuery content.
   */
  $.fn.replaceText = function(search, replace) {
    var capturing = RegExp(search.source + '|').exec('').length - 1;
    return this.each(function() {
      var remove = [];
      for (var node = this.firstChild; node; node = node.nextSibling) {
        if (node.nodeType == document.TEXT_NODE && textNode(node, search, replace, capturing)) {
          remove.push(node);
        }
      }
      $(remove).remove();
    });
  }
})(jQuery);
