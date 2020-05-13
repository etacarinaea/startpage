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
