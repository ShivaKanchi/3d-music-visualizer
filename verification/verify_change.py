from playwright.sync_api import sync_playwright

def verify_page_load():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Listen for console logs
        page.on("console", lambda msg: print(f"Console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Page Error: {err}"))

        print("Navigating to page...")
        page.goto("http://localhost:8000")

        # Wait for the play icon to be visible
        print("Waiting for play icon...")
        play_icon = page.locator("#tooltip-container")
        play_icon.wait_for(state="visible", timeout=5000)

        print("Play icon found and visible.")

        # Take screenshot
        screenshot_path = "verification/page_load.png"
        page.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    verify_page_load()
