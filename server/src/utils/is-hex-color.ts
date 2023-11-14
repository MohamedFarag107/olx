export const isHexColor = (value: string): boolean => {
  const isColorCode = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
  return isColorCode.test(value);
};
