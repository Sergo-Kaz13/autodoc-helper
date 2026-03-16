export function login() {
  if (document.getElementById("btnContainer")) return;
  const btnAutoPrint = document.getElementById("btnPrintAWSAuto");
  if (btnAutoPrint) btnAutoPrint.remove();
  const USER_KEY = "workAdminUser";
  let modal; // Button Data
  const buttonsData = [
    {
      text: "\u{1F9D1}\u200D\u{1F4BC}",
      onclick: handleAccountClick,
    },
    {
      text: "\u270E",
      onclick: handleEditClick,
    },
  ]; // Create Buttons Container
  const btnContainer = document.createElement("div");
  btnContainer.id = "btnContainer";
  btnContainer.style.position = "fixed";
  btnContainer.style.zIndex = "9999";
  btnContainer.style.display = "flex";
  btnContainer.style.gap = "5px";
  btnContainer.style.right = "20px";
  btnContainer.style.bottom = "20px";
  buttonsData.forEach(({ text, onclick }) => {
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
    const blockFocus = (e) => {
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
    [barcode, workplace].forEach((i) => {
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
        workplace: workplaceValue,
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
    const submitButton = document.querySelector(
      "button.btn--fluid[type='submit']",
    );
    if (!barcodeInput || !workplaceInput || !submitButton) {
      console.warn("Inputs or submit button not found");
      return;
    }
    barcodeInput.value = user.barcode;
    barcodeInput.dispatchEvent(new Event("input", { bubbles: true }));
    workplaceInput.value = user.workplace;
    workplaceInput.dispatchEvent(new Event("input", { bubbles: true }));
    submitButton.click();
  }
}
