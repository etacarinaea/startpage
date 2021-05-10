# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.11.4] - 2021-5-10
### Fixed
* Fixed arrow keys not working

## [1.11.3] - 2021-4-10
### Fixed
* Fixes an error when `searchsquare` is undefined and `alwaysopen == true`

## [1.11.2] - 2020-8-8
### Changed
* Made duckduckgo the default search engine in the default config

## [1.11.1] - 2020-6-20
### Fixed
* Fixed the help popup for search options always showing in chrome

## [1.11.0] - 2020-5-15
### Added
* This changelog file
* npm to make "building" easier
  * `patch/` contains diffs for integrating the
    [webextension-polyfill](https://github.com/mozilla/webextension-polyfill)
  * `npm run build-ff` creates a zip containing the startpage (for firefox)
  * `npm run build-ch` creates a zip containing the patched startpage with the
    webextension-polyfill (for chrome)
* Version string in config.json; the current version of the config file
* Automatically update config based on config version string
### Changed
* Configuration data is now saved in `storage.local` instead of
  `localStorage`, as is conventional for browser extensions

## [1.10.0] - 2020-2-22
### Added
* Gear button in the bottom-right corner that opens the config menu when
  clicked
* `hide_gear_button` config option; when true hides the gear icon until hovered
  over
### Removed
* `use_json_file` config option

## [1.9.2] - 2020-2-5
### Changed
* Disable background image in default config

## [1.9.1] - 2020-2-3
### Fixed
* Fix `alwaysopen` config option not working

## [1.9.0] - 2020-1-17
### Changed
* Reworked config options for background images
  * `images`: An URL to an image (local files don't work currently)
  * `size`: The image size, e.g. `500px 250px`, `cover`
  * `filter`: An optional filter, e.g. `opacity(0.2)`


[1.11.3]: https://github.com/etacarinaea/startpage/compare/v1.11.2...v1.11.3
[1.11.2]: https://github.com/etacarinaea/startpage/compare/v1.11.1...v1.11.2
[1.11.1]: https://github.com/etacarinaea/startpage/compare/v1.11.0...v1.11.1
[1.11.0]: https://github.com/etacarinaea/startpage/compare/v1.10.0...v1.11.0
[1.10.0]: https://github.com/etacarinaea/startpage/compare/v1.9.2...v1.10.0
[1.9.2]: https://github.com/etacarinaea/startpage/compare/v1.9.1...v1.9.2
[1.9.1]: https://github.com/etacarinaea/startpage/compare/v1.9.0...v1.9.1
[1.9.0]: https://github.com/etacarinaea/startpage/compare/v1.8.2...v1.9.0
