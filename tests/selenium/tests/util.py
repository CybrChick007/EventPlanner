from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from getpass import getpass

DOMAIN = "localhost:8080"

GOOGLE_EMAIL = input("Google email: ")
GOOGLE_PASSWORD = getpass("Google password: ")

def get_all_pages():
    pages = [
        "manage-events",
        "create-event",
        "index",
        "login",
        "messaging",
        "settings",
        "timetable",
    ]
    return ["{}/{}.html".format(DOMAIN, x) for x in pages]

def login(driver):

    driver.get(DOMAIN + "/login.html")

    if "login.html" in driver.current_url:
        
        driver.find_element_by_css_selector("div.g-signin2").click()
        driver.switch_to.window(driver.window_handles[-1])
        
        for name, text in zip(["identifier", "password"], [GOOGLE_EMAIL, GOOGLE_PASSWORD]):
            elem = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.NAME, name))
            )
            driver.implicitly_wait(0.5)
            elem.send_keys(text)
            elem.send_keys(Keys.RETURN)
            
        driver.switch_to.window(driver.window_handles[0])
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "search"))
        )
