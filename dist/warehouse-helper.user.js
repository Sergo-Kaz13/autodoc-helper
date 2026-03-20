// ==UserScript==
// @name         Warehouse Helper
// @namespace    https://github.com/Sergo-Kaz13/autodoc-helper
// @version      1.0.2
// @description  Automates warehouse workflow on m13.autodoc.de: auto-login, AWS/TWO printing and table filtering
// @author       Sergo_Kaz
// @match        http://127.0.0.1:5500/*
// @match        https://m13.autodoc.de/*
// @grant        none
// @icon         https://png.pngtree.com/png-clipart/20191122/original/pngtree-hammer-and-wrench-vector-illustration-with-simple-design-isolated-on-white-png-image_5162773.jpg
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/Sergo-Kaz13/autodoc-helper/main/dist/warehouse-helper.user.js
// @downloadURL  https://raw.githubusercontent.com/Sergo-Kaz13/autodoc-helper/main/dist/warehouse-helper.user.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/filterTable.js"
/*!************************************!*\
  !*** ./src/modules/filterTable.js ***!
  \************************************/
(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.filterTable = filterTable;
function filterTable() {
  if (document.getElementById("searchBlock")) return;
  let searchType = "Article No"; // Default search type
  // Get table reference
  function init(table) {
    function createTfoot(table) {
      const colCount = table.querySelector("thead tr")?.cells.length ?? 0;
      if (!colCount) return; // таблиця без thead — виходимо
      const headers = Array.from(table.querySelectorAll("thead th"));
      const qtyIndex = headers.findIndex(th => th.textContent.trim().toLowerCase() === "qty");
      const packedIndex = headers.findIndex(th => th.textContent.trim().toLowerCase() === "packed qty");
      const hasQty = qtyIndex !== -1;
      const hasPacked = packedIndex !== -1;
      if (!hasQty && !hasPacked) return;
      // const tfood = document.createElement("tfoot");
      const tfoodRow = document.createElement("tr");
      tfoodRow.classList.add("summary-row");
      for (let i = 0; i < colCount; i++) {
        const td = document.createElement("td");
        if (i === qtyIndex) {
          td.id = "totalQty";
          td.style.color = "white";
          td.style.fontWeight = "bold";
          //td.style.backgroundColor = "white";
          td.textContent = "0";
        } else if (i === packedIndex) {
          td.id = "totalPackedQty";
          td.style.color = "white";
          td.style.fontWeight = "bold";
          //td.style.backgroundColor = "white";
          td.textContent = "0";
        }
        tfoodRow.appendChild(td);
      }
      // tfood.appendChild(tfoodRow);
      const tbody = table.querySelector("tbody");
      if (tbody) tbody.prepend(tfoodRow);
      // table.appendChild(tfood);
    }
    if (table) createTfoot(table);

    // Function to calculate totals
    function calculateTotals() {
      const totalQtyEl = document.getElementById("totalQty");
      const totalPackedQtyEl = document.getElementById("totalPackedQty");
      if (!totalQtyEl || !totalPackedQtyEl) return;
      const headers = Array.from(table.querySelectorAll("thead th"));
      const qtyIndex = headers.findIndex(th => th.textContent.trim().toLowerCase() === "qty");
      const packedIndex = headers.findIndex(th => th.textContent.trim().toLowerCase() === "packed qty");
      const rows = table.querySelectorAll("tbody tr");
      let totalQty = 0;
      let totalPackedQty = 0;
      rows.forEach(row => {
        if (row.classList.contains("summary-row")) return;
        if (row.style.display !== "none") {
          totalQty += parseInt(row.cells[qtyIndex]?.textContent) || 0;
          totalPackedQty += parseInt(row.cells[packedIndex]?.textContent) || 0;
        }
      });
      totalQtyEl.textContent = totalQty;
      totalPackedQtyEl.textContent = totalPackedQty;
    }
    calculateTotals();

    // Create search block
    const searchBlock = document.createElement("div");
    searchBlock.style.position = "fixed";
    searchBlock.style.bottom = "10px";
    searchBlock.style.right = "10px";
    searchBlock.style.padding = "10px";
    searchBlock.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    searchBlock.style.border = "1px solid #ccc";
    searchBlock.style.borderRadius = "5px";
    searchBlock.style.zIndex = "1000";
    searchBlock.style.display = "none";
    searchBlock.id = "searchBlock";
    // Block for input and reset button
    const blockInput = document.createElement("div");
    blockInput.style.display = "flex";
    blockInput.style.gap = "5px";
    searchBlock.appendChild(blockInput);
    // Search input
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Search";
    input.style.width = "100%";
    blockInput.appendChild(input);
    input.addEventListener("input", () => {
      const searchTerm = input.value.toLowerCase().trim();
      const thIndex = searchIndexColumn(table, searchType);
      getDataRows(thIndex, table, searchTerm);
    });
    // Reset button
    const resetButton = document.createElement("button");
    resetButton.innerHTML = "&#10005;";
    resetButton.style.background = "transparent";
    resetButton.style.border = "none";
    resetButton.style.cursor = "pointer";
    resetButton.style.color = "red";
    resetButton.style.fontWeight = "bold";
    blockInput.appendChild(resetButton);
    // Reset input on button click
    resetButton.addEventListener("click", () => {
      input.value = "";
      const thIndex = searchIndexColumn(table, searchType);
      getDataRows(thIndex, table);
      input.focus();
    });
    // Radio buttons for search type
    const radioBlock = document.createElement("div");
    radioBlock.style.marginTop = "10px";
    const radio1 = document.createElement("input");
    radio1.type = "radio";
    radio1.name = "searchType";
    radio1.value = "Article No";
    radio1.setAttribute("style", "appearance: radio !important;");
    radio1.id = "articleNo";
    radio1.checked = true;
    const label1 = document.createElement("label");
    label1.htmlFor = "articleNo";
    label1.textContent = "Article No";
    radioBlock.appendChild(radio1);
    radioBlock.appendChild(label1);
    const radio2 = document.createElement("input");
    radio2.type = "radio";
    radio2.name = "searchType";
    radio2.value = "Brand";
    radio2.setAttribute("style", "appearance: radio !important;");
    radio2.id = "brand";
    const label2 = document.createElement("label");
    label2.htmlFor = "brand";
    label2.textContent = "Brand";
    radioBlock.appendChild(radio2);
    radioBlock.appendChild(label2);
    const radio3 = document.createElement("input");
    radio3.type = "radio";
    radio3.name = "searchType";
    radio3.value = "Category";
    radio3.setAttribute("style", "appearance: radio !important;");
    radio3.id = "category";
    const label3 = document.createElement("label");
    label3.htmlFor = "category";
    label3.textContent = "Category";
    radioBlock.appendChild(radio3);
    radioBlock.appendChild(label3);
    // End of radio buttons
    // Toggle search block with Ctrl + Shift + F
    document.addEventListener("keydown", e => {
      if (e.ctrlKey && e.shiftKey && e.key === "F") {
        searchBlock.style.display = searchBlock.style.display === "none" ? "block" : "none";
        if (searchBlock.style.display === "none") {
          input.value = "";
          const thIndex = searchIndexColumn(table, searchType);
          getDataRows(thIndex, table);
        } else {
          input.focus();
        }
      }
    });
    // Update search type on radio button change
    // Log selected search type
    radioBlock.addEventListener("change", e => {
      searchType = e.target.value;
      const thIndex = searchIndexColumn(table, searchType);
      getDataRows(thIndex, table, input.value.toLowerCase().trim());
    });
    searchBlock.appendChild(radioBlock);
    document.body.appendChild(searchBlock);
    // Function to find the index of the column based on the search type
    function searchIndexColumn(table, searchType) {
      const th = table.querySelectorAll("thead th");
      const thArray = Array.from(th);
      const thIndex = thArray.findIndex(th => th.textContent.toLowerCase().trim() === searchType.toLowerCase().trim());
      return thIndex;
    }
    // Log the index of the column to be searched
    function getDataRows(thIndex, table, searchTerm = "") {
      if (thIndex !== -1) {
        const rows = table.querySelectorAll("tbody tr");
        rows.forEach(row => {
          if (row.classList.contains("summary-row")) return;
          const cells = row.cells[thIndex];
          const cellText = cells.textContent.toLowerCase().trim();
          if (cellText.includes(searchTerm)) {
            row.style.display = "";
          } else {
            row.style.display = "none";
          }
        });
        calculateTotals();
      }
    }
    const observer = new MutationObserver(() => {
      const newTable = document.querySelector("table");
      if (newTable && newTable !== table) {
        table = newTable;
        createTfoot(table);
        calculateTotals();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  // Function to create tfoot with totals
  const table = document.querySelector("table");
  if (table) {
    init(table);
    return;
  }
  const observer = new MutationObserver(() => {
    const table = document.querySelector("table");
    if (table) {
      observer.disconnect();
      init(table);
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/***/ },

/***/ "./src/modules/login.js"
/*!******************************!*\
  !*** ./src/modules/login.js ***!
  \******************************/
(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.login = login;
function login() {
  if (document.getElementById("btnContainer")) return;
  const btnAutoPrint = document.getElementById("btnPrintAWSAuto");
  if (btnAutoPrint) btnAutoPrint.remove();
  const USER_KEY = "workAdminUser";
  let modal; // Button Data
  const buttonsData = [{
    text: "\u{1F9D1}\u200D\u{1F4BC}",
    onclick: handleAccountClick
  }, {
    text: "\u270E",
    onclick: handleEditClick
  }]; // Create Buttons Container
  const btnContainer = document.createElement("div");
  btnContainer.id = "btnContainer";
  btnContainer.style.position = "fixed";
  btnContainer.style.zIndex = "9999";
  btnContainer.style.display = "flex";
  btnContainer.style.gap = "5px";
  btnContainer.style.right = "20px";
  btnContainer.style.bottom = "20px";
  buttonsData.forEach(({
    text,
    onclick
  }) => {
    const button = document.createElement("button");
    button.textContent = text;
    button.style.backgroundColor = "#fff";
    button.style.color = "#3C3C3C";
    button.style.width = "40px";
    button.style.height = "40px";
    button.style.fontSize = "20px";
    button.style.borderRadius = "5px";
    button.style.border = "1px solid #555";
    button.style.cursor = "pointer";
    button.addEventListener("click", onclick);
    button.addEventListener("mouseover", () => {
      button.style.boxShadow = "0 0 5px #B9BDBA";
    });
    button.addEventListener("mouseout", () => {
      button.style.boxShadow = "none";
      button.style.backgroundColor = "#fff";
      button.style.color = "#3C3C3C";
    });
    btnContainer.appendChild(button);
  });
  document.body.appendChild(btnContainer); // --------------------------
  // Button Handlers
  // --------------------------
  function handleAccountClick() {
    const user = getFromLocalStorage(USER_KEY);
    if (!user) {
      alert("No user found.");
      return;
    }
    autoFillLogin(user);
  }
  function handleEditClick() {
    const user = getFromLocalStorage(USER_KEY);
    if (user) {
      openModal(renderUserActions());
    } else {
      openModal(renderUserForm());
    }
  } // --------------------------
  // Local Storage Helpers
  // --------------------------
  function getFromLocalStorage(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error("Error getting from localStorage", error);
      return defaultValue;
    }
  }
  function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  function removeUser() {
    localStorage.removeItem(USER_KEY);
  } // --------------------------
  // Modal Helpers
  // --------------------------
  function openModal(content) {
    closeModal();
    const blockFocus = e => {
      if (!modal.contains(e.target)) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    };
    document.addEventListener("focus", blockFocus, true);
    modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.inset = "0";
    modal.style.background = "rgba(0,0,0,0.6)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "10000";
    const box = document.createElement("div");
    box.style.background = "#2B2B2B";
    box.style.padding = "20px";
    box.style.borderRadius = "8px";
    box.style.minWidth = "300px";
    box.style.color = "#fff";
    box.appendChild(content);
    modal.appendChild(box);
    document.body.appendChild(modal);
    setTimeout(() => {
      const firstInput = modal.querySelector("input");
      if (firstInput) firstInput.focus();
    }, 0);

    // Зберігаємо щоб потім зняти
    modal._blockFocus = blockFocus;
  }
  function closeModal() {
    if (modal) {
      document.removeEventListener("focus", modal._blockFocus, true);
      modal.remove();
    }
    modal = null;
  } // --------------------------
  // Render User Actions
  // --------------------------
  function renderUserActions() {
    const wrapper = document.createElement("div");
    const info = document.createElement("p");
    info.textContent = "User already exists";
    info.style.marginBottom = "15px";
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete user";
    deleteBtn.onclick = () => {
      removeUser();
      closeModal();
    };
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.style.marginLeft = "10px";
    closeBtn.onclick = closeModal;
    wrapper.append(info, deleteBtn, closeBtn);
    return wrapper;
  } // --------------------------
  // Render User Form
  // --------------------------
  function renderUserForm() {
    const wrapper = document.createElement("div");
    wrapper.style.padding = "30px";
    const barcode = document.createElement("input");
    barcode.placeholder = "Barcode";
    const workplace = document.createElement("input");
    workplace.placeholder = "Workplace";
    [barcode, workplace].forEach(i => {
      i.style.display = "block";
      i.style.width = "100%";
      i.style.marginBottom = "10px";
      i.style.padding = "8px";
    });
    const addBtn = document.createElement("button");
    addBtn.textContent = "Add user";
    addBtn.onclick = () => {
      const barcodeValue = barcode.value.trim();
      const workplaceValue = workplace.value.trim();
      if (!barcodeValue || !workplaceValue) return;
      setUser({
        barcode: barcodeValue,
        workplace: workplaceValue
      });
      closeModal();
    };
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.style.marginLeft = "10px";
    closeBtn.onclick = closeModal;
    wrapper.append(barcode, workplace, addBtn, closeBtn);
    return wrapper;
  } // --------------------------
  // Auto-fill login
  // --------------------------
  function autoFillLogin(user) {
    const barcodeInput = document.querySelector('input[name="barcode"]');
    const workplaceInput = document.querySelector('input[name="workplace"]');
    const submitButton = document.querySelector("button.btn--fluid[type='submit']");
    if (!barcodeInput || !workplaceInput || !submitButton) {
      console.warn("Inputs or submit button not found");
      return;
    }
    barcodeInput.value = user.barcode;
    barcodeInput.dispatchEvent(new Event("input", {
      bubbles: true
    }));
    workplaceInput.value = user.workplace;
    workplaceInput.dispatchEvent(new Event("input", {
      bubbles: true
    }));
    submitButton.click();
  }
}

/***/ },

/***/ "./src/modules/printAWS.js"
/*!*********************************!*\
  !*** ./src/modules/printAWS.js ***!
  \*********************************/
(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.printAWS = printAWS;
function printAWS() {
  let observer = null;
  if (document.getElementById("btnPrintAWSAuto")) return;
  const loginContainer = document.getElementById("btnContainer");
  if (loginContainer) loginContainer.remove();
  // Створюємо кнопку
  const btnPrint = document.createElement("button");
  btnPrint.textContent = "\u{1F5A8}";
  btnPrint.id = "btnPrintAWSAuto";
  document.body.appendChild(btnPrint);
  btnPrint.style.position = "fixed";
  btnPrint.style.bottom = "28px";
  btnPrint.style.left = "480px";
  btnPrint.style.fontSize = "24px";
  btnPrint.style.textDecoration = "none";
  btnPrint.style.cursor = "pointer";
  btnPrint.style.zIndex = "1000";
  btnPrint.style.display = "block";
  btnPrint.style.width = "30px";
  btnPrint.style.height = "30px";
  btnPrint.style.textAlign = "center";
  btnPrint.style.border = "1px solid #b9bdba";
  btnPrint.style.borderRadius = "4px";
  btnPrint.style.backgroundColor = "#fff";
  btnPrint.style.color = "#3c3c3c";
  btnPrint.style.lineHeight = "32px";
  btnPrint.addEventListener("mouseover", () => {
    btnPrint.style.boxShadow = "0 0 5px #b9bdba";
  });
  btnPrint.addEventListener("mouseout", () => {
    btnPrint.style.boxShadow = "none";
  });
  let clickTimer = null;
  btnPrint.addEventListener("click", e => {
    //e.preventDefault(); // щоб не переходити по href
    clickTimer = setTimeout(() => {
      const printTRF = document.querySelectorAll(".aside-info__item span");
      if (!printTRF.length) {
        console.error("Не знайдено TRF елемент!");
        return;
      }
      //console.log(printTRF[2].textContent)
      const numberTRF = printTRF[2].textContent.replace(/\D/g, "");
      //console.log(numberTRF)
      if (!numberTRF) {
        console.error("Не вдалося отримати номер TRF!");
        return;
      }
      const url = `https://aws.autodoc.de/store/transfer/list-pdf/${numberTRF}/list?palletsCount=1`;
      window.open(url, "_blank");
    }, 250);
  });
  // dblclick
  btnPrint.addEventListener("dblclick", () => {
    clearTimeout(clickTimer);
    const printTRF = document.querySelectorAll(".aside-info__item span");
    if (!printTRF.length) {
      console.error("Не знайдено TRF елемент!");
      return;
    }
    //console.log(printTRF[2].textContent)
    const numberTRF = printTRF[2].textContent.replace(/\D/g, "");
    //console.log(numberTRF)
    if (!numberTRF) {
      console.error("Не вдалося отримати номер TRF!");
      return;
    }
    const url = `https://aws.autodoc.de/store/transfer/list-pdf/${numberTRF}/list?palletsCount=2`;
    window.open(url, "_blank");
  });
  // auto pritn window
  if (observer) return;
  observer = new MutationObserver(() => {
    const desc = document.querySelector(".modal-action__desc");
    if (!desc) return;
    if (!desc.textContent.includes("Transfer is packed")) return;
    const modal = desc.closest(".modal");
    if (!modal) return;
    if (modal.dataset.handled) return;
    modal.dataset.handled = "true";
    modal.querySelector(".btn-round--close")?.click();
    const printTRF = document.querySelectorAll(".aside-info__item span");
    if (!printTRF) {
      console.error("Не знайдено TRF елемент!");
      return;
    }
    //console.log(printTRF[2].textContent)
    const numberTRF = printTRF[2].textContent.replace(/\D/g, "");
    //console.log(numberTRF)
    if (!numberTRF) {
      console.error("Не вдалося отримати номер TRF!");
      return;
    }
    const url = `https://aws.autodoc.de/store/transfer/list-pdf/${numberTRF}/list?palletsCount=1`;
    window.open(url, "_blank");
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/***/ },

/***/ "./src/modules/printTWO.js"
/*!*********************************!*\
  !*** ./src/modules/printTWO.js ***!
  \*********************************/
(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.printTWO = printTWO;
function printTWO() {
  const btn = document.createElement("button");
  btn.textContent = "Print TWO";
  btn.id = "btnPrintTWO";
  btn.style.position = "fixed";
  btn.style.bottom = "32px";
  btn.style.left = "390px";
  btn.style.zIndex = "9999";
  btn.style.padding = "3px";
  btn.style.backgroundColor = "#4CAF50";
  btn.style.color = "white";
  btn.style.border = "none";
  btn.style.borderRadius = "5px";
  btn.style.cursor = "pointer";
  document.body.appendChild(btn);
  btn.addEventListener("click", async () => {
    const isTwoOrder = document.querySelector(".aside-info__item span")?.textContent?.trim()?.slice(0, 3)?.toLowerCase() === "two";
    if (!isTwoOrder) {
      //alert("This is not a TWO order!");
      //return;
    }
    btn.disabled = true; // щоб не клікали 10 разів
    btn.textContent = "Processing...";
    await processTable();
    btn.textContent = "Done ✅";
    btn.disabled = false;
  });
  function getColumnIndexes() {
    const headers = Array.from(document.querySelectorAll("table thead th"));
    const indexes = {};
    headers.forEach((th, index) => {
      const text = th.textContent.trim().toLowerCase();
      if (text.includes("article no")) indexes.article = index;
      if (text === "qty") indexes.qty = index;
      if (text.includes("packed qty")) indexes.packed = index;
    });
    return indexes;
  }
  async function processTable() {
    let safetyCounter = 0;
    while (safetyCounter++ < 1000) {
      console.log(safetyCounter);
      const indexes = getColumnIndexes();
      const rows = Array.from(document.querySelectorAll("table tbody tr"));
      console.log(rows);
      const rowToProcess = rows.find(row => {
        const cells = row.children;
        const qty = parseInt(cells[indexes.qty].textContent.trim());
        const packed = parseInt(cells[indexes.packed].textContent.trim());
        return qty !== packed;
      });
      if (!rowToProcess) continue;
      console.log(rowToProcess);
      const articleNo = rowToProcess.children[indexes.article].textContent.trim();
      const packedBefore = parseInt(rowToProcess.children[indexes.packed].textContent.trim());
      await processArticle(articleNo);
      await waitForRowUpdate(articleNo, packedBefore);
      //await waitForDomUpdate();
    }
    console.log("Все оброблено ✅");
  }
  async function processArticle(articleNo) {
    const input = document.querySelector(".input__field");
    const button = document.querySelector("button.btn-round[type='submit']");
    if (!input || !button) {
      alert("Input field or button not found! Please check the selectors.");
      btn.textContent = "Print TWO";
      btn.disabled = false;
      console.error("Не знайдено поле вводу або кнопку!");
      return;
    }
    input.value = articleNo;
    input.dispatchEvent(new Event("input", {
      bubbles: true
    }));
    button.click();
    console.log("Обробляємо:", articleNo);
  }
  async function waitForRowUpdate(articleNo, prevPacked) {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        const indexes = getColumnIndexes();
        const rows = Array.from(document.querySelectorAll("table tbody tr"));
        const row = rows.find(r => r.children[indexes.article].textContent.trim() === articleNo);
        if (!row) return;
        const newPacked = parseInt(row.children[indexes.packed].textContent.trim());
        if (newPacked !== prevPacked) {
          clearInterval(interval);
          resolve();
        }
      }, 200);
    });
  }
}

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/


var _login = __webpack_require__(/*! ./modules/login.js */ "./src/modules/login.js");
var _printAWS = __webpack_require__(/*! ./modules/printAWS.js */ "./src/modules/printAWS.js");
var _printTWO = __webpack_require__(/*! ./modules/printTWO.js */ "./src/modules/printTWO.js");
var _filterTable = __webpack_require__(/*! ./modules/filterTable.js */ "./src/modules/filterTable.js");
(function () {
  "use strict";

  const routes = [{
    match: /^\/login/,
    // match: /\/login/,
    action: _login.login,
    cleanup: () => {
      document.getElementById("btnPrintAWSAuto")?.remove();
    }
  }, {
    match: /^\/packing-transfer/,
    // match: /\/packing-transfer/,
    action: () => {
      (0, _printAWS.printAWS)();
      (0, _printTWO.printTWO)();
      (0, _filterTable.filterTable)();
    },
    cleanup: () => {
      document.getElementById("btnContainer")?.remove();
      document.getElementById("btnPrintTWO")?.remove();
    }
  }];
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
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", router);
  } else {
    router();
  }
})();
})();

/******/ })()
;