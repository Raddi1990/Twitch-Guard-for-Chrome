# 🛡️ Twitch Guard

A clean, Material Design-inspired Chrome extension to declutter your Twitch experience by hiding specific channels from your feed, sidebar, and recommendations.

## ✨ Features

- **Custom Blocklist:** Add channel names or full Twitch URLs to hide them instantly.
- **Deep Filtering:** Removes streams from the front page grid, "Live Channels" sidebar, and category pages.
- **Master Switch:** Quickly enable or disable the filter via a Material Design toggle without losing your list.
- **Persistent Storage:** Your blocklist is saved locally in your browser and survives restarts.
- **Developer Logs:** Built-in console logging (F12) to see exactly what is being blocked in real-time.

## 📸 Preview

*The popup features a modern Material Design interface with a purple Twitch-themed accent color.*

## 🚀 Installation (Developer Mode)

Since this extension is currently in development, follow these steps to install it:

1. **Download/Clone** this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **"Developer mode"** (Entwicklermodus) using the toggle in the top-right corner.
4. Click on **"Load unpacked"** (Entpackte Erweiterung laden).
5. Select the folder containing the extension files.
6. Pin **Twitch Guard** to your toolbar for easy access!

## 🛠️ Usage

1. Click the **Twitch Guard icon** in your browser toolbar.
2. Enter a channel name (e.g., `doctorio`) or a full link into the input field.
3. Click **"Hinzufügen"** (Add).
4. Use the **toggle switch** at the top to activate the filter.
5. Refresh your Twitch tab (if already open) to apply changes.

## 📂 Project Structure

- `manifest.json`: Extension configuration and permissions.
- `content.js`: The "brain" that scans Twitch and hides elements.
- `popup.html` / `popup.js`: The user interface and logic for the blocklist.
- `popup_style.css`: Material Design styling.
- `icon.png`: The extension logo.

## ⚖️ License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---
*Disclaimer: This extension is not affiliated with, maintained, authorized, endorsed, or sponsored by Twitch Interactive, Inc.*
