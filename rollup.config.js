import fs from 'fs';
import util from 'util';
import typescript from '@rollup/plugin-typescript';

const libPath = '@orange4glace/vs-lib';
const basePath = `lib/${libPath}`;
const external = id => id.startsWith('@orange4glace/vs-lib/');

const c = [];
fs.readdirSync(basePath)
  .forEach(basedir => {
    const libs = fs.readdirSync(`${basePath}/${basedir}`);
    for (const lib of libs) {
      const files = fs.readdirSync(`${basePath}/${basedir}/${lib}`);
      for (const file of files) {
        const fileWithoutExtension = file.replace('.ts', '');
        c.push({
          input: `${basePath}/${basedir}/${lib}/${file}`,
          output: [
            {
              file: `${basedir}/${lib}/${fileWithoutExtension}/index.js`,
              format: 'cjs',
              paths: id => id.startsWith(libPath) && `${id.replace(libPath, '../../..')}/index.js`
            }
          ],
          external,
          plugins: [
            typescript(),
            {
              writeBundle(bundle) {
                fs.writeFileSync(`${basedir}/${lib}/${fileWithoutExtension}/package.json`, JSON.stringify({
                  main: './index',
                  types: './index.d.ts'
                }, null, ' '));
                fs.writeFileSync(`${basedir}/${lib}/${fileWithoutExtension}/index.d.ts`,
                    `export * from '../../../types/${libPath}/${basedir}/${lib}/${fileWithoutExtension}/index';`);
              }
            }
          ]
        });

      }
    }
  })

const config = [
  ...c
];

console.log(util.inspect(config, false, 100));

export default config;