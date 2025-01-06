## Contributions

Contributions welcome!

In order to clone the repo, you need `git-lfs` installed. You can find the installation instructions [here](https://git-lfs.github.com/).

Then, after cloing, to get started, first install the dependencies:

```sh
$ yarn
```

Then you can lint and test after making your changes:

```sh
# Lint and tests
$ yarn lint
$ yarn ts:check
$ yarn example:bare ts:check
$ yarn test

```

### Versioning

We loosely follow [Semantic Versioning](https://semver.org/) and use the `changesets` tool to manage our versioning. That means:

Given a version number MAJOR.MINOR.PATCH, increment the:

MAJOR version when there is a fundamental and incompatible API changes
MINOR version when you add functionality in a backward compatible manner or when a minor breaking changes is added
PATCH version when you make backward compatible bug fixes

#### One Major and Minor version for all packages

We keep all our @react-native-ama/\* packages synced to the same version (One True Version). This means that if you make a change to one package that requires a new version, all packages will be bumped to the same version. We do this to reduce the number of dependent issues a consumer may have and prevent miss-matching package versions.

Here are more details on using and adding changesets:

### Using changesets

Our official release path is to use automation to perform the actual publishing of our packages. The steps are to:

1. A human developer adds a changeset. Ideally this is as a part of a PR that will have a version impact on a package.
2. On merge of a PR our automation system opens a "Version Packages" PR.
3. On merging the "Version Packages" PR, the automation system publishes the packages.

#### Add a changeset

When you would like to add a changeset (which creates a file indicating the type of change), in your branch/PR issue this command:

```sh
$ yarn changeset
```

to produce an interactive menu. Navigate the packages with arrow keys and hit `<space>` to select 1+ packages. Hit `<return>` when done. Select semver versions for packages and add appropriate messages. From there, you'll be prompted to enter a summary of the change. Some tips for this summary:

1. Aim for a single line, 1+ sentences as appropriate.
2. Include issue links in GH format (e.g. `#123`).
3. You don't need to reference the current pull request or whatnot, as that will be added later automatically.

After this, you'll see a new uncommitted file in `.changesets` like:

```sh
$ git status
# ....
Untracked files:
  (use "git add <file>..." to include in what will be committed)
	.changeset/flimsy-pandas-marry.md
```

Review the file, make any necessary adjustments, and commit it to source. When we eventually do a package release, the changeset notes and version will be incorporated!

### Creating versions

On a merge of a feature PR, the changesets GitHub action will open a new PR titled `"Version Packages"`. This PR is automatically kept up to date with additional PRs with changesets. So, if you're not ready to publish yet, just keep merging feature PRs and then merge the version packages PR later.

### Publishing packages

On the merge of a version packages PR, the changesets GitHub action will publish the packages to npm.
