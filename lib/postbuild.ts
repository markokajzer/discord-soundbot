import path from 'path';
import replace from 'replace-in-file';

import tsconfig from '../tsconfig.json';

const pathAliases = tsconfig.compilerOptions.paths;

const from = Object.keys(pathAliases).map(key =>
  new RegExp(`${key.split('/*')[0]}/[^"]*`, 'g')
);

const to: { [index: string]: string } = {};
for (const [key, value] of Object.entries(pathAliases)) {
  const match = key.split('/*')[0];
  const replacement = value[0].split('/*')[0];
  to[match] = replacement;
}

const options = {
  files: ['dist/**/*.js'],
  from,
  to: (...args: Array<string>) => {
    const [match, , , filename] = args;
    const [replacePattern, ...file] = match.split('/');

    const relativePath = path.relative(path.join(process.cwd(), path.dirname(filename)),
                                       path.join(process.cwd(), 'dist', to[replacePattern], ...file));

    return relativePath.replace(/\\/g, '/');
  }
};

replace.sync(options);
