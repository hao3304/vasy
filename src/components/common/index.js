export const tranObj = model => {
  return () => {
    let newModel = {};
    Object.keys(model).forEach(key => {
      if (typeof model[key] == "object") {
        newModel[key] = model[key].defaults;
      } else {
        newModel[key] = null;
      }
    });
    return newModel;
  };
};
export const getModel = model => {
  let newModel = {};
  Object.keys(model).forEach(key => {
    if (typeof model[key] == "object") {
      newModel[key] = model[key].name;
    } else {
      newModel[key] = model[key];
    }
  });
  return newModel;
};
