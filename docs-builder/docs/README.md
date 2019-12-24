---
title: About
---

![Flock logo](logo.png)

A simple, but powerful ECS written in TypeScript.

[![GitHub](https://img.shields.io/github/license/dannyfritz/flock-ecs?style=for-the-badge)](https://github.com/dannyfritz/flock-ecs/blob/master/LICENSE)
[![npm badge](https://img.shields.io/npm/v/flock-ecs?style=for-the-badge)](https://www.npmjs.com/package/flock-ecs)

## Features

* No dependencies
* Very good TypeScript typings
* Simple, but powerful API
* Designed for performance
* Struct of Arrays for storing entity component values
* Entities are queryable by:
  * Component
  * Absence of Component
  * Added Entity
  * Removed Entity
* Systems can have 1 or more queries

## Install

```sh
npm install flock-ecs
```

```ts
const flock = require("flock-ecs");
//or
import * as flock from "flock-ecs";
```

## Simple Example

<<< @/../examples/simple/index.ts
