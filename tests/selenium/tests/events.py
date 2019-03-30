import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from .util import *
import random
import time

valid_event = {
    "eventNameBox": "Test Event {}".format(random.randint(1000,9999)),
    "dateBox": "2021-03-18",
    "timeBox": "13:00",
    "address1Box": "Address line 1",
    "address2Box": "Address line 2",
    "address3Box": "Address line 3",
    "postcodeBox": "POSTCODE",
    #"typeSelect": "1",
    "dressCodeBox": "Dress code.",
    #"StatusSelect": "0",
}

class Events(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_create_event_success(self):
        login(self.driver)
        
        self.driver.get(DOMAIN + "/create-event.html")
        for elem_id, value in valid_event.items():
            self.driver.execute_script("document.getElementById('{}').setAttribute('value', '{}')".format(elem_id, value))
        self.driver.find_element_by_id("savebtn").click()

        time.sleep(1)
        self.driver.get(DOMAIN + "/index.html")
        self.driver.find_element_by_id("search").send_keys(valid_event["eventNameBox"])
        self.driver.find_element_by_id("search").send_keys(Keys.RETURN)
        self.assertIn(valid_event["eventNameBox"], self.driver.page_source)

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
