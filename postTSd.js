import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();

const DS_STORE = '.DS_Store';
const basePath = `@orange4glace/vs-lib`;

// fs.readdirSync(`types/${basePath}`)
//   .forEach(basedir => {
//     const libs = fs.readdirSync(`types/${basePath}/${basedir}`);
//     for (const lib of libs) {
//       const files = fs.readdirSync(`types/${basePath}/${basedir}/${lib}`);
//       for (const file of files) {
//         const fileWithoutExtension = file.replace('.d.ts', '');
//         fs.mkdirSync(`types/${basePath}/${basedir}/${lib}/${fileWithoutExtension}`);
//         fs.renameSync(
//           `types/${basePath}/${basedir}/${lib}/${file}`,
//           `types/${basePath}/${basedir}/${lib}/${fileWithoutExtension}/index.d.ts`
//         );
//       }
//     }
//   })

function search(basePath, path) {
  const fullPath = `${basePath}/${path}`;
  fs.readdirSync(fullPath).forEach(child => {
    if (child === DS_STORE) return;
    const targetPath = `${fullPath}/${child}`;
    if (fs.lstatSync(targetPath).isDirectory()) {
      search(basePath, `${path}/${child}`);
    }
    else {
      const pathWithoutExtension = targetPath.replace('.d.ts', '');
      fs.mkdirSync(pathWithoutExtension);
      fs.renameSync(
        targetPath,
        `${pathWithoutExtension}/index.d.ts`
      );
    }
  });
}

search(__dirname, 'types');