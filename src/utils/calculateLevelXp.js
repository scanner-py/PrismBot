function calculateLevelXp(currentLevel, options = {}) {
  const { baseXp = 72, multiplier = 143 } = options;

  if (currentLevel === 0) return baseXp;

  if (currentLevel <= 25) return Math.floor(133 * currentLevel);

  if (currentLevel > 25) return Math.floor(multiplier * currentLevel);
}

module.exports = calculateLevelXp;
