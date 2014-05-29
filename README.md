html
====
some stuff I use for firefox<br>
userChrome.css doesn't work with ff v29 at the moment

The startpage should work fine with all browsers.

Screenshot:
![example screenshot (140524)](http://puu.sh/8ZnKk.png)

<br>

##### Usage
The easiest way to make changes to the startpage is by editing __config.json__ and __index.html__.

<br>
###### JSON
| attribute    | if true                                              |
| ------------ | :--------------------------------------------------: |
| borders      | enables borders on top and bottom                    |
| simplesearch | only use Google for searching (removes search prefix)|
| alwaysopen   | makes all squares open on load                       |
| mascot       | enables image in the bottom right hand corner        |

The other attributes should explain themselves.
Don't make mistakes while editing the .json, otherwise the page won't react.

<br>
###### HTML
To add/remove a square just add/remove a _div .sqr_ within _div #cell_.<br>
The structure should always stay like this:
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
###### advanced search
```
-g      Google
-a      DuckDuckGo
-d      danbooru
-y      YouTube
-n      niconicodouga
-p      pixiv
```
The following example will search for _github_ using _Google_.<br>
-g github<br>
For danbooru, use underscores (_) for tags with more than one word and separate multiple tags with space (e.g.: school_uniform 1girl).
