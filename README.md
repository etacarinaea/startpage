<p align="center">
  <img alt="logo" src="/readme-img/logo.png?raw=true">
</p>
<p align="center">
  <a href="https://github.com/etacarinaea/startpage/releases"><img src="https://img.shields.io/github/manifest-json/v/etacarinaea/startpage.svg?color=%23C9A0DC&label=Version" /></a>
  <a href="https://addons.mozilla.org/en-US/firefox/addon/square-startpage/"><img src="https://img.shields.io/badge/Firefox-Download-%23FF9400.svg" /></a>
  <a href="https://chrome.google.com/webstore/detail/startpage/odmjpppdiaenedpilgldapgbodindjak"><img src="https://img.shields.io/badge/Chrome%2FChromium-Download-%234285F4.svg" /></a>
</p>
<br>

Quickly access your favourite websites whenever you open a new tab


## Key Features

* Easy customisation using a built-in configuration menu, or alternatively a
  JSON file
* Keyboard controls
* Customisable search function
* Export/Import function to backup your config or to use the same one on
  multiple devices


<br><br>
<p align="center">
  <img alt="example screenshot" src="/readme-img/screenshot-20190601.png?raw=true" width="850px">
</p>
<br><br>


## Installation

Install the [Firefox add-on][1] or the [Chrome add-on][2].

If you're using a different browser:<br>
Download a [release][3], download the [zip][4] of the latest version on GitHub,
or just clone the repository. Your browser has to support the
[WebExtensions API][5] or you'll have to download an older version, find a way
to overwrite the newtab page of your browser and select `index.html` as the new
one.

##### GitHub Pages Preview

The startpage is also hosted on
[GitHub Pages](http://etacarinaea.github.io/startpage/) for demonstration
purposes. You can set your newtab URL to that site if you like, but keep in mind
that the version hosted there is an older one from the one currently available
as a browser extension.


## Usage

The config menu can be opened any time by clicking the gear icon in the
bottom-right corner of the screen, or by writing `-config` into the search
square.

The arrow keys can be used to navigate the squares: left and right will move to
a different square and up and down will move between links in a square. The
selected link can then be visited by pressing enter.

The tab key automatically selects the search field.

To use the keyboard controls the newtab page has to have focus. This
unfortunately isn't the case when opening a new tab by default in most browsers,
and I'm not aware of any workarounds, other than clicking inside the window or
pressing tab until the page gets focus.


## Configuration

The startpage can be configured by using a configuration file or by using the
built-in menu.<br>


## Contact

If you find a bug or run into problems please create an issue [here][6].


## More examples

<p align="center">
  <img alt="example screenshot" src="/readme-img/screenshot-29032017-1.png?raw=true" width="400px">
  <img alt="example screenshot" src="/readme-img/screenshot-20191004.png?raw=true" width="400px"><br>
  <img alt="example screenshot" src="/readme-img/screenshot-29032017-2.png?raw=true" width="400px">
  <img alt="example screenshot" src="/readme-img/screenshot-29032017-4.png?raw=true" width="400px">
</p>


[1]: https://addons.mozilla.org/en-US/firefox/addon/square-startpage/
[2]: https://chrome.google.com/webstore/detail/startpage/odmjpppdiaenedpilgldapgbodindjak
[3]: https://github.com/etacarinaea/startpage/releases
[4]: https://github.com/etacarinaea/startpage/archive/master.zip
[5]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
[6]: https://github.com/fuyuneko/startpage/issues
