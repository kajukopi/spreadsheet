exports.tab = async (sheet) => {
  try {
    const rows = await sheet.getRows();
    if (!rows.length) throw "0 Rows";
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
          const obj = jsonRows.find((item) => item[param] === value);
          const ind = jsonRows.findIndex((item) => item[param] === value);
          if (!obj) throw null;
          return {
            // Value
            value: () => {
              return { index: ind, content: obj };
            },
            // Update
            update: (body) => {
              rows[ind].assign(body);
              rows[ind].save().finnaly(() => {
                return { index: ind, content: obj };
              });
            },
            // Add
            add: (body) => {
              try {
                if (obj) throw "Data exist!";
                sheet.addRow(body).finnaly(() => {
                  return "Data added!";
                });
              } catch (error) {
                return error;
              }
            },
            // Delete
            delete: () => {
              rows[ind].delete().finnaly(() => {
                return { index: ind, content: obj };
              });
            },
          };
        } catch (error) {
          return error;
        }
      },
      push: (data) => {
        try {
          sheet.addRow(data).then(() => {
            return "Saved!";
          });
        } catch (error) {
          return error;
        }
      },
    };
  } catch (error) {
    return error;
  }
};
