import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
  Config,
} from "unique-names-generator";

const config: Config = {
  dictionaries: [adjectives, colors, animals],
  length: 3,
  separator: " ",
  style: "capital",
};

export const generateNickname = () => {
  return uniqueNamesGenerator(config);
};
