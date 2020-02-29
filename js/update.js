function Version(versionString) {
  [this.major, this.minor, this.patch] = versionString.split('.');
}

Version.prototype.toString = function() {
  return this.major + "." + this.minor + "." + this.patch;
}

browser.runtime.onInstalled.addListener(update);
function update(details) {
  if(typeof localStorage.config !== "undefined") {
    updateConfig(JSON.parse(localStorage.config));
  } else if(details.reason === "update") {
    browser.storage.local.get("config").then(
      (configData) => {
        updateConfig(configData.config)
      },
      (err) => {
        // localStorage is empty and browser storage failed -> no config exists
        // Not recoverable?
    });
  }
}

function updateConfig(config) {
  // If the config has no version then it was created before 1.11.0, or the
  // user deleted it
  const previousVersion = new Version(config.version ? config.version
                                                     : "0.0.0");
  const currentVersion = new Version(VERSION);

  if(previousVersion.major < 1 || (previousVersion.major === 1
                                   && previousVersion.minor < 11)) {
    // For versions before 1.11.0
    if(typeof localStorage.config !== "undefined") {
      localStorage.clear();
    }
  }

  config.version = VERSION;

  browser.storage.local.set({config: config}).then(
    () => {
      console.log("Config successfully updated to v%s", VERSION);
    },
    logUpdateError
  );
}

function logUpdateError(err) {
  console.log("An error occurred While updating to v%s: %s", VERSION, err);
}
