all: min replacetext.js

min: replacetext.min.js

%.js: src/%.js
	babel $< -o $@

%.min.js: src/%.js
	babel --no-comments --minified $< -o $@

