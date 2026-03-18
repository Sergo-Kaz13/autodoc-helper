function filterTable() {
  if (document.getElementById("searchBlock")) return;
  let searchType = "Article No"; // Default search type

  function init(table) {
    // Get table reference
    // let table = document.querySelector("table");
    function initialTfoot() {
      const existing = table.querySelector("tfoot");
      if (existing) existing.remove();

      const tfoot = document.createElement("tfoot");
      const tfootRow = document.createElement("tr");
      const tfootCell1 = document.createElement("td");
      tfootRow.appendChild(tfootCell1);
      const tfootCell2 = document.createElement("td");
      tfootRow.appendChild(tfootCell2);
      const tfootCell3 = document.createElement("td");
      tfootRow.appendChild(tfootCell3);
      const tfootCell4 = document.createElement("td");
      tfootRow.appendChild(tfootCell4);
      const tfootCell5 = document.createElement("td");
      tfootCell5.id = "totalQty";
      tfootCell5.style.color = "red";
      tfootCell5.style.fontWeight = "bold";
      tfootCell5.style.backgroundColor = "white";
      tfootCell5.textContent = "0";
      tfootRow.appendChild(tfootCell5);
      const tfootCell6 = document.createElement("td");
      tfootCell6.id = "totalPackedQty";
      tfootCell6.style.color = "red";
      tfootCell6.style.fontWeight = "bold";
      tfootCell6.style.backgroundColor = "white";
      tfootCell6.textContent = "0";
      tfootRow.appendChild(tfootCell6);
      const tfootCell7 = document.createElement("td");
      tfootRow.appendChild(tfootCell7);
      const tfootCell8 = document.createElement("td");
      tfootRow.appendChild(tfootCell8);
      const tfootCell9 = document.createElement("td");
      tfootRow.appendChild(tfootCell9);
      tfoot.appendChild(tfootRow);

      const thead = table.querySelector("thead");

      if (thead) {
        table.insertBefore(tfoot, thead.nextSibling);
      } else {
        table.prepend(tfoot);
      }
      // table.appendChild(tfoot);
    }
    // Function to calculate totals
    function calculateTotals() {
      const totalQtyEl = document.getElementById("totalQty");
      const totalPackedQtyEl = document.getElementById("totalPackedQty");
      if (!totalQtyEl || !totalPackedQtyEl) return;

      const rows = table.querySelectorAll("tbody tr");
      let totalQty = 0;
      let totalPackedQty = 0;
      rows.forEach((row) => {
        if (row.style.display !== "none") {
          const qtyCell = row.cells[4];
          const packedQtyCell = row.cells[5];
          totalQty += parseInt(qtyCell.textContent) || 0;
          totalPackedQty += parseInt(packedQtyCell.textContent) || 0;
        }
      });
      totalQtyEl.textContent = totalQty;
      totalPackedQtyEl.textContent = totalPackedQty;
    }
    initialTfoot();
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
    radio3.id = "category";
    const label3 = document.createElement("label");
    label3.htmlFor = "category";
    label3.textContent = "Category";
    radioBlock.appendChild(radio3);
    radioBlock.appendChild(label3);
    // End of radio buttons
    // Toggle search block with Ctrl + Shift + F
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && e.code === "KeyF") {
        searchBlock.style.display =
          searchBlock.style.display === "none" ? "block" : "none";
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
    radioBlock.addEventListener("change", (e) => {
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
      const thIndex = thArray.findIndex(
        (th) =>
          th.textContent.toLowerCase().trim() ===
          searchType.toLowerCase().trim(),
      );
      return thIndex;
    }
    // Log the index of the column to be searched
    function getDataRows(thIndex, table, searchTerm = "") {
      if (thIndex !== -1) {
        const rows = table.querySelectorAll("tbody tr");
        rows.forEach((row) => {
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
        observer.disconnect();
        table = newTable;
        initialTfoot();
        calculateTotals();
        observer.observe(document.body, { childList: true, subtree: true });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

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
  observer.observe(document.body, { childList: true, subtree: true });
}
