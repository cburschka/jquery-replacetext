# jQuery replaceText

This jQuery plugin searches the text-node children of all elements in a jQuery
object, and replaces matched substrings with new content. The new content can
either be text or DOM nodes.

## Usage

### .replaceText( search, replace );

#### search

Type: **String** or **RegExp**

What to search for.

#### replace

Type: **String** or **Element** or **Array** or **jQuery**

The content that will be inserted in place of the matched substrings. A **String**
value will be inserted in the text node; any other content will split the text node
and be inserted between the parts.

Note: HTML code in a **String** argument is not evaluated.

### .replaceText( search, function );

#### search

Type: **String** or **RegExp**

What to search for.

#### function

Type: **Function**( **String** match1, ... , **String** matchN ) =>
     (**String** or **Element** or **Array** or **jQuery**)

A function that returns the replacement value, which is interpreted in the same
way as a static replacement value.

If the search argument is a **RegExp** with parenthesized groups, then the
function will receive these groups as arguments.

Note: The full substring match is *not* included unless the entire regular
expression is parenthesized.
