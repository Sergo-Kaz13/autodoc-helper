import { login } from "./modules/login.js";
import { printAWS } from "./modules/printAWS.js";
import { printTWO } from "./modules/printTWO.js";
import { filterTable } from "./modules/filterTable.js";

(function () {
  "use strict";
  let observer = null;
  const routes = [
    {
      match: /^\/login/,
      action: login,
      cleanup: () => {
        observer?.disconnect();
        observer = null;
        document.getElementById("btnPrintAWSAuto")?.remove();
      },
    },
    {
      match: /^\/packing-transfer/,
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
    if (currentRoute?.cleanup) {
      currentRoute.cleanup();
    }
    for (const r of routes) {
      if (r.match.test(path)) {
        currentRoute = r;
        r.action();
        return;
      }
    }
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
