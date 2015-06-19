startpage
====

![example screenshot (150619)](http://i.imgur.com/GSwXf57.png)
![example screenshot expanded (150619)](http://i.imgur.com/cA1teIS.png)


<br>

##### Usage
The easiest way to make changes is by editing _config.json_ and _index.html_.

<br>
###### JSON
| attribute    | if true                                              |
| ------------ | :--------------------------------------------------: |
| borders      | enables borders on top and bottom                    |
| alwaysopen   | makes all squares open on load                       |
| mascot       | enables image in the bottom right hand corner        |

_ref_ can take either an URL or the path to a local image.

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
