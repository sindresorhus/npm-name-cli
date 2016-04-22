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
    $ npm-name unicorn-cake
    ✔ unicorn-cake is available
    $ npm-name chalk unicorn-cake
    ✖ chalk is unavailable
    ✔ unicorn-cake is available

  Exits with code 0 when all names are available or 2 when any names are taken
```


## Related

- [npm-name](https://github.com/sindresorhus/npm-name) - API for this module


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
