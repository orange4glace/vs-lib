import fs from 'fs';

const basePath = `@orange4glace/vs-lib`;

fs.readdirSync(`types/${basePath}`)
  .forEach(basedir => {
    const libs = fs.readdirSync(`types/${basePath}/${basedir}`);
    for (const lib of libs) {
      const files = fs.readdirSync(`types/${basePath}/${basedir}/${lib}`);
      for (const file of files) {
        const fileWithoutExtension = file.replace('.d.ts', '');
        fs.mkdirSync(`types/${basePath}/${basedir}/${lib}/${fileWithoutExtension}`);
        fs.renameSync(
          `types/${basePath}/${basedir}/${lib}/${file}`,
          `types/${basePath}/${basedir}/${lib}/${fileWithoutExtension}/index.d.ts`
        );
      }
    }
  })