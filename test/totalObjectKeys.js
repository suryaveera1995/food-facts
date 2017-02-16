module.exports = (function () {
    let totalNoObjects = 0, totalNoKeys = 0;
  return {
    traverse : traverse
  }
  // Traverse expected json
  function traverse(obj) {
        if (obj instanceof Array) {
        totalNoObjects++;
            obj.forEach(function (value, index) {
            if (typeof value == "object" && value) {
                traverse(value);
            } else {
              totalNoKeys++;
            }
          })

      } else {
          totalNoObjects++;
          for (let prop in obj) {
              if (typeof obj[prop] == "object" && obj[prop]) {
                  traverse(obj[prop]);
              } else {
                totalNoKeys++;
              }
          }
      }
      return {
        totalNoObjects : totalNoObjects,
        totalNoKeys    : totalNoKeys
      }
  }
})();
