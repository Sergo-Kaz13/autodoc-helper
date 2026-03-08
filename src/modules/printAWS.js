export function printAWS() {
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
  btnPrint.addEventListener("click", (e) => {
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
  observer.observe(document.body, { childList: true, subtree: true });
}
