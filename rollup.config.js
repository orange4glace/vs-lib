import fs from 'fs';
import util from 'util';
import typescript from '@rollup/plugin-typescript';
import styles from "rollup-plugin-styles";

const libPath = '@orange4glace/vs-lib';
const basePath = __dirname + `/lib/${libPath}`;
const external = id => id.startsWith('@orange4glace/vs-lib/');

const DS_STORE = '.DS_Store';


function search(path, depth = 0, result = []) {
  fs.readdirSync(path).forEach(file => {
    if (file === DS_STORE) return;
    const targetPath = `${path}/${file}`;
    if (fs.lstatSync(targetPath).isDirectory()) {
      search(targetPath, depth + 1, result);
    }
    else {
      if ((targetPath.endsWith('.ts') && !targetPath.endsWith('.d.ts')) || targetPath.endsWith('.js')) {
        const pathWithoutExtensions = targetPath.replace('.ts', '').replace('.js', '');
        const outputPath = pathWithoutExtensions.replace('lib/@orange4glace/vs-lib/', '');
        const relativePath = pathWithoutExtensions.replace(`${__dirname}/lib/`, '');
        const relativeToBasePathPrefix = '../'.repeat(depth - 1).slice(0, -1);
        result.push({
          input: targetPath,
          output: [
            {
              file: `${outputPath}/index.js`,
              format: 'cjs',
              paths: id => id.startsWith(libPath) && `${id.replace(libPath, relativeToBasePathPrefix)}/index.js`
            }
          ],
          external,
          plugins: [
            typescript(),
            styles(),
            {
              writeBundle(bundle) {
                fs.writeFileSync(`${outputPath}/package.json`, JSON.stringify({
                  main: './index',
                  types: './index.d.ts'
                }, null, ' '));
                fs.writeFileSync(`${outputPath}/index.d.ts`,
                    `export * from '${relativeToBasePathPrefix}/types/${relativePath}/index';`);
              }
            }
          ]
        });
      }
    }
  })
  return result;
}

// const c = [];
// fs.readdirSync(basePath)
//   .forEach(basedir => {
//     if (!fs.lstatSync(`${basePath}/${basedir}`).isDirectory()) return;
//     const libs = fs.readdirSync(`${basePath}/${basedir}`);
//     console.log(libs);
//     for (const lib of libs) {
//       console.log(lib);
//       if (!fs.lstatSync(`${basePath}/${basedir}/${lib}`).isDirectory()) continue;
//       const files = fs.readdirSync(`${basePath}/${basedir}/${lib}`);
//       console.log(`${basePath}/${basedir}/${lib}`);
//       for (const file of files) {
//         if (file === DS_STORE) continue;
//         const fileWithoutExtension = file.replace('.ts', '');
//         console.log(`${basePath}/${basedir}/${lib}/${file}`, `${basedir}/${lib}/${fileWithoutExtension}/index.js`, libPath);
//         c.push({
//           input: `${basePath}/${basedir}/${lib}/${file}`,
//           output: [
//             {
//               file: __dirname + `/${basedir}/${lib}/${fileWithoutExtension}/index.js`,
//               format: 'cjs',
//               paths: id => id.startsWith(libPath) && `${id.replace(libPath, '../../..')}/index.js`
//             }
//           ],
//           external,
//           plugins: [
//             typescript(),
//             {
//               writeBundle(bundle) {
//                 console.log('basedir = ', basedir);
//                 fs.writeFileSync(`${basedir}/${lib}/${fileWithoutExtension}/package.json`, JSON.stringify({
//                   main: './index',
//                   types: './index.d.ts'
//                 }, null, ' '));
//                 fs.writeFileSync(`${basedir}/${lib}/${fileWithoutExtension}/index.d.ts`,
//                     `export * from '../../../types/${libPath}/${basedir}/${lib}/${fileWithoutExtension}/index';`);
//               }
//             }
//           ]
//         });

//       }
//     }
//   })

const config = [
  ...search(`${__dirname}/lib`)
];

// console.log(util.inspect(config, false, 100));

export default config;