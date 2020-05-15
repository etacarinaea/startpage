function update(details) {
  console.log("UPDATE TRIGGERED", details);
  if(details.reason === "update") {
    const tryLocalStorage = () => {
      // undefined || empty
      if(typeof localStorage.config === "undefined"
         || (Object.keys(localStorage.config).length === 0
             && localStorage.config.constructor === Object)) {
        // localStorage and storage.local are empty. Shouldn't happen on
        // updates under normal circumstances
        throw "No config found during update";
      } else {
        updateConfig(JSON.parse(localStorage.config));
      }
    };
    browser.storage.local.get("config").then(
      (configData) => {
        if(Object.keys(configData).length === 0
           && configData.constructor === Object) {
          // storage.local is empty, try loading localStorage
          tryLocalStorage();
        } else {
          updateConfig(configData.config)
        }
      },
      (err) => {
        // Failed to get storage.local, try loading localStorage
        tryLocalStorage();
        // Not recoverable?
      }
    );
  }
}
browser.runtime.onInstalled.addListener(update);
