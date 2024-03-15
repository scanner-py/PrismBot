function calculateLevelXp(currentLevel, options = {}) {
  const { baseXp = 72, multiplier = 145 } = options;

  if (currentLevel === 0) return baseXp;

  if (currentLevel <= 15) return Math.floor(123 * currentLevel);

  if (currentLevel <= 25) return Math.floor(138 * currentLevel);

  if (currentLevel > 25) return Math.floor(multiplier * currentLevel);
}

module.exports = calculateLevelXp;
