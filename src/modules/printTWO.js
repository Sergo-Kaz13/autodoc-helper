export function printTWO() {
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
    const isTwoOrder =
      document
        .querySelector(".aside-info__item span")
        ?.textContent?.trim()
        ?.slice(0, 3)
        ?.toLowerCase() === "two";
    if (!isTwoOrder) {
      //alert("This is not a TWO order!");
      //return;
    }
    btn.disabled = true; // щоб не клікали 10 разів
    btn.textContent = "Processing...";

    try {
      await processTable();
      btn.textContent = "Done ✅";
    } catch (e) {
      console.error(e);
      btn.textContent = "Error ❌";
    } finally {
      setTimeout(() => {
        btn.textContent = "Print TWO";
        btn.disabled = false;
      }, 1500);
    }
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
      const rowToProcess = rows.find((row) => {
        const cells = row.children;
        const qty = parseInt(cells[indexes.qty].textContent.trim());
        const packed = parseInt(cells[indexes.packed].textContent.trim());
        return qty !== packed;
      });
      if (!rowToProcess) break;
      console.log(rowToProcess);
      const articleNo =
        rowToProcess.children[indexes.article].textContent.trim();
      if (!articleNo) {
        console.warn("Skip row without articleNo");
        continue;
      }
      const packedBefore = parseInt(
        rowToProcess.children[indexes.packed].textContent.trim(),
      );
      await processArticle(articleNo);
      await waitForRowUpdate(articleNo, packedBefore);
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
    input.dispatchEvent(new Event("input", { bubbles: true }));
    button.click();
    console.log("Обробляємо:", articleNo);
  }
  async function waitForRowUpdate(articleNo, prevPacked) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const indexes = getColumnIndexes();
        const rows = Array.from(document.querySelectorAll("table tbody tr"));
        const row = rows.find(
          (r) => r.children[indexes.article].textContent.trim() === articleNo,
        );
        if (!row) return;
        const newPacked = parseInt(
          row.children[indexes.packed].textContent.trim(),
        );
        if (newPacked !== prevPacked) {
          clearInterval(interval);
          resolve();
        }
      }, 200);
    });
  }
}
