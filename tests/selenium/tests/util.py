DOMAIN = "localhost:8080"

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
    # to be replaced by automatic
    driver.get(DOMAIN + "/login.html")
    input("Please login by following the instructions on the browser, then press enter: ")
