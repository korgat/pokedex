const debounce = (cb: (str: string) => Promise<void>, ms: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any) => {
    const fnCall = () => {
      cb.apply(this, args);
    };
    clearTimeout(timer);
    timer = setTimeout(fnCall, ms);
  };
};

export default debounce;
