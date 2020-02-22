import test from 'ava';
import execa from 'execa';

const randomName = () => `asdasfgrgafadsgaf${Math.random().toString().slice(2)}`;

test('is available', async t => {
	const {stdout} = await execa('./cli.js', [randomName(), '--color']);
	t.regex(stdout, /is available/);
});

test('is squatted', async t => {
	const {stdout} = await execa('./cli.js', ['abc123', '--color']);
	t.regex(stdout, /is squatted/);
});

test('is unavailable', async t => {
	const {stdout, exitCode} = await t.throwsAsync(execa('./cli.js', ['chalk', '--color']));
	t.is(exitCode, 2);
	t.regex(stdout, /is unavailable/);
});

test('organization is available', async t => {
	const {stdout} = await execa('./cli.js', [`@${randomName()}`, '--color']);
	t.regex(stdout, /is available/);
});

test('organization is unavailable', async t => {
	const {stdout, exitCode} = await t.throwsAsync(execa('./cli.js', ['@ava', '--color']));
	t.is(exitCode, 2);
	t.regex(stdout, /is unavailable/);
});

test('multiple packages', async t => {
	const {stdout, exitCode} = await t.throwsAsync(execa('./cli.js', ['chalk', randomName(), '--color']));
	t.is(exitCode, 2);
	t.regex(stdout, /is unavailable(.*)is available/s);
});
