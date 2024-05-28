// HourTime.ts
export const getCurrentTime = () => {
    const date = new Date();
    return date.toLocaleTimeString();
};

export default getCurrentTime;
