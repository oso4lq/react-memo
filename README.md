# MVP Card Game "Memo"

In this repository, an MVP card of the game "Memo" is implemented according to [technical specifications](./docs/mvp-spec.md)

The project is deployed on gh pages:
https://skypro-web-developer.github.io/react-memo/

## Development

The project is implemented based on the [Create React App](https://github.com/facebook/create-react-app) template.

## Estimated time spent

8 hrs

## Actual time spent

8 hrs

## New features

Added easy mode. The player can make three mistakes with this mode enabled.

- start screen button "Enable easy mode",
- red or green indicator to show if this mode is activated,
- the counter displays only when easy mode is enabled,
- if the player picks two cards wrong, all cards flip over.

### How to develop

- Install dependencies with `npm install` command
- Start the dev server `npm start`
- Open the address in the browser

### Stack and tools

For styles in the code, css modules are used.
Configured eslint and prettier. The correctness of the code is checked automatically before each commit using lefthook (analogous to husky). You won't be able to commit code that doesn't pass eslint check.

### Available commands

#### `npm start`

Launches the application in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in a browser.

#### `npm run build`

Collects an optimized and minified production build of the application into the `build` folder.
After assembly, the application is ready for deployment.

#### `npm run deploy`

Deploys the application to github pages. Essentially, it starts the build and commits the build to the gh-pages branch.
(!) github pages must be enabled in the repository settings and configured for the gh-pages branch

#### `npm run lint`

Runs eslint code review, the same command is run before each commit.
If you can't commit, try running this command and fixing any errors or warnings.
