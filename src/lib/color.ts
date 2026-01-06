const colorsToRgb: { [key: string]: number[] } = {
    red: [232, 80, 91],
    orange: [232, 121, 80],
    yellow: [249, 213, 110],
    green: [107, 203, 119],
    blue: [113, 169, 254],
    purple: [73, 66, 228],
    pink: [232, 80, 217],
    brown: [102, 47, 32],
    grey: [138, 138, 138],
};

const colorsToTailwind: { [key: string]: string } = {
    red: "bg-red-1",
    orange: "bg-orange-1",
    yellow: "bg-yellow-1",
    green: "bg-green-1",
    blue: "bg-blue-1",
    purple: "bg-purple-1",
    pink: "bg-pink-1",
    brown: "bg-brown-1",
    grey: "bg-grey-1",
};

export const getRgbColor = (color: string) => {
    return colorsToRgb[color];
};

export const getTailwindColor = (color: string): string => {
    return colorsToTailwind[color];
};
