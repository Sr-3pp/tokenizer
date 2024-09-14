# Tokenizer

## How to use it?

```javascript
import tokenizer from 'json-to-var';

//You can have a folder inside your project with json files and build this array dinamicly.

const jsonTokens = [
  {
    "color": {
      "background": "#FF4C4C",
      "foreground": "#FFF"
    }
  },
  {
    "font": {
      "sans-serif": "Arial"
      "serif": "Times"
    }
  }
];

//tokenizer.toJs(inputArray) will convert all your keys and values to a javascript constants ready to import in your project.
const jsVars = tokenizer.toJS(jsonTokens);

/*output string example:
export const colorBackground = "#FF4C4C";
...
*/

//Save your variables into a file.
const destinationDir = "./assets";
const fileName = "tokens.js";
tokenizer.makeFile(destinationDir, fileName, jsVars);
```

## Available formats

- JS (toJS)
- CSS (toCss)
- SCSS (toScss)
- FlattedJson (toJson)

This project was created using `bun init` in bun v1.0.13. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
