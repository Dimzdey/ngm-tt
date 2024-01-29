module.exports = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "tsconfig.json",
    "tsconfigRootDir": __dirname,
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint/eslint-plugin"],
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript"
  ],
  "root": true,
  "env": {
    "node": true,
    "jest": true
  },
  "settings": {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      "typescript": {
        "project": __dirname + "/src",
        "alwaysTryTypes": true,
      }
    }
  },
  "ignorePatterns": [".eslintrc.js", "contracts/**/*.yaml", "**.json"],
  "rules": {
    "import/no-named-as-default": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-duplicate-enum-values": "warn",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/no-confusing-non-null-assertion": "warn",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/method-signature-style": "warn",
    "no-unreachable": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_",
      "caughtErrorsIgnorePattern": "^_"
    }],
    "@typescript-eslint/prefer-optional-chain": ["error"],
    "@typescript-eslint/switch-exhaustiveness-check": ["error"],
    "@typescript-eslint/array-type": "warn",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "no-return-await": "warn",
    "no-var": "warn",
    "no-const-assign": "warn",
    "no-dupe-class-members": "warn",
    "no-duplicate-imports": ["warn", {
      "includeExports": true
    }],
    "prefer-const": "warn",
    "no-dupe-args": "warn",
    "no-dupe-keys": "warn",
    "no-duplicate-case": "warn",
    "no-empty": "warn",
    "sort-vars": ["warn", {
      "ignoreCase": true
    }],
    "spaced-comment": ["warn", "always"],
    "no-lonely-if": "warn",
    "no-multi-assign": "warn",
    "no-unneeded-ternary": "warn",
    "lines-between-class-members": ["error", "always", {
      "exceptAfterSingleLine": true
    }],
    "import/order": ["error", {
      "groups": ["builtin", "external", "internal", ["sibling", "parent"], "index", "unknown"],
      "newlines-between": "always",
      "alphabetize": {
        "order": "asc",
        "caseInsensitive": true
      }
    }]
  }
}



