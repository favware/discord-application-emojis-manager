<div align="center">

# Discord Application Emojis Manager

**A NodeJS CLI to manage emojis for Discord Applications**

[![GitHub](https://img.shields.io/github/license/favware/discord-application-emojis-manager)](https://github.com/favware/discord-application-emojis-manager/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/@favware/discord-application-emojis-manager?color=crimson&logo=npm)](https://www.npmjs.com/package/@favware/discord-application-emojis-manager)

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
npm install -D @favware/discord-application-emojis-manager
```

Although you probably want to install this globally to use it as a CLI tool,
here are some examples:

```sh
npm install -g @favware/discord-application-emojis-manager
pnpm add -g @favware/discord-application-emojis-manager
volta install @favware/discord-application-emojis-manager
```

Then call the script with `discord-application-emojis-manager` or `daem`:

```sh
discord-application-emojis-manager <command> <args...> --token "your-discord-token" --application-id "your application id"
daem <command> <args...> --token "your-discord-token" --application-id "your application id"
```

Alternatively you can call the CLI directly with `npx`, `pnpm dlx`, or
`yarn dlx`:

```sh
npx @favware/discord-application-emojis-manager <command> <args...> --token "your-discord-token" --application-id "your application id"
pnpm dlx @favware/discord-application-emojis-manager <command> <args...> --token "your-discord-token" --application-id "your application id"
yarn dlx @favware/discord-application-emojis-manager <command> <args...> --token "your-discord-token" --application-id "your application id"
```

## Usage

The first step is to specify the command to run. The available options are
listed below.

> [!NOTE]
>
> For every command the `--token` and `--application-id` options are optional as
> they can also be provided through the environment variables `DISCORD_TOKEN`
> and `APPLICATION_ID` respectively.

> [!NOTE]
>
> Emojis that are uploaded through the API are limited to a maximum of 256 KiB.
> This differs from emojis uploaded through the Discord UI because Discord
> automatically does some compression. To allow for a bit more leeway when using
> [`post`](#post) and [`migrate`](#migrate) static emojis are efficiently
> compressed using [`@napi-rs/image](https://github.com/Brooooooklyn/Image). If
> after compression the emoji is still too large, the script will skip that
> emoji and print a warning.

```sh
Usage:  discord-application-emojis-manager [options] [command]

Options:
  -h, --help                         display help for command

Commands:
  delete [options] <nameOrId>        Deletes an emoji from the bot application
  delete-all [options]               Deletes all emoji from the bot application
  get [options] <nameOrId>           Gets a single emojis from the bot application in JSON format
  list [options]                     Lists all emojis from the bot application in JSON format
  patch [options] <nameOrId> <name>  Patches an emoji on the server provided the emoji id and a new name for the emoji
  migrate [options] <id>             Migrates the emojis from a specified server to the application
  post [options] <path>              Posts all emoji in the input directory to the server
  help [command]                     display help for command
```

### `delete`

```sh
Usage:  discord-application-emojis-manager delete [options] <nameOrId>

Deletes an emoji from the bot application

Arguments:
  nameOrId                   The name or snowflake of the emoji to delete. If a name is provided a list of emojis will be fetched to find the id to delete.

Options:
  --token <string>           The token of your Discord bot to authenticate with. You can also provide this with the DISCORD_TOKEN environment variable. (default: "")
  --application-id <string>  The ID of the Discord application for which to manage the emojis. You can also provide this with the APPLICATION_ID environment variable. (default: "")
  -v, --verbose              Whether to print verbose information (default: false)
  -h, --help                 display help for command
```

### `delete-all`

```sh
Usage:  discord-application-emojis-manager delete-all [options]

Deletes all emoji from the bot application

Options:
  --token <string>           The token of your Discord bot to authenticate with. You can also provide this with the DISCORD_TOKEN environment variable. (default: "")
  --application-id <string>  The ID of the Discord application for which to manage the emojis. You can also provide this with the APPLICATION_ID environment variable. (default: "")
  -v, --verbose              Whether to print verbose information (default: false)
  -h, --help                 display help for command
```

### `get`

```sh
Usage:  discord-application-emojis-manager get [options] <nameOrId>

Gets a single emojis from the bot application in JSON format

Arguments:
  nameOrId                   The name or snowflake of the emoji to get. If a name is provided a list of emojis will be fetched to find the id to get.

Options:
  --token <string>           The token of your Discord bot to authenticate with. You can also provide this with the DISCORD_TOKEN environment variable. (default: "")
  --application-id <string>  The ID of the Discord application for which to manage the emojis. You can also provide this with the APPLICATION_ID environment variable. (default: "")
  -v, --verbose              Whether to print verbose information (default: false)
  -h, --help                 display help for command
```

### `list`

```sh
Usage:  discord-application-emojis-manager list [options]

Lists all emojis from the bot application in JSON format

Options:
  --token <string>           The token of your Discord bot to authenticate with. You can also provide this with the DISCORD_TOKEN environment variable. (default: "")
  --application-id <string>  The ID of the Discord application for which to manage the emojis. You can also provide this with the APPLICATION_ID environment variable. (default: "")
  -v, --verbose              Whether to print verbose information (default: false)
  -h, --help                 display help for command
```

### `migrate`

```sh
Usage:  discord-application-emojis-manager migrate [options] <id>

Migrates the emojis from a specified discord server to the application

Arguments:
  id                         The id of the discord server to migrate the emojis from. Unlike other commands names are not supported, because discord server names cannot be guaranteed to be unique.

Options:
  --token <string>           The token of your Discord bot to authenticate with. You can also provide this with the DISCORD_TOKEN environment variable. (default: "")
  --application-id <string>  The ID of the Discord application for which to manage the emojis. You can also provide this with the APPLICATION_ID environment variable. (default: "")
  -v, --verbose              Whether to print verbose information (default: false)
  -h, --help                 display help for command
```

### `patch`

```sh
Usage:  discord-application-emojis-manager patch [options] <nameOrId> <name>

Patches an emoji on registered to the bot application provided the emoji id and a new name for the emoji

Arguments:
  nameOrId                   The name or snowflake of the emoji to update. If a name is provided a list of emojis will be fetched to find the id to update.
  name                       The new name for the emoji

Options:
  --token <string>           The token of your Discord bot to authenticate with. You can also provide this with the DISCORD_TOKEN environment variable. (default: "")
  --application-id <string>  The ID of the Discord application for which to manage the emojis. You can also provide this with the APPLICATION_ID environment variable. (default: "")
  -v, --verbose              Whether to print verbose information (default: false)
  -h, --help                 display help for command
```

### `post`

```sh
Usage:  discord-application-emojis-manager post [options] <path>

Posts all emoji in the input directory to the bot application

Arguments:
  path                       The file path to the directory containing the emojis, can be relative to the current working directory or absolute.

Options:
  --token <string>           The token of your Discord bot to authenticate with. You can also provide this with the DISCORD_TOKEN environment variable. (default: "")
  --application-id <string>  The ID of the Discord application for which to manage the emojis. You can also provide this with the APPLICATION_ID environment variable. (default: "")
  -v, --verbose              Whether to print verbose information (default: false)
  -h, --help                 display help for command
```

## Buy us some doughnuts

Favware projects are and always will be open source, even if we don't get
donations. That being said, we know there are amazing people who may still want
to donate just to show their appreciation. Thank you very much in advance!

We accept donations through Ko-fi, Paypal, Patreon, GitHub Sponsorships, and
various cryptocurrencies. You can use the buttons below to donate through your
method of choice.

|   Donate With   |                      Address                      |
| :-------------: | :-----------------------------------------------: |
|      Ko-fi      |  [Click Here](https://donate.favware.tech/kofi)   |
|     Patreon     | [Click Here](https://donate.favware.tech/patreon) |
|     PayPal      | [Click Here](https://donate.favware.tech/paypal)  |
| GitHub Sponsors |  [Click Here](https://github.com/sponsors/Favna)  |
|     Bitcoin     |       `1E643TNif2MTh75rugepmXuq35Tck4TnE5`        |
|    Ethereum     |   `0xF653F666903cd8739030D2721bF01095896F5D6E`    |
|    LiteCoin     |       `LZHvBkaJqKJRa8N7Dyu41Jd1PDBAofCik6`        |

## Contributors

Please make sure to read the [Contributing Guide][contributing] before making a
pull request.

Thank you to all the people who already contributed to Sapphire!

<a href="https://github.com/favware/discord-application-emojis-manager/graphs/contributors">
  <img alt="contributors" src="https://contrib.rocks/image?repo=favware/discord-application-emojis-manager" />
</a>

[contributing]: ./.github/CONTRIBUTING.md
