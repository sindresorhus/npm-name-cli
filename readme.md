# npm-name-cli [![Build Status](https://travis-ci.org/sindresorhus/npm-name-cli.svg?branch=master)](https://travis-ci.org/sindresorhus/npm-name-cli)

> Check whether a package name is available on npm

<img src="https://cloud.githubusercontent.com/assets/170270/8269981/6d394f42-17c4-11e5-8da3-fdb3e251d535.png" width="332">


## Install

```
$ npm install --global npm-name-cli
```


## Usage

```
$ npm-name --help

  Usage
    $ npm-name <name>

  Examples
    $ npm-name chalk
    ✖ Unavailable
    $ npm-name unicorn-cake
    ✔ Available

  Exits with code 0 when the name is available or 2 when taken
```


## Related

- [npm-name](https://github.com/sindresorhus/npm-name) - API for this module


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
