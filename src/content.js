// Constants
const BUTTON_ID = "goToWebsite";
const SIDEBAR_SELECTOR = "#side-menu";
const COOKIE_DOMAIN = ".spot.upi.edu";
const PROD_URL = "https://spotifier-upi.vercel.app";
const DEV_URL = "http://localhost:3000";
const SSO_PATH = "/api/sso";
const EXTENSIONS_TYPE = "Chrome";

// Styles
const styles = {
  lightTheme: {
    bgColor: "#f5f5f5",
    textColor: "#2c3e50",
    secondaryTextColor: "#34495e",
    cardBgColor: "#ffffff",
    activeColor: "#8b5cf6",
    switchBgColor: "#ccc",
    switchActiveColor: "#8b5cf6",
    shadowColor: "rgba(0, 0, 0, 0.1)",
  },
  darkTheme: {
    bgColor: "#1a202c",
    textColor: "#e2e8f0",
    secondaryTextColor: "#a0aec0",
    cardBgColor: "#2d3748",
    activeColor: "#a78bfa",
    switchBgColor: "#4a5568",
    switchActiveColor: "#a78bfa",
    shadowColor: "rgba(255, 255, 255, 0.1)",
  },
  sidebar: `
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    align-items: center;
  `,
  button: `
    display: flex;
    align-items: center;
    padding: 10px 15px;
    background-color: #8b5cf6;
    color: #2c3e50;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    text-decoration: none;
    max-width: 200px;
  `,
  buttonIcon: `
    margin-right: 8px;
  `,
  dialog: (theme) => `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${theme.cardBgColor};
    color: ${theme.textColor};
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px ${theme.shadowColor};
    z-index: 9999;
    max-width: 90%;
    width: 400px;
  `,
  dialogTitle: (theme) => `
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 16px;
    color: ${theme.textColor};
  `,
  dialogText: (theme) => `
    margin-bottom: 24px;
    color: ${theme.secondaryTextColor};
  `,
  dialogButtons: `
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  `,
  stayButton: (theme) => `
    padding: 8px 16px;
    background-color: ${theme.switchBgColor};
    color: ${theme.textColor};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
  `,
  goButton: (theme) => `
    padding: 8px 16px;
    background-color: ${theme.switchActiveColor};
    color: ${theme.cardBgColor};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
  `,
  backdrop: `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9998;
  `,
};

// Helper functions
function getTheme(isDark) {
  return isDark ? styles.darkTheme : styles.lightTheme;
}

function createButton() {
  const listItem = document.createElement("li");
  const anchor = document.createElement("a");
  anchor.setAttribute("href", "javascript:void(0);");
  anchor.setAttribute("id", BUTTON_ID);
  anchor.style.cssText = styles.goButton(getTheme(false));
  anchor.innerHTML = `
    <i class="fa fa-external-link" style="${styles.buttonIcon}"></i>
    <span>Go to SPOTifier</span>
  `;
  listItem.appendChild(anchor);
  return listItem;
}

function createDialog(theme) {
  // Check if the current URL matches "spot.upi.edu/mhs"
  if (!window.location.href.includes("spot.upi.edu/mhs")) {
    return; // Don't show the dialog if we're not on the correct page
  }

  chrome.storage.sync.get("showDialog", function (data) {
    if (data.showDialog === false) {
      return; // Don't show the dialog if the user has chosen not to see it
    }

    const backdrop = document.createElement("div");
    backdrop.id = "spotifier-backdrop";
    backdrop.style.cssText = styles.backdrop;

    const dialog = document.createElement("div");
    dialog.id = "spotifier-dialog";
    dialog.style.cssText = styles.dialog(theme);

    dialog.innerHTML = `
      <h2 style="${styles.dialogTitle(theme)}">Welcome to SPOTifier</h2>
      <p style="${styles.dialogText(
        theme
      )}">Do you want to go to SPOTifier or stay on this page?</p>
      <div style="margin-top: 16px;margin-bottom: 16px;">
        <label>
          <input type="checkbox" id="dont-show-again" style="margin-right: 8px;">
          Don't show this again
        </label>
      </div>
      <div style="${styles.dialogButtons}">
        <button id="stay-btn" style="${styles.stayButton(
          theme
        )}">Stay Here</button>
        <button id="go-btn" style="${styles.goButton(
          theme
        )}">Go to SPOTifier</button>
      </div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(dialog);

    document.body.style.overflow = "hidden";

    const stayBtn = dialog.querySelector("#stay-btn");
    const goBtn = dialog.querySelector("#go-btn");
    const dontShowAgainCheckbox = dialog.querySelector("#dont-show-again");

    function removeDialog() {
      if (dontShowAgainCheckbox.checked) {
        chrome.storage.sync.set({ showDialog: false });
      }
      backdrop.remove();
      dialog.remove();
      document.body.style.overflow = "";
    }

    stayBtn.addEventListener("click", removeDialog);
    goBtn.addEventListener("click", () => {
      removeDialog();
      handleNavigation();
    });
    backdrop.addEventListener("click", removeDialog);
  });
}

function getCookieValue(cookies, name) {
  return cookies.find((cookie) => cookie.name === name)?.value;
}

function buildTargetUrl(baseUrl, cookies) {
  const params = new URLSearchParams({
    "XSRF-TOKEN": getCookieValue(cookies, "XSRF-TOKEN"),
    laravel_session: getCookieValue(cookies, "laravel_session"),
    CASAuth: getCookieValue(cookies, "CASAuth"),
  });
  return `${baseUrl}${SSO_PATH}?${params.toString()}`;
}

// Main functions
function injectButton() {
  const sidebar = document.querySelector(SIDEBAR_SELECTOR);

  if (sidebar) {
    const button = createButton();
    sidebar.appendChild(button);
    sidebar.style.cssText = styles.sidebar;
    document
      .getElementById(BUTTON_ID)
      .addEventListener("click", handleNavigation);
  }
}

function handleNavigation() {
  chrome.runtime.sendMessage(
    { action: "getCookies", domain: COOKIE_DOMAIN },
    function (response) {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError);
        fallbackNavigation();
        return;
      }
      chrome.storage.sync.get("devMode", function (data) {
        const baseUrl = data.devMode ? DEV_URL : PROD_URL;
        const targetUrl = buildTargetUrl(baseUrl, response.cookies);
        window.location.href = targetUrl;
      });
    }
  );
}

function fallbackNavigation() {
  // Fallback to navigating without cookies
  const baseUrl = PROD_URL; // Always use PROD_URL in fallback
  const targetUrl = `${baseUrl}${SSO_PATH}`;
  window.location.href = targetUrl;
}

// Function to inject version info into extension page
function injectVersionInfo() {
  // Only run on extension pages
  if (!window.location.pathname.includes("/extension")) return;

  const version = chrome.runtime.getManifest().version;

  // Find the version element
  const versionElement = document.getElementById("extension-version");
  if (versionElement) {
    versionElement.innerHTML = `
      <div class="flex items-center gap-3 rounded-full border border-green-200/20 bg-green-500/10 px-4 py-2 text-green-500">
        <span class="font-medium">Installed ${EXTENSIONS_TYPE} Version ${version}</span>
      </div>
    `;
  }
}

// Initialize
function initialize() {
  chrome.storage.sync.get("darkMode", function (data) {
    const isDark = data.darkMode;
    const theme = getTheme(isDark);
    injectButton();
    setTimeout(() => {
      injectVersionInfo();
    }, 500);

    // Only create the dialog if we're on the correct page
    if (window.location.href.includes("spot.upi.edu/mhs")) {
      createDialog(theme);
    }
  });
}

// Listen for theme changes
chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace === "sync" && changes.darkMode) {
    const isDark = changes.darkMode.newValue;
    const theme = getTheme(isDark);

    const dialog = document.getElementById("spotifier-dialog");
    if (dialog) {
      dialog.style.cssText = styles.dialog(theme);
      dialog.querySelector("h2").style.cssText = styles.dialogTitle(theme);
      dialog.querySelector("p").style.cssText = styles.dialogText(theme);
      dialog.querySelector("#stay-btn").style.cssText =
        styles.stayButton(theme);
      dialog.querySelector("#go-btn").style.cssText = styles.goButton(theme);
    }
  }
});

initialize();
console.log("content.js from spotifier has been loaded");
