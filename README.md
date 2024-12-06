# Grey List Extension

A simple Chrome extension that allows you to make specific websites grayscale. Perfect for reducing distractions and making certain websites less appealing.

## Features

- Add any website to your "grey list"
- Automatically applies grayscale filter to listed websites
- Clean, modern interface
- Syncs across devices using Chrome storage
- Works instantly when you add or remove sites

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in your Chrome toolbar
2. Enter a domain (e.g., "facebook.com", "instagram.com")
3. Click "Add" to add the domain to your grey list
4. Visit the website - it will automatically be displayed in grayscale
5. To remove a website, click the "X" next to the domain in the list

## File Structure

```
├── manifest.json # Extension configuration
├── popup.html # Extension popup interface
├── popup.js # Popup functionality
└── contentScript.js # Applies grayscale filter
```
## Technical Details

- Built using vanilla JavaScript
- Uses Chrome's Storage Sync API for cross-device synchronization
- Applies filters using CSS `filter: grayscale(100%)`
- Runs at document start to prevent flash of unfiltered content

## Permissions

- `storage`: Required for saving your grey list
- `tabs`: Required for accessing current tab information
- `scripting`: Required for applying the grayscale filter
- `activeTab`: Required for accessing the current tab's URL

## License

MIT License - feel free to use and modify as you like!