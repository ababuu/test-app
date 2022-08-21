import _ from "lodash";
export default function formatResource(data) {
  let newArray;
  if (data !== undefined && data !== null && data !== []) {
    newArray = [
      ...data.map((d) => {
        return { ...d, checked: false };
      }),
    ];
  }

  let grouped = _.groupBy(newArray, (item) => {
    if (!item.category) return " ";
    else {
      return item.category["name"];
    }
  });
  let ordered = Object.keys(grouped)
    .sort()
    .reverse()
    .reduce((obj, key) => {
      obj[key] = grouped[key];
      return obj;
    }, {});
  return ordered;
}
