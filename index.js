export default class tokenizer {
  constructor() {}

  static formatKey(key, fromat) {
    const _key = key.replace(/\.value/g, "");
    switch (fromat) {
      case "kebab":
        return _key.replace(/\./g, "-");
      case "camel":
        const camelKey = _key
          .split(".")
          .map(
            (word, i) =>
              `${
                i > 0
                  ? `${word[0].toUpperCase()}${word
                      .substring(1)
                      .replace(/-/g, "")}`
                  : word
              }`
          )
          .join("");
        return camelKey;
      case "pascal":
        console.log(_key);
        const pascalKey = _key
          .split(".")
          .map(
            (word) =>
              `${word[0].toUpperCase()}${word.substring(1).replace(/-/g, "")}`
          )
          .join("");

        return pascalKey;
      case "snake":
        return _key.replace(/\./g, "_");
      default:
        return _key;
    }
  }

  static getValue(value, lang) {
    if (typeof value === "string") {
      if (lang === "css") {
        return `${
          value.includes("#") || value.includes("rgb") || value.includes("px")
            ? value
            : `"${value}"`
        }`;
      }
      return `"${value}"`;
    } else {
      return value;
    }
  }

  static parseInputs(inputs, keyFormat = "kebab") {
    const flatObject = (obj) => {
      let result = {};

      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === "object") {
            let flattedObject = flatObject(obj[key]);
            for (let key2 in flattedObject) {
              if (flattedObject.hasOwnProperty(key2)) {
                result[`${key}.${key2}`] = flattedObject[key2];
              }
            }
          } else {
            result[key] = obj[key];
          }
        }
      }

      return result;
    };

    let flattedObj = {};
    for (let obj of inputs) {
      const result = flatObject(obj);
      const realObject = {};
      Object.keys(result).forEach((key) => {
        const realKey = this.formatKey(key, keyFormat);
        realObject[realKey] = result[key];
      });

      flattedObj = { ...flattedObj, ...realObject };
    }

    return flattedObj;
  }

  static toJs(inputs, keyFormat = "camel") {
    const parsedInputs = this.parseInputs(inputs, keyFormat);
    const jsVars = Object.entries(parsedInputs).map(
      ([key, value]) => `export const ${key} = ${this.getValue(value)};`
    );
    return jsVars.join("\n");
  }

  static toScss(inputs, keyFormat = "kebab") {
    const parsedInputs = this.parseInputs(inputs, keyFormat);
    const scssVars = Object.entries(parsedInputs).map(
      ([key, value]) => `$${key}: ${this.getValue(value, "css")};`
    );
    return scssVars.join("\n");
  }

  static toCss(inputs, keyFormat = "kebab") {
    const parsedInputs = this.parseInputs(inputs, keyFormat);
    const cssVars = [
      ":root {",
      ...Object.entries(parsedInputs).map(
        ([key, value]) => `--${key}: ${this.getValue(value, "css")};`
      ),
      "}",
    ];
    return cssVars.join("\n");
  }

  static toJson(inputs) {
    return this.parseInputs(inputs);
  }

  static makeFile(dir, fileName, data) {
    const fs = require("fs");
    if (!fs.existsSync(dir)) {
      const path = require("path");
      const dirPath = path.resolve(dir);
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(`${dir}/${fileName}`, data, "utf8");
  }
}
