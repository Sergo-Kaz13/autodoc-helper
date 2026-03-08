export function filterTable() {
  let searchType = "Article No"; // Default search type
  // Get table reference
  let table = document.querySelector("table");
  function initialTfood() {
    const tfood = document.createElement("tfoot");
    const tfoodRow = document.createElement("tr");
    const tfoodCell1 = document.createElement("td");
    tfoodRow.appendChild(tfoodCell1);
    const tfoodCell2 = document.createElement("td");
    tfoodRow.appendChild(tfoodCell2);
    const tfoodCell3 = document.createElement("td");
    tfoodRow.appendChild(tfoodCell3);
    const tfoodCell4 = document.createElement("td");
    tfoodRow.appendChild(tfoodCell4);
    const tfoodCell5 = document.createElement("td");
    tfoodCell5.id = "totalQty";
    tfoodCell5.style.color = "red";
    tfoodCell5.style.fontWeight = "bold";
    tfoodCell5.style.backgroundColor = "white";
    tfoodCell5.textContent = "0";
    tfoodRow.appendChild(tfoodCell5);
    const tfoodCell6 = document.createElement("td");
    tfoodCell6.id = "totalPackedQty";
    tfoodCell6.style.color = "red";
    tfoodCell6.style.fontWeight = "bold";
    tfoodCell6.style.backgroundColor = "white";
    tfoodCell6.textContent = "0";
    tfoodRow.appendChild(tfoodCell6);
    const tfoodCell7 = document.createElement("td");
    tfoodRow.appendChild(tfoodCell7);
    const tfoodCell8 = document.createElement("td");
    tfoodRow.appendChild(tfoodCell8);
    const tfoodCell9 = document.createElement("td");
    tfoodRow.appendChild(tfoodCell9);
    tfood.appendChild(tfoodRow);
    table.appendChild(tfood);
  }
  // Function to calculate totals
  function calculateTotals() {
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
    document.getElementById("totalQty").textContent = totalQty;
    document.getElementById("totalPackedQty").textContent = totalPackedQty;
  }
  //initialTfood();
  //calculateTotals();
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
    if (e.ctrlKey && e.shiftKey && e.key === "F") {
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
        th.textContent.toLowerCase().trim() === searchType.toLowerCase().trim(),
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
      table = newTable;

      //initialTfood();
      //calculateTotals();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
