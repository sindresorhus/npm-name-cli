import test from 'ava';
import execa from 'execa';

test(async t => {
  const pkgName = `asdasfgrgafadsgaf${Math.random().toString().slice(2)}`;
  const ret = await execa('./cli.js', [pkgName, '--color'], {cwd: __dirname});
  t.regex(ret.stdout, /is available/);
});

test(async t => {
  const pkgName = `chalk,asdasfgrgafadsgaf${Math.random().toString().slice(2)}`;
  const ret = await execa('./cli.js', [pkgName, '--color'], {cwd: __dirname});
  t.regex(ret.stdout, /is unavailable([\s\S]*)is available/);
});
