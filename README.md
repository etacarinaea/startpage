startpage
====

![example screenshot](/img/screenshots/2015-12-26-closed.png?raw=true)
![example screenshot open](/img/screenshots/2015-12-26-open.png?raw=true)


<br>
### Configuration
Configuration can be done using the configuration menu or by editing 
```config.json``` in the startpage's directory.

<br>
##### Configuration Menu
A menu to configure the startpage  will be displayed the first time the page
is loaded. It can be opened anytime by entering ```-config``` into the search
field. If you don't have a search square you can still access the menu by
entering ```search("-config")``` into the browser's console.

##### Squares
When editing ```config.json``` a normal square can be added by adding another
object to the ```squares``` array. The order in which they are defined in the
file will be the same one used to display them.

Example:
```
{"name":"NAME", "links": [
    {"name": "LINK1", "url": "http://www.example.com"},
    {"name": "LINK2", "url": "http://www.example.com"}
]},
```

##### Appearance
| attribute         | if true                                          |
| ----------------- | ------------------------------------------------ |
| borders           | enables borders on top and bottom                |
| alwaysopen        | makes all squares open on load                   |
| mascot            | enables image in the bottom right hand corner    |
| allowVersionCheck | allows to check for the latest Version on github |
| privateMode       | will always load config.json                     |

The version is only checked for if the help popup shows up.
Set privateMode to ```true``` if you're always using your browser's private mode.

The _images_ array is a list of all mascot images to be used. If you want to
use only one image just create an array with one item.

##### Search
```
{"name":"search", "prefix":"-", "options": [
    {"opt": "default", "url": "https://www.google.com/#q=", "space":"+"},
    {"opt": "w", "url": "https://en.wikipedia.org/w/index.php?search=", "space":"+"}
]}
```
Prefix: The prefix used to identify an option.
Options: Default will be used if no option is given. ```opt``` is the character
you'll type after the prefix. ```url``` is the URL to use with that option.
```space``` is the character that should be used to replace space. Usually "+".

