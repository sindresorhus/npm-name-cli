import test from 'ava';
import execa from 'execa';

test(async t => {
	const pkgName = `asdasfgrgafadsgaf${Math.random().toString().slice(2)}`;
	const ret = await execa('./cli.js', [pkgName, '--color'], {cwd: __dirname});
	t.regex(ret.stdout, /is available/);
});

test(async t => {
	const pkgName = 'chalk';
	try {
		const ret = await execa('./cli.js', [pkgName, '--color'], {cwd: __dirname});
		t.regex(ret.stdout, /is unavailable/);
	} catch (err) {
		t.ok(err)
	}
});

test(async t => {
	const pkgName1 = 'chalk'
	const pkgName2 = `asdasfgrgafadsgaf${Math.random().toString().slice(2)}`
	try {
		const ret = await execa('./cli.js', [pkgName1, pkgName2, '--color'], {cwd: __dirname});
		t.regex(ret.stdout, /is unavailable([\s\S]*)is available/);
	} catch (err) {
		t.ok(err)
	}
});
