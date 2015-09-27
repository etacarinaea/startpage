startpage
====
Menu to configure the look of the page.

Will show up the first time the page is loaded or when the user inputs "-c" into the search field.

The menu can also be opened by inputting ```search("-c")``` into the console.

<br>
###### TODO
- [x] fill options with placeholders if no callback is defined
- [x] fix flash on load
- [x] add export/import function and buttons

<br>
###### JSON
| attribute         | if true                                          |
| ----------------- | ------------------------------------------------ |
| borders           | enables borders on top and bottom                |
| alwaysopen        | makes all squares open on load                   |
| mascot            | enables image in the bottom right hand corner    |
| allowVersionCheck | allows to check for the latest Version on github |

The version is only checked for if the help popup shows up.

The _images_ array is a list of all mascot images to be used. If you want to use only one image just create an array with one item.

<br>
###### HTML
To add/remove a square just add/remove a _div .sqr_ within _div #cell_.<br>
Keep the structure like this:
```
<div class="sqr">
    <span>HEADING</span>
    <div class="content">
        <a href="URL">LINK TITLE</a><br>
        <a href="URL">LINK TITLE</a><br>
        ...
        <a href="URL">LINK TITLE</a>
    </div>
</div>
```

<br>
###### search
```
-c      Opens the configuration menu
-h      Show this list
-g      Google (default)
-a      DuckDuckGo
-d      danbooru
-y      YouTube
-n      niconicodouga
-p      pixiv
```
The following example will search for _github_ using _DuckDuckGo_:<br>
-a github<br>
If an invalid search option or none at all is specified, Google is used.
For danbooru, use underscores (_) for tags with more than one word and separate multiple tags with space (e.g.: school_uniform 1girl).
