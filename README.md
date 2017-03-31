<p align="center">
    <img alt="logo" src="/img/readme/logo.png?raw=true"><br><br><br>
    <img alt="example screenshot" src="/img/readme/screenshot-29032017-1.png?raw=true" width="400px">
    <img alt="example screenshot" src="/img/readme/screenshot-29032017-3.png?raw=true" width="400px"><br>
    <img alt="example screenshot" src="/img/readme/screenshot-29032017-4.png?raw=true" width="400px">
    <img alt="example screenshot" src="/img/readme/screenshot-29032017-2.png?raw=true" width="400px">
</p>


## Installation

Download a [release](https://github.com/fuyuneko/startpage/releases), or
download the [zip](https://github.com/fuyuneko/startpage/archive/master.zip)
of the latest version on GitHub.


##### Firefox

Download an extension that lets you change the newtab page, then just add the
path to `index.html` as the URL, e.g.:
`file:///home/yuki/startpage/index.html` or `file:///c:/startpage/index.html`

If you're using an older version of Firefox you can simply change
`browser.newtab.url` in `about:config`.

##### Chromium/Chrome

Download the `.crx file` from the
[latest release](https://github.com/fuyuneko/startpage/releases/latest) and open
it with Chrome.<br>
If a `.crx` file for a release isn't available or you want to use the latest
version on GitHub you will have to
[download](https://github.com/fuyuneko/startpage/blob/chromium-patch/manifest.json)
the manifest.json and save it in the same directory as the startpage. Go to
Chrome's extension menu, enable _developer mode_, click on
_"load unpacked extension"_ and select the folder you saved the startage in.


## Usage

The config menu can be opened any time by writing `-config` into the search
square or by writing `search("-config")` into the browser console.

The arrow keys can be used to navigate the squares: left and right will move to
a different square and up and down will move between links in a square. The
selected link can then be visited by pressing enter.


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
[here](https://github.com/fuyuneko/startpage/issues).

