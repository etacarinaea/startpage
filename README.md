<p align="center">
  <img alt="logo" src="/img/readme/logo.png?raw=true"><br><br><br>
  <img alt="example screenshot" src="/img/readme/screenshot-20190601.png?raw=true" width="800px">
</p>


## Installation

Just install the [Firefox add-on][1].

If you're using a different browser:<br>
Download a [release][2], download the [zip][3] of the latest version on GitHub,
or just clone the repository.  If your browser doesn't support the
[WebExtensions API][4] You'll have to find a way to overwrite the newtab page of
your browser and select `index.html` as the new one.

##### Chromium/Chrome

Download the `.crx file` from the [latest release][5] and open it with Chrome.

##### GitHub Pages

The startpage is hosted on [GitHub pages](http://etacarinaea.github.io/startpage/)
for demonstration purposes. You can set your newtab url to that site, but I
can't guarantee the GitHub pages version will always be up-to-date.


## Usage

The config menu can be opened any time by writing `-config` into the search
square or by writing `search("-config")` into the browser console.

The arrow keys can be used to navigate the squares: left and right will move to
a different square and up and down will move between links in a square. The
selected link can then be visited by pressing enter.

The tab key automatically selects the search field.


## Configuration

The startpage can be configured by using a configuration file or by using the
built-in menu.<br>
If you're using some sort of private/incognito mode in your browser the
configuration will not be saved and has to be loaded from `config.json`
every time the page is reloaded. To prevent the configuration menu from
appearing every time you load the page you will have to set `privateMode`
to `true` in `config.json`.

When first opening the startpage you can choose to load the configuration from
the `config.json` file or configure the page by using the configuration
menu. Choose whatever you like, you will be able to change this later.<br>

Because of the way the configuration menu saves data, moving the startpage's
directory to a different location will result in it not being able to load the
config. Moving it back should fix it. You can export the configuration as a JSON
file in the menu, then move the directory and import it again.


## Contact

If you're having problems or have an improvement you can create an issue
[here][6].


## More examples

<p align="center">
  <img alt="example screenshot" src="/img/readme/screenshot-29032017-1.png?raw=true" width="400px">
  <img alt="example screenshot" src="/img/readme/screenshot-29032017-3.png?raw=true" width="400px"><br>
  <img alt="example screenshot" src="/img/readme/screenshot-29032017-4.png?raw=true" width="400px">
  <img alt="example screenshot" src="/img/readme/screenshot-29032017-2.png?raw=true" width="400px">
</p>


[1]: https://addons.mozilla.org/en-US/firefox/addon/square-startpage/
[2]: https://github.com/etacarinaea/startpage/releases
[3]: https://github.com/etacarinaea/startpage/archive/master.zip
[4]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
[5]: https://github.com/etacarinaea/startpage/releases/latest
[6]: https://github.com/fuyuneko/startpage/issues
