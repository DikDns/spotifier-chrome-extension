<div align="center">
  <br/>
  <br/>
  <img src="https://raw.githubusercontent.com/DikDns/spotifier-chrome-extension/refs/heads/main/src/icons/icon-256.png" alt="SPOTifier Logo" width="128" height="128"/>
  <h3>SPOTifier for Chrome Extension</h3>
  <p>This is the source code of the SPOTifier for Chrome Extension.</p>
  <br/>
  <br/>
</div>

## Features

- 🌓 Dark/Light mode support
- 🔄 Seamless SSO integration
- 🛠️ Developer mode for local testing
- 🎨 Modern UI with dialog interactions
- 🔒 Secure cookie handling
- ⚡ Fast and lightweight

## Installation

### From SPOTifier Extension Page

1. Visit [SPOTifier Extension Page](https://spotifier-upi.vercel.app/extension) or [Github Releases Page](https://github.com/DikDns/spotifier-chrome-extension/releases)
2. Follow the instructions to install the extension from this video (Coming Soon)

### Manual Installation (Development)

1. Clone this repository

```bash
git clone https://github.com/dikdns/spotifier-chrome-extension.git
```

1. Open Chrome and go to `chrome://extensions/`
2. Enable Developer Mode
3. Click on "Load unpacked"
4. Select the cloned directory

## Usage

After installation:

1. Visit [SPOT UPI](https://spot.upi.edu/mhs)
2. Look for the SPOTifier button in the sidebar
3. Click to access enhanced features

## Development

### Prerequisites

- Chrome Based Browser
- Basic knowledge of web extensions

### Project Structure

```
spotifier-chrome-extension/
├── src/
│   ├── background.js # Background script
│   ├── content.js # Content script for injection
│   ├── popup.js # Popup script
│   ├── popup.html # Popup HTML
│   └── icons/ # Icon files
├── manifest.json # Extension manifest
```

### Configuration

The extension supports several configuration options through the popup interface:

- Developer Mode : Toggle between production and local development URLs
- Show Initial Dialog : Control the welcome dialog visibility
- Dark Mode : Switch between light and dark themes

### Building

1. Make your changes
2. Test locally using Chrome's debugging tools
3. Package the extension:

```bash
zip -r spotifier-chrome-extension.zip * -x "*.git*"
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Security

This extension:

- Only accesses specified domains (SPOT UPI and SPOTifier)
- Handles cookies securely
- Does not store any user data

## License

[MIT License](/LICENSE)

## Support

For support, please open an issue in the repository or contact the maintainers.

---

Made with ❤️ by dikdns for UPI Students
