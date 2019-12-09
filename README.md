# Maintenance page generator

![image](https://user-images.githubusercontent.com/12694685/70395036-0afc1600-19fb-11ea-9139-b4cc0258b899.png)

## Installation

```bash
npm i -g maintenance-page-generator
```

## Cli usage

No args needed. Only start command !

```
mpg

# OR
maintenance-page-generator
```

### Features

#### Preview maintenance page

Maintenance page is serve on http://localhost:8080.

#### Generate maintenance page

Maintenance page is save on current directory.

#### Generate maintenance docker image

Mpg build a nginx docker image to serve maintenance page.

## Configuration

### Configuration file

To customize your maintenance page, you can create a **mpg.config.json** file with some options.

```json
{
  "title": "We'll be back soon !",
  "description": "Sorry for the inconvenience but we’re performing some maintenance at the moment.",
  "meta": {
    "title": "Maintenance page",
    "description": null
  }
}
```

All fields are optionals.

### Add images

You can add images to your directory

- logo.{svg,png,jpg,jpeg}
- background.{svg,png,jpg,jpeg}
- favicon.ico (only for docker build)

### Customize style

You can add a stylesheet with name : **style.css**.

Css selectors :

- .container
- .content
- .logo
- .title
- .text
