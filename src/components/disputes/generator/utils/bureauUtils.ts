
export const determineBureau = (bureauString: string): string => {
  const lowerBureau = bureauString.toLowerCase();
  if (lowerBureau.includes('experian')) {
    return 'Experian';
  } else if (lowerBureau.includes('equifax')) {
    return 'Equifax';
  } else if (lowerBureau.includes('transunion')) {
    return 'TransUnion';
  }
  return 'Experian'; // Default
};
