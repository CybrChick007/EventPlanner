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
