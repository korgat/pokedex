export const limeColor = '#4aea46';
export const greenDarkColor = '#007c49';
export const purpleLightColor = '#253fdc';
export const purpleDarkColor = '#230099';
export const pinkColor = '#d60bf9';
export const pinkDarkColor = '#7c0391';
export const yellowColor = '#ffc307';
export const maxColor = '#ff1c29';

const colorChecker = (number: number) => {
  if (number < 30) {
    return limeColor;
  }
  if (number < 40) {
    return greenDarkColor;
  }
  if (number < 50) {
    return purpleLightColor;
  }
  if (number < 60) {
    return purpleDarkColor;
  }
  if (number < 70) {
    return pinkColor;
  }
  if (number < 80) {
    return pinkDarkColor;
  }
  if (number < 90) {
    return yellowColor;
  }
  return maxColor;
};

export default colorChecker;
