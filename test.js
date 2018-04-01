import test from 'ava';
import execa from 'execa';

const randomName = () => `asdasfgrgafadsgaf${Math.random().toString().slice(2)}`;

test('is available', async t => {
	const ret = await execa('./cli.js', [randomName(), '--color']);
	t.regex(ret.stdout, /is available/);
});

test('is squatted', async t => {
	const ret = await execa('./cli.js', ['abc123', '--color']);
	t.regex(ret.stdout, /is squatted/);
});

test('is unavailable', async t => {
	const ret = await t.throws(execa('./cli.js', ['chalk', '--color']));
	t.is(ret.code, 2);
	t.regex(ret.stdout, /is unavailable/);
});

test('multiple packages', async t => {
	const ret = await t.throws(execa('./cli.js', ['chalk', randomName(), '--color']));
	t.is(ret.code, 2);
	t.regex(ret.stdout, /is unavailable([\s\S]*)is available/);
});
