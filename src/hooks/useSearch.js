export default function useSearch(searchQuery, data) {
  const searchResult = [];
  let error = "";
  if (data !== undefined && data !== null && data !== []) {
    data.map((item) => {
      if (item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        searchResult.push(item);
      }
    });
  }

  return searchResult;
}
