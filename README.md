# No Dependencies

No Dependencies package allows you to publish your npm bundled packages without dependencies.

## Table of Contents:

1.  [Goal](#goal)
2.  [Quickstart](#quickstart)
    1. [Install](#install)
    2. [Usage](#usage)
    3. [Example](#example)
    4. [Commands and Options](#commands-and-options)
4.  [How it works](#how-it-works)
5.  [Credits](#credits)

## Goal:

If you build your project (e.g. you're using Webpack) and trying to load your package to npmjs, you will found that all dependencies install as well with the package. To prevent it, this package exists.

## Quick Start

### Install

Just install the package to your repo:

```shell script
$ npm i no-dependencies
```

Or install it globally and use in any repo:

```shell script
$ npm i no-dependencies -g
```

### Usage

After all, just call the package:

```shell script
$ no-dependencies
```

Or call with a specified command:

```shell script
$ no-dependencies --exec "npm i"
```

Or call or parts separetely:

```shell script
$ no-dependencies --before && npm i && no-dependencies --after
```

### Example

```shell script
$ no-dependencies
⭕ Standard scenario
✔️  Read the ./package.json
✔️  Created a ./package.bak.json
✔️  Deleted dependencies from the ./package.json
✔️  Write a new ./package.json without dependencies

// ... npm publish result

✔️  Executed the command: npm publish
✔️  Deleted the ./package.json
✔️  Copy ./package.bak.json to ./package.json
✔️  Deleted the ./package.bak.json
✔️  Deleted all temp files!
✔️  Done!
```

### Commands and Options

List all commands and options:

```shell script
$ no-dependencies --help
Usage: no-dependencies [options]

Allows you to publish packages without dependencies. Usefull when you publish a built bundle and don't want to install dependencies

Options:
  -V, --version         output the version number
  -b, --before          creates a package.json backup and deletes dependencies
  -e, --exec <command>  executes a specified command with a clean package.json. Default is: type "./package.json"
  -a, --after           returns back a backuped package.json
  -d, --debug           leaves backup and result files
  -c, --clear           cleares all temp files. Uses with or after the "--debug" command
  -h, --help            display help for command
```

## How it works

If you publish a package without dependencies, they won't install.

![rollsafe.jpg](https://i.kym-cdn.com/entries/icons/facebook/000/022/138/highresrollsafe.jpg)

So it just creates a copy of your package.json, deletes all dependencies, the call specified command and returns back the old package.json 

## Credits:
Created with ❤ by Dmytro Vakulenko, 2020.
