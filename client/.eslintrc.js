module.exports = {
  extends: ["react-app"],
  rules: {
    // Turn off unused variable warnings
    "no-unused-vars": "warn",
    // Turn off React Hook dependency warnings
    "react-hooks/exhaustive-deps": "warn",
  },
  // Configure proper environment
  env: {
    browser: true,
    node: true,
    es6: true,
  },
} 