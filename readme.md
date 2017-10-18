# npm-name-cli [![Build Status](https://travis-ci.org/sindresorhus/npm-name-cli.svg?branch=master)](https://travis-ci.org/sindresorhus/npm-name-cli)

> Check whether a package name is available on npm

![](screenshot.png)


## Install

```
$ npm install --global npm-name-cli
```


## Usage

```
$ npm-name --help

  Usage
    $ npm-name <name> …

  Examples
    $ npm-name chalk
    ✖ chalk is unavailable
    $ npm-name foo
    ⚠ foo is squatted
    $ npm-name unicorn-cake
    ✔ unicorn-cake is available
    $ npm-name chalk unicorn-cake
    ✖ chalk is unavailable
    ✔ unicorn-cake is available

  Exits with code 0 when all names are available or 2 when any names are taken
```


## FAQ

### Why would I use `npm-name` rather than npm's built-in search?

1. Nicer & simpler output

2. [npm search is only supported on npm 4](https://github.com/npm/npm/issues/14649#issuecomment-262820415), which is only bundled with Node.js 7.4+

3. [Squatter detection](https://github.com/sholladay/squatter)

4. Performance

  Using npm 4.0.2

  ```
  $ time npm search unicorn-cake
  No matches found for "unicorn-cake"
  npm search unicorn-cake  55.50s user 0.82s system 101% cpu 55.380 total
  $ time npm-name unicorn-cake
  ✔ unicorn-cake is available
  npm-name unicorn-cake  0.17s user 0.02s system 35% cpu 0.535 total
  ```


## Related

- [npm-name](https://github.com/sindresorhus/npm-name) - API for this module


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
