import test from 'ava';
import execa from 'execa';

function randomName() {
	return `asdasfgrgafadsgaf${Math.random().toString().slice(2)}`;
}

test(async t => {
	const ret = await execa('./cli.js', [randomName(), '--color'], {cwd: __dirname});
	t.regex(ret.stdout, /is available/);
});

test(async t => {
	const pkgName = 'chalk';
	try {
		const ret = await execa('./cli.js', [pkgName, '--color'], {cwd: __dirname});
		t.regex(ret.stdout, /is unavailable/);
	} catch (err) {
		t.ok(err);
	}
});

test(async t => {
	const pkgName = 'chalk';
	try {
		const ret = await execa('./cli.js', [pkgName, randomName(), '--color'], {cwd: __dirname});
		t.regex(ret.stdout, /is unavailable([\s\S]*)is available/);
	} catch (err) {
		t.ok(err);
	}
});
