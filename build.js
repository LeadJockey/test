const fs   = require('fs');
const path = require('path');

const filePath = 'src/templates/pc/banner/';
const fileList = ['config.json', 'config.ftl', 'content.ftl', 'css.ftl', 'script.ftl', 'index.ftl'];
fileList.forEach((file) => {
  fs.writeFile(path.join(filePath, file), '', {overwrite: false}, (err) => {
    if (err) {
      throw err
    }
    console.log('created file : ' + file + 'on path ' + filePath);
  });
});




