const base = require("./.eslintrc.cjs");

module.exports = {
  ...base,
  plugins: [...(base.plugins || []), "security"],
  rules: {
    ...(base.rules || {}),
    "security/detect-unsafe-regex": "error",
    "security/detect-non-literal-regexp": "error",
    "security/detect-possible-timing-attacks": "error",
    "security/detect-object-injection": "off",
    "security/detect-non-literal-fs-filename": "off",
    "security/detect-child-process": "off",
    "security/detect-eval-with-expression": "off",
    "security/detect-non-literal-require": "off",
  },
};
