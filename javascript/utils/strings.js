export function getSubStrings(string, substring) {
  const output = [];
  let tmpString = "";
  for (let i = 0; i < string.length; ) {
    if (substring[0].toLowerCase() === string[i].toLowerCase()) {
      const slice = string.slice(i, i + substring.length);
      if (slice.toLowerCase() === substring.toLowerCase()) {
        output.push({ text: tmpString, type: "TEXT" });
        output.push({ text: slice, type: "SUBSTRING" });
        i += substring.length;
        tmpString = "";
      } else {
        tmpString += string[i];
        i += 1;
      }
    } else {
      tmpString += string[i];
      i += 1;
    }
  }
  output.push({ text: tmpString, type: "TEXT" });
  return output;
}

export function capitalizeFirstLetter(string, separator = " ") {
  const words = string.split(separator);
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  const capitalizedString = capitalizedWords.join(" ");
  return capitalizedString;
}

export const camelCaseSeparator = (
  str = "",
  latterCase = "FIRST",
  separator = " "
) => {
  switch (latterCase) {
    case "FIRST":
      str = str.slice(0, 1).toUpperCase() + str.slice(1);
      return str
        .replace(/([a-z])([A-Z])/g, "$1" + separator + "$2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1" + separator + "$2");
    case "LOWER":
      return str
        .replace(/([a-z])([A-Z])/g, "$1" + separator + "$2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1" + separator + "$2")
        .toLowerCase();
    case "UPPER":
      return str
        .replace(/([a-z])([A-Z])/g, "$1" + separator + "$2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1" + separator + "$2")
        .toUpperCase();
    case "NONE":
    default:
      return str
        .replace(/([a-z])([A-Z])/g, "$1" + separator + "$2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1" + separator + "$2");
  }
};
