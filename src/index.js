import { login } from "./modules/login.js";
import { printAWS } from "./modules/printAWS.js";
import { printTWO } from "./modules/printTWO.js";
import { filterTable } from "./modules/filterTable.js";

(function () {
  "use strict";
  const routes = [
    {
      match: /^\/login/,
      // match: /\/login/,
      action: login,
      cleanup: () => {
        document.getElementById("btnPrintAWSAuto")?.remove();
      },
    },
    {
      match: /^\/packing-transfer/,
      // match: /\/packing-transfer/,
      action: () => {
        printAWS();
        printTWO();
        filterTable();
      },
      cleanup: () => {
        document.getElementById("btnContainer")?.remove();
        document.getElementById("btnPrintTWO")?.remove();
      },
    },
  ];
  let currentRoute = null;
  function router() {
    const path = location.pathname;
    console.log("Router called, path:", path);
    if (currentRoute?.cleanup) {
      currentRoute.cleanup();
    }
    for (const r of routes) {
      if (r.match.test(path)) {
        console.log("Route matched:", r);
        currentRoute = r;
        r.action();
        return;
      }
    }
    console.log("No route matched");
  }

  // --- SPA navigation hook ---
  const push = history.pushState;
  history.pushState = function () {
    push.apply(this, arguments);
    router();
  };
  const replace = history.replaceState;
  history.replaceState = function () {
    replace.apply(this, arguments);
    router();
  };
  window.addEventListener("popstate", router);
  router();
})();
