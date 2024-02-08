exports.rowsConvertJson = (rows) => {
  const jsonRows = rows
    .map((row) => ({
      _headerValues: row._worksheet._headerValues,
      _rawData: row._rawData,
    }))
    .map((row) => {
      const obj = {};
      row._headerValues.forEach((header, index) => {
        obj[header] = row._rawData[index];
      });
      return obj;
    });
  return {
    value: () => {
      return jsonRows;
    },
    find: (param, value) => {
      try {
        const find = jsonRows.find((item) => item[param] === value);
        if (!find) throw null;
        return find;
      } catch (error) {
        return error;
      }
    },
    push: async (data) => {
      try {
        rows[rows.length + 1].assign(data);
        await rows[rows.length + 1].save();
        return "Saved!";
      } catch (error) {
        return error;
      }
    },
  };
};
