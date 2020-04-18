function Version(versionString) {
  [this.major, this.minor, this.patch] = versionString.split('.');
}

Version.prototype.toString = function() {
  return this.major + "." + this.minor + "." + this.patch;
}

function update(details) {
  console.log("UPDATE TRIGGERED", details);
  if(details.reason === "update") {
    if(typeof localStorage.config === "undefined") {
      browser.storage.local.get("config").then(
        (configData) => {
          if(Object.keys(configData).length === 0
             && configData.constructor === Object) {
            // localStorage and storage.local are empty. Shouldn't happen on
            // updates under normal circumstances
            throw "No config found during update";
          } else {
            updateConfig(configData.config)
          }
        },
        (err) => {
          // localStorage was empty and there was an error getting storage.local
          // Not recoverable?
        }
      );
    } else {
      // If localStorage.config exists then the version is < 1.11.0
      updateConfig(JSON.parse(localStorage.config));
    }
  }
}
browser.runtime.onInstalled.addListener(update);

function updateConfig(config) {
  // We don't care about details.previousVersion because this is just about
  // updating the config
  // If the config has no version then it was created before 1.11.0, or the
  // user deleted it
  const previousVersion = new Version(config.version ? config.version
                                                     : "0.0.0");

  if(previousVersion.major < 1 || (previousVersion.major === 1
                                   && previousVersion.minor < 11)) {
    // For versions before 1.11.0
    if(typeof localStorage.config !== "undefined") {
      localStorage.clear();
    }
  }

  // Set the config version to the current version
  const currentVersionString = browser.runtime.getManifest().version;
  config.version = currentVersionString;

  browser.storage.local.set({config: config}).then(
    () => {
      console.log("Config successfully updated to v%s", currentVersionString);
    },
    logUpdateError
  );
}

function logUpdateError(err) {
  const version = browser.runtime.getManifest().version;
  console.log("An error occurred while updating to v%s: %s", version, err);
}
