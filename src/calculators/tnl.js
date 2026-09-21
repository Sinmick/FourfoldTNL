export function totalExpForLevel(level) {
  return (5 / 3) * (level ** 3 - level);
}

export function expToNextLevel(level) {
  return 5 * level * (level + 1);
}


export function expBetweenLevels(currentLevel, targetLevel) {
  return (
    totalExpForLevel(targetLevel) -
    totalExpForLevel(currentLevel)
  );
}
