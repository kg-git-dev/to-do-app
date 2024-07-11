export default {
    setupFiles: ['./jest.setup.js'],
    transform: {
      "^.+\\.jsx?$": "babel-jest"
    },
    testEnvironment: "node",
    moduleFileExtensions: ["js", "json", "jsx", "node"],
    transformIgnorePatterns: ["<rootDir>/node_modules/"],
    moduleNameMapper: {
      "\\.(css|less|scss|sss|styl)$": "<rootDir>/node_modules/jest-css-modules"
    }
  };
  