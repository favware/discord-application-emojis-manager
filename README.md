<div align="center">

# Discord Application Emoji Manager

**A NodeJS CLI to manage emojis for Discord Applications**

[![GitHub](https://img.shields.io/github/license/favware/discord-application-emoji-manager)](https://github.com/favware/discord-application-emoji-manager/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/@favware/discord-application-emoji-manager?color=crimson&logo=npm)](https://www.npmjs.com/package/@favware/discord-application-emoji-manager)

[![Support Server](https://discord.com/api/guilds/512303595966824458/embed.png?style=banner2)](https://join.favware.tech)

</div>

## Description

This is a NodeJS based script to manage emojis to the Discord API for
Application Emojis. Discord allows you to assign 200 emojis to an application
that can then be used across all servers by that application. Because it takes a
lot of time to do this manually, this script was created to automate the process
given an input directory.

## Installation

You can use the following command to install this package, or replace
`npm install -D` with your package manager of choice.

```sh
npm install -D @favware/discord-application-emoji-manager
```

Or install it globally:

```sh
npm install -g @favware/discord-application-emoji-manager
```

Then call the script with `discord-application-emoji-manager` or `daem`:

```sh
discord-application-emoji-manager <command> <args...> --token "your-discord-token" --application-id "your application id"
daem <command> <args...> --token "your-discord-token" --application-id "your application id"
```

Alternatively you can call the CLI directly with `npx`:

```sh
npx @favware/discord-application-emoji-manager <command> <args...> --token "your-discord-token" --application-id "your application id"
```

## Usage

The first step is to specify the command to run. The available options are
listed below.

> [!NOTE]
>
> For every command the `--token` and `--application-id` options are optional as
> they can also be provided through the environment variables `DISCORD_TOKEN`
> and `APPLICATION_ID` respectively.

```sh
Usage:  discord-application-emoji-manager [options] [command]

Options:
  -h, --help                   display help for command

Commands:
  delete [options] <id>        Deletes an emoji from the server
  delete-all [options]         Deletes all emoji from the server
  get [options] <id>           Gets a single emojis from the server in JSON format
  list [options]               Lists all emojis from the server in JSON format
  patch [options] <id> <name>  Patches an emoji on the server provided the emoji id and a new name
                               for the emoji
  post [options] <path>        Posts all emoji in the input directory to the server
  help [command]               display help for command
```

### `delete`

```sh
Usage:  discord-application-emoji-manager delete [options] <id>

Deletes an emoji from the server

Arguments:
  id                         The id of the emoji to get

Options:
  -t, --token <string>       The token of your Discord bot to authenticate with. You can also provide
                             this with the DISCORD_TOKEN environment variable. (default: "")
  --application-id <string>  The ID of the Discord application for which to manage the emojis. You
                             can also provide this with the APPLICATION_ID environment variable.
                             (default: "")
  -v, --verbose              Whether to print verbose information (default: false)
  -h, --help                 display help for command
```

### `delete-all`

```sh
Usage:  discord-application-emoji-manager delete-all [options]

Deletes all emoji from the server

Options:
  -t, --token <string>       The token of your Discord bot to authenticate with. You can also provide
                             this with the DISCORD_TOKEN environment variable. (default: "")
  --application-id <string>  The ID of the Discord application for which to manage the emojis. You
                             can also provide this with the APPLICATION_ID environment variable.
                             (default: "")
  -v, --verbose              Whether to print verbose information (default: false)
  -h, --help                 display help for command
```

### `get`

```sh
Usage:  discord-application-emoji-manager get [options] <id>

Gets a single emojis from the server in JSON format

Arguments:
  id                         The id of the emoji to get

Options:
  -t, --token <string>       The token of your Discord bot to authenticate with. You can also provide
                             this with the DISCORD_TOKEN environment variable. (default: "")
  --application-id <string>  The ID of the Discord application for which to manage the emojis. You
                             can also provide this with the APPLICATION_ID environment variable.
                             (default: "")
  -v, --verbose              Whether to print verbose information (default: false)
  -h, --help                 display help for command
```

### `list`

```sh
Usage:  discord-application-emoji-manager list [options]

Lists all emojis from the server in JSON format

Options:
  -t, --token <string>       The token of your Discord bot to authenticate with. You can also provide
                             this with the DISCORD_TOKEN environment variable. (default: "")
  --application-id <string>  The ID of the Discord application for which to manage the emojis. You
                             can also provide this with the APPLICATION_ID environment variable.
                             (default: "")
  -v, --verbose              Whether to print verbose information (default: false)
  -h, --help                 display help for command
```

### `patch`

```sh
Usage:  discord-application-emoji-manager patch [options] <id> <name>

Patches an emoji on the server provided the emoji id and a new name for the emoji

Arguments:
  id                         The id of the emoji to patch
  name                       The new name for the emoji

Options:
  -t, --token <string>       The token of your Discord bot to authenticate with. You can also provide
                             this with the DISCORD_TOKEN environment variable. (default: "")
  --application-id <string>  The ID of the Discord application for which to manage the emojis. You
                             can also provide this with the APPLICATION_ID environment variable.
                             (default: "")
  -v, --verbose              Whether to print verbose information (default: false)
  -h, --help                 display help for command
```

### `post`

```sh
Usage:  discord-application-emoji-manager post [options] <path>

Posts all emoji in the input directory to the server

Arguments:
  path                       The file path to the directory containing the emojis, can be relative to
                             the current working directory or absolute.

Options:
  -t, --token <string>       The token of your Discord bot to authenticate with. You can also provide
                             this with the DISCORD_TOKEN environment variable. (default: "")
  --application-id <string>  The ID of the Discord application for which to manage the emojis. You
                             can also provide this with the APPLICATION_ID environment variable.
                             (default: "")
  -v, --verbose              Whether to print verbose information (default: false)
  -h, --help                 display help for command
```
