<h1 align="center">Clientside Typescript/Less website template with Build scripts 👋</h1>
<p>
  <a href="https://github.com/Topograph/template-clientside-tsc-less#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/Topograph/website3d-npm/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
</p>

> This is a base project layout with buildscripts in order to compile typescript and less files to an output directory and perform file copy and minimizer jobs, depending on the output type.

### 🏠 [Homepage](https://github.com/Topograph/template-clientside-tsc-less)

## Install

clone git template
run

```sh
npm init
npm install
```
change the namespace attribut to your preferred typescript namespace in the package.json
```json
"namespace": "xyz",
```

## Usage

### Create debug versions

to create a debug version call
```sh
npm run debugall
```

this will:
1. Increase "patch" in Version
2. Delete all files in the dist/debug directory
3. Compile all typescript-files in src/ts into dist/debug/js/bundle.js
4. Compile all typescript-files in src/less into dist/debug/css/main.css
5. Copy all other files to the dist/debug/ directory

for a quick changes just run
```sh
npm run debugfast
```
to just compile typescript and less files

### Create public versions

to create a public version call
```sh
npm run publicall
```

this will:
1. Increase "minor" in Version
2. Delete all files in the dist/public directory
3. Compile all typescript-files in src/ts into dist/public/js/bundle.min.js
4. Compile all typescript-files in src/less into dist/public/css/main.css
5. Minify javascript and css output
6. Copy all other files to the dist/debug/ directory
7. Remove html segments that are wrapped in "publish remove"-statements and add html segments that are wrapped inside "publish add"-statements in all source .html files. (see --> HTML generation)


### HTML generation

In order to only maintain one version of each .html file for both debug and public versions, while linking to different scripts and stylesheets (bundle.min.js instead of bundle.js for public version for example), or similar the build scripts process all .html files in the following way:

1. All code wrapped in "publish remove"- Statements will be deleted for public version and therefore only be available for debug version:

```html
  <!-- %Publish remove - START%-->
    <script src="js/bundle.js"></script>
  <!-- %Publish remove - END%-->
```
2. All code wrapped in "publish remove"- Statements will be added for public version and be ignored in the debug version:

```html
  <!--%Publish add - START%
    <script src="js/bundle.min.js"></script>
  %Publish add - END-->
```

This process is part of the ```npm run makepublichtml``` command which is part of the ```npm run publicall``` command

#### Using Visual Studio Code

If you're using VS Code you can use the tasks from .vscode/tasks.json to quickly access scripts or map them to shortcuts

## Author

👤 **Luca Elsen**

* Github: [@Topograph](https://github.com/Topograph)

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_