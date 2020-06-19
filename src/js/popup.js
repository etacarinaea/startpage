
/**
 * Creates a Help Popup
 *
 * @param {string} searchPrefix The prefix for search options
 * @param {{opt: string, description: string}[]} searchOptions An array of search options to display
 * @param {string} bottomText A string placed below the list of search options
 */
function Popup(searchPrefix, searchOptions, bottomText) {
  this.div = document.createElement("div");
  this.div.className = "popup";

  // Construct options table
  const tr = () => document.createElement("tr");
  const td = () => document.createElement("td");
  const txtNode = (s) => document.createTextNode(s);
  // Appends a list l of nodes to n
  const append = (n, l) => {
    for (let i = 0; i < l.length; ++i) {
      n.appendChild(l[i]);
    }
    return n;
  };

  const table = document.createElement("table");
  searchOptions.unshift(
    {
      opt: "help",
      description: "Shows this help message"
    },
    {
      opt: "config",
      description: "Opens the config menu"
    }
  );
  for (const obj of searchOptions) {
    append(table, [
      append(tr(), [
        append(td(), [txtNode(searchPrefix + obj.opt)]),
        append(td(), [txtNode(obj.description)])
      ])
    ]);
  }

  append(document.body, [
    append(this.div, [
      table, txtNode(bottomText)
    ])
  ]);

  this.height = this.div.offsetHeight;
  this.hide();
}

/**
 * Moves the popup into the viewport
 */
Popup.prototype.show = function() {
  this.div.style["bottom"] = "0px";
  this.hidden = false;
}

/**
 * Moves the popup out of the viewport
 */
Popup.prototype.hide = function() {
  this.div.style["bottom"] = (-this.height) + "px";
  this.hidden = true;
}

/**
 * Moves the popup between the viewport and outside of the viewport
 */
Popup.prototype.toggle = function() {
  this.hidden ? this.show() : this.hide();
}
