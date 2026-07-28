export const getObjectDiff = (
  oldObject,
  newObject
) => {

  const changes = [];

  Object.keys(newObject).forEach((key) => {

    const oldValue = oldObject[key];

    const newValue = newObject[key];

    if (
      JSON.stringify(oldValue) !==
      JSON.stringify(newValue)
    ) {

      changes.push({

        field: key,

        oldValue,

        newValue,

      });

    }

  });

  return changes;

};