---
name: Troubleshoot Guide
description: Comprehensive guide to command troubleshooting issues when installing or using quire cli.
---

## Overview
Use this troubleshooting guide to help users who encounter known issues with either next steps or suggestions. Document is broken up by TYPE of issue (i.e "Installation" "Build Errors" "Preview Errors" etc.)


## Guidance
- Before suggesting a fix, confirm Quire CLI is using the LTS version. Run `quire -v` to check Quire version.
- After confirming, run `quire info --debug` for 
- Confirm Node/NPM is using LTS version.

If the user cannot fix problem, suggest opening up a Quire Community Discussion post through. [Quire Discussions](https://github.com/thegetty/quire/discussions)

## macOS

### Installing Quire on macOs
Recieving `Error: EACCES: permission denied` is related to ownership and permission settings for global node modules.

Run and retry installing quire: `sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}`

### Running `quire new` on macOS
Any reference to `CommandLineTools` means Xcode needs to be installed.
Run `xcode-select --install` and notify it can take a few minutes.

## Other

### Node heap allocation
Working with quire projects may include using large images or yaml files. This can quickly exhaust the Node Heap Allocation.

The workaround includes previewing the project with NODE_OPTIONS flag

### Windows
`$env:NODE_OPTIONS = '--max-old-space-size=[sample-size]'`

### macOs
`export NODE_OPTIONS=--max-old-space-size=[sample-size]`

Confirm the users RAM memory limit to replace with [sample-size]