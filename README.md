<div align="center">

# Discord Application Emoji Manager

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
discord-application-emoji-manager --token "your-discord-token" --application-id "your application id" <command> [...arguments]
daem --token "your-discord-token" --application-id "your application id" <command> [...arguments]
```

Alternatively you can call the CLI directly with `npx`:

```sh
npx @favware/discord-application-emoji-manager --token "your-discord-token" --application-id "your application id" <command> [...arguments]
```
