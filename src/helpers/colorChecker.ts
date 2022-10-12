export const colorChecker = (number: number) => {
    if (number < 30) {
        return '#4aea46';
    } else if (number < 40) {
        return '#007c49';
    } else if (number < 50) {
        return '#0a20a3';
    } else if (number < 60) {
        return '#230099';
    } else if (number < 70) {
        return '#9403ad';
    } else if (number < 80) {
        return '#ffe80d';
    } else if (number < 90) {
        return '#ff00b3';
    } else {
        return '#ff1c29';
    }
};
