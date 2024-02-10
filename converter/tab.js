exports.sheets = async (sheet) => {
  try {
    const rows = await sheet.getRows();
    const data = rows
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
      // Create
      create: async (id, body) => {
        try {
          const find = data.find((i) => i.id === id);
          const findName = data.find(
            (i) => i.name.toLowerCase() === body.name.toLowerCase()
          );
          if (find || findName) throw "Duplicate Data!";
          const result = await sheet.addRow({
            id,
            date: new Date().getTime(),
            ...body,
          });
          if (!result) throw error;
          return {
            status: true,
            content: { id, date: new Date().getTime(), ...body },
          };
        } catch (error) {
          return { status: false, content: error };
        }
      },
      // Read
      read: async (id) => {
        if (id) {
          try {
            const find = data.find((i) => i.id === id);
            const findIndex = data.findIndex((i) => i.id === id);
            if (!find) throw "Data not found!";
            return { status: true, content: { ...find, index: findIndex } };
          } catch (error) {
            return { status: false, content: error };
          }
        } else {
          try {
            return { status: true, content: data };
          } catch (error) {
            return { status: false, content: error };
          }
        }
      },
      // Update
      update: async (id, body) => {
        try {
          const find = data.find((i) => i.id === id);
          const findIndex = data.findIndex((i) => i.id === id);
          if (!find) throw "Data not found!";
          delete body["id"];
          rows[findIndex].assign(
            Object.assign(find, { update: new Date().getTime(), ...body })
          );
          await rows[findIndex].save();
          return {
            status: true,
            content: { id, update: new Date().getTime(), ...body },
          };
        } catch (error) {
          return { status: false, content: error };
        }
      },
      // Delete
      delete: async (id) => {
        try {
          const find = data.find((i) => i.id === id);
          const findIndex = data.findIndex((i) => i.id === id);
          if (!find) throw "Data not found!";
          await rows[findIndex].delete();
          return { status: true, content: find };
        } catch (error) {
          return { status: false, content: error };
        }
      },
    };
  } catch (error) {
    return { status: false, content: error.message };
  }
};

exports.getDataForPage = async (page, result) => {
  const startIndex = (page - 1) * 5;
  const endIndex = startIndex + 5;
  return result.content.slice(startIndex, endIndex);
};
