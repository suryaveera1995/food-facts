//Compare objects in JSON
module.exports = (function(){
  return {
    compareJSONStrings: function(expectedJSONStr, actualJSONStr) {
      if (!expectedJSON || !actualJSON) {
        return;
      }
      return compareObjects(JSON.parse(expectedJSONStr), JSON.parse(actualJSONStr));
    },

    compareJSONObjects:   function(expectedJSON, actualJSON) {
      if (!expectedJSON || !actualJSON) {
        return;
      }

      let expectedDataSet = new Set(toDataMap(expectedJSON));
      let actualJSONObjs = actualJSON;

      let diffs = [];
      let matched = [];

      actualJSONObjs.forEach(function(obj) {
        let actual = toObjValueHash(obj);

        if (expectedDataSet.has(actual)) {
          matched.push(obj);
        } else {
          diffs.push(obj);
        }
      });

      if (diffs.length > 0) {
        return {
          diffs: diffs.length,
          diffObjs : diffs
        }
      } else {
        return {
          diffs: diffs.length,
          diffObjs : []
        }
      }

      function toDataMap(data) {
        return data.map(toObjValueHash);
      }

      function toObjValueHash(obj) {
        return objValues(obj).sort().join(';')
      }

      function objValues(obj) {
        let keys = Object.keys(obj);
        let values = [];

        keys.forEach(function(keyName) {
          let val = obj[keyName];
          values.push(val);
        });

        return values;
      }
    }
  }
})();
