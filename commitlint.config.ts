module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Enforce type to be one of the allowed enums
    "type-enum": [
      2,
      "always",
      ["build", "chore", "ci", "docs", "feat", "fix", "perf", "refactor", "revert", "style", "test", "button"],
    ],
    // Enforce lowercase type
    "type-case": [2, "always", "lower-case"],
    // Enforce the start of the subject to be capitalized
    "subject-case": [
      2,
      "always",
      [
        "sentence-case", // Capitalizes the first letter of the subject
      ],
    ],
    "header-min-length": [2, "always", 10],
    "header-max-length": [1, "always", 72],
  },
  plugins: [
    {
      rules: {
        "header-case-start-capital": ({ raw }: { raw: string }) => {
          return [/^[A-Z]/.test(raw), "Commit message must start with a capital letter"];
        },
        "subject-case": ({ raw }: { raw: string }) => {
          const regex = /^([a-z]+): (.+)$/m; // Adjusted regex for multi-line and trimming
          const match = raw.trim().match(regex); // Adjusted regex
          if (!match) {
            return [false, 'Commit message must follow the format "type: Subject"'];
          }

          const subject = match[2]; // 'Add husky feature'
          return [/^[A-Z]/.test(subject), "Commit subject must start with a capital letter"];
        },
      },
    },
  ],
};
