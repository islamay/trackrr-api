

export const dateValidator = (value: string) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    return regex.test(value);
};

export const dateExtractor = (input: string) => {
    const times = input.split(':')
    return times
}
