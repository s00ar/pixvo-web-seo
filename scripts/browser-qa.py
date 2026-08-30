from __future__ import annotations

import json
import os
import time
import urllib.request

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait


BASE_URL = "http://127.0.0.1:4173"
MARKETS = ("mx", "ar", "es")
CORE_ROUTES = tuple(
    route
    for market in MARKETS
    for route in (
        f"/{market}/",
        f"/{market}/casos-de-exito/",
        f"/{market}/casos-de-exito/microcuotas/",
    )
)
SAMPLE_ROUTES = (
    "/mx/soluciones/seo-wordpress/",
    "/ar/problemas/leads-no-convierten/",
    "/es/recursos/seo-vs-google-ads/",
    "/mx/blog/por-que-un-sitio-wordpress-no-puede-quedar-librado-a-la-suerte-y-como-evitar-dolores-de-cabeza-despues/",
    "/proyectos/shortcodes-en-pestanas/",
)


def status_code(path: str) -> int:
    with urllib.request.urlopen(f"{BASE_URL}{path}", timeout=10) as response:
        return response.status


def inspect_page(driver: webdriver.Chrome, route: str, mobile: bool) -> dict:
    driver.get(f"{BASE_URL}{route}")
    WebDriverWait(driver, 15).until(lambda current: current.execute_script("return document.readyState") == "complete")
    WebDriverWait(driver, 15).until(lambda current: len(current.find_elements(By.CSS_SELECTOR, "h1")) == 1)
    time.sleep(0.25)

    market = route.split("/")[1] if route.split("/")[1] in MARKETS else None
    menu_labels = []
    mobile_menu = None
    if market:
        if mobile:
            mobile_menu = driver.find_element(By.CSS_SELECTOR, ".growth-menu")
            mobile_menu.click()
            WebDriverWait(driver, 5).until(lambda current: current.find_element(By.ID, "growth-navigation").get_attribute("class") == "is-open")
        menu_labels = [element.text.strip() for element in driver.find_elements(By.CSS_SELECTOR, "#growth-navigation a") if element.text.strip()]
        if mobile_menu:
            mobile_menu.click()
            WebDriverWait(driver, 5).until(lambda current: current.find_element(By.ID, "growth-navigation").get_attribute("class") != "is-open")

    images = driver.find_elements(By.CSS_SELECTOR, "img")
    driver.execute_script("document.querySelectorAll('img').forEach(img => { if (img.loading === 'lazy') img.loading = 'eager'; });")
    WebDriverWait(driver, 10).until(lambda current: current.execute_script("return Array.from(document.images).every(img => img.complete);"))
    broken_images = driver.execute_script(
        "return Array.from(document.images).filter(img => !img.complete || img.naturalWidth === 0).map(img => img.currentSrc || img.src);"
    )
    overflow = driver.execute_script("return document.documentElement.scrollWidth - document.documentElement.clientWidth;")
    cards = len(driver.find_elements(By.CSS_SELECTOR, ".case-study-card"))
    breadcrumbs = len(driver.find_elements(By.CSS_SELECTOR, '[aria-label="Migas de pan"]'))
    buttons = [element.text.strip() for element in driver.find_elements(By.CSS_SELECTOR, "a.button, button") if element.text.strip()]
    picture_count = len(driver.find_elements(By.CSS_SELECTOR, "picture"))

    result = {
        "route": route,
        "viewport": "mobile" if mobile else "desktop",
        "title": driver.title,
        "h1": driver.find_element(By.CSS_SELECTOR, "h1").text.strip(),
        "menu_labels": menu_labels,
        "cases_in_menu": not market or "Casos de éxito" in menu_labels,
        "images": len(images),
        "broken_images": broken_images,
        "horizontal_overflow_px": overflow,
        "case_cards": cards,
        "breadcrumbs": breadcrumbs,
        "buttons": buttons,
        "picture_count": picture_count,
    }

    if broken_images:
        raise AssertionError(f"Imágenes rotas en {route}: {broken_images}")
    if overflow > 1:
        raise AssertionError(f"Overflow horizontal de {overflow}px en {route} ({result['viewport']})")
    if market and "Casos de éxito" not in menu_labels:
        raise AssertionError(f"Casos de éxito no aparece en el menú de {route} ({result['viewport']})")
    if route.endswith("/casos-de-exito/") and cards != 5:
        raise AssertionError(f"Se esperaban cinco cards de casos en {route}; se encontraron {cards}")
    if "/casos-de-exito/microcuotas/" in route:
        if picture_count < 1 or breadcrumbs < 1:
            raise AssertionError(f"Imagen responsive o breadcrumbs ausentes en {route}")
        if not any("Analicemos qué parte" in label for label in buttons):
            raise AssertionError(f"CTA contextual ausente en {route}")
    return result


def main() -> None:
    screenshot_dir = os.path.join("docs", "seo", "screenshots")
    os.makedirs(screenshot_dir, exist_ok=True)
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=options)
    results = []
    try:
        for mobile, size in ((False, (1440, 1000)), (True, (390, 844))):
            driver.set_window_size(*size)
            routes = CORE_ROUTES + (SAMPLE_ROUTES if not mobile else tuple())
            for route in routes:
                results.append(inspect_page(driver, route, mobile))
                screenshot_targets = {
                    (False, "/mx/"): "home-mx-desktop.png",
                    (False, "/mx/casos-de-exito/"): "cases-mx-desktop.png",
                    (False, "/mx/casos-de-exito/microcuotas/"): "microcuotas-mx-desktop.png",
                    (True, "/ar/"): "home-ar-mobile.png",
                    (True, "/es/casos-de-exito/"): "cases-es-mobile.png",
                    (True, "/mx/casos-de-exito/microcuotas/"): "microcuotas-mx-mobile.png",
                }
                filename = screenshot_targets.get((mobile, route))
                if filename:
                    driver.save_screenshot(os.path.join(screenshot_dir, filename))
                if route in ("/mx/casos-de-exito/", "/es/casos-de-exito/"):
                    grid = driver.find_element(By.CSS_SELECTOR, ".case-study-grid")
                    driver.execute_script("arguments[0].scrollIntoView({block: 'start'});", grid)
                    time.sleep(0.2)
                    suffix = "mobile" if mobile else "desktop"
                    market = route.split("/")[1]
                    driver.save_screenshot(os.path.join(screenshot_dir, f"cases-{market}-{suffix}-cards.png"))
    finally:
        driver.quit()

    desktop_menus = {tuple(item["menu_labels"]) for item in results if item["viewport"] == "desktop" and item["menu_labels"]}
    mobile_menus = {tuple(item["menu_labels"]) for item in results if item["viewport"] == "mobile" and item["menu_labels"]}
    if len(desktop_menus) != 1 or len(mobile_menus) != 1 or desktop_menus != mobile_menus:
        raise AssertionError("Los menús desktop/mobile o los mercados no comparten la misma estructura.")

    statuses = {route: status_code(route) for route in CORE_ROUTES + SAMPLE_ROUTES}
    if any(status != 200 for status in statuses.values()):
        raise AssertionError(f"Rutas con estado no válido: {statuses}")

    report = {
        "base_url": BASE_URL,
        "routes_checked": len(results),
        "http_statuses": statuses,
        "shared_menu": list(next(iter(desktop_menus))),
        "results": results,
    }
    with open(os.path.join("docs", "seo", "browser-qa.json"), "w", encoding="utf-8") as output:
        json.dump(report, output, ensure_ascii=False, indent=2)
        output.write("\n")
    print(f"Browser QA: {len(results)} vistas, {len(statuses)} rutas HTTP y menús desktop/mobile consistentes.")


if __name__ == "__main__":
    main()
