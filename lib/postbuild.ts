import path from 'path';
import replace from 'replace-in-file';

import tsconfig from '../tsconfig.json';

const pathAliases = tsconfig.compilerOptions.paths;

const from = Object.keys(pathAliases).map(key => new RegExp(`${key.split('/*')[0]}/[^"]*`, 'g'));

const to: { [index: string]: string } = {};
Object.entries(pathAliases).forEach(([key, value]) => {
  const match = key.split('/*')[0];
  const replacement = value[0].split('/*')[0];
  to[match] = replacement;
});

const options = {
  files: ['dist/**/*.js'],
  from,
  to: (...args: string[]) => {
    const [match, , , filename] = args;
    const [replacePattern, ...file] = match.split('/');

    const normalizedRelativePath = path.relative(
      path.join(process.cwd(), path.dirname(filename)),
      path.join(process.cwd(), 'dist', to[replacePattern], ...file)
    );

    const relativePath = normalizedRelativePath.startsWith('.')
      ? normalizedRelativePath
      : `./${normalizedRelativePath}`;

    return relativePath.replace(/\\/g, '/');
  }
};

replace.sync(options);
