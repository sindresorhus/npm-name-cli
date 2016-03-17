import childProcess from 'child_process';
import test from 'ava';
import pify from 'pify';
import logSymbols from 'log-symbols';

test(async t => {
	const rand = `asdasfgrgafadsgaf + ${Math.random().toString().slice(2)}`;
	const stdout = await pify(childProcess.execFile)('./cli.js', [rand, '--color'], {cwd: __dirname});
	t.is(stdout.trim(), `${logSymbols.success} "${rand}" is available`);
});
