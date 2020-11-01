maintenance-page-generator
==========================

Simple maintenance page generator cli

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/maintenance-page-generator.svg)](https://npmjs.org/package/maintenance-page-generator)
[![Downloads/week](https://img.shields.io/npm/dw/maintenance-page-generator.svg)](https://npmjs.org/package/maintenance-page-generator)
[![License](https://img.shields.io/npm/l/maintenance-page-generator.svg)](https://github.com/sylcastaing/maintenance-page-generator/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g maintenance-page-generator
$ maintenance-page-generator COMMAND
running command...
$ maintenance-page-generator (-v|--version|version)
maintenance-page-generator/0.2.0-pre11 linux-x64 node-v14.15.0
$ maintenance-page-generator --help [COMMAND]
USAGE
  $ maintenance-page-generator COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`maintenance-page-generator build`](#maintenance-page-generator-build)
* [`maintenance-page-generator docker`](#maintenance-page-generator-docker)
* [`maintenance-page-generator help [COMMAND]`](#maintenance-page-generator-help-command)
* [`maintenance-page-generator preview`](#maintenance-page-generator-preview)

## `maintenance-page-generator build`

build an html maintenance page

```
USAGE
  $ maintenance-page-generator build

OPTIONS
  -f, --file=file  Destination html file name
  -h, --help       show CLI help

EXAMPLE
  $ mpg build
```

_See code: [src/commands/build.ts](https://github.com/sylcastaing/maintenance-page-generator/blob/v0.2.0-pre11/src/commands/build.ts)_

## `maintenance-page-generator docker`

build a maintenance docker image

```
USAGE
  $ maintenance-page-generator docker

OPTIONS
  -h, --help             show CLI help
  -t, --tagName=tagName  Docker image tag name

EXAMPLE
  $ mpg docker
```

_See code: [src/commands/docker.ts](https://github.com/sylcastaing/maintenance-page-generator/blob/v0.2.0-pre11/src/commands/docker.ts)_

## `maintenance-page-generator help [COMMAND]`

display help for maintenance-page-generator

```
USAGE
  $ maintenance-page-generator help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `maintenance-page-generator preview`

preview maintenance page in browser

```
USAGE
  $ maintenance-page-generator preview

OPTIONS
  -h, --help                   show CLI help
  -l, --livereload=livereload  [default: 35729] Livereload server port
  -p, --port=port              [default: 8080] Server port

EXAMPLE
  $ mpg preview
```

_See code: [src/commands/preview.ts](https://github.com/sylcastaing/maintenance-page-generator/blob/v0.2.0-pre11/src/commands/preview.ts)_
<!-- commandsstop -->
