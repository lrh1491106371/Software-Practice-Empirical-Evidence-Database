export const SE_PRACTICES: string[] = [
  "TDD",
  "Code Review",
  "Pair Programming",
  "CI/CD",
  "Refactoring",
  "Static Analysis",
];

export const PRACTICE_TO_CLAIMS: Record<string, string[]> = {
  TDD: [
    "Improves code quality",
    "Reduces defects",
    "Slows initial development",
  ],
  "Code Review": [
    "Finds defects earlier",
    "Improves knowledge sharing",
  ],
  "Pair Programming": [
    "Improves design quality",
    "Increases development cost",
  ],
  "CI/CD": [
    "Reduces integration issues",
    "Increases deployment frequency",
  ],
  Refactoring: [
    "Improves maintainability",
    "Increases short-term effort",
  ],
  "Static Analysis": [
    "Detects bugs early",
    "Improves code consistency",
  ],
};
