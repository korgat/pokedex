export const debounce = (cb: Function, ms: number) => {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: any) => {
        const fnCall = () => {
            cb.apply(this, args);
        };
        clearTimeout(timer);
        timer = setTimeout(fnCall, ms);
    };
};
