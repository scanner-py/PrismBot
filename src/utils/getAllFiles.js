const fs = require("fs");
const path = require("path");

module.exports = (directory, foldersOnly = false) => {
  let filesNames = [];

  const files = fs.readdirSync(directory, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(directory, file.name);
    if (foldersOnly) {
      if (file.isDirectory()) {
        filesNames.push(filePath);
      } else {
        if (file.isFile()) {
          filesNames.push(filePath);
        }
      }
    }
  }

  return filesNames;
};
