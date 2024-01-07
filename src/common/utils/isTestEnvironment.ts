export default () => {
    return !["prod", "hml", "dev"].includes(String(process.env.STAGE));
  };