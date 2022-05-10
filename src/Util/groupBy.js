// https://gist.github.com/robmathers/1830ce09695f759bf2c4df15c29dd22d

/**
 * Groups objects by the return value of a predicate.
 * @param {(input: any)} predicate
 */
export function groupBy(data, predicate) {
    return data.reduce(function(storage, item) {
      var group = predicate(item);

      storage[group] = storage[group] || [];
      storage[group].push(item);

      return storage; 
    }, {});
};