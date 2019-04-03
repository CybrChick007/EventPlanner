import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
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

shopping_list = ["item {}".format(x) for x in range(10)]

class Events(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()

    def __set_value_fields(self, event):
        for elem_id, value in event.items():
            self.driver.execute_script("document.getElementById('{}').value = '{}'".format(elem_id, value))

    def __assign_shopping_list(self, shopping_list):
        box = self.driver.find_element_by_id("shoppingBox")
        add = self.driver.find_element_by_id("sladd")
        for item in shopping_list:
            box.send_keys(item)
            add.click()

    def __event_exists(self, event):
        self.driver.get(DOMAIN + "/index.html")
        search_box = self.driver.find_element_by_id("search")
        time.sleep(1)
        search_box.send_keys(event["eventNameBox"])
        time.sleep(1)
        search_box.send_keys(Keys.RETURN)
        time.sleep(1)
        self.assertIn(valid_event["eventNameBox"], self.driver.page_source)
    
    def test_create_event_success(self):
        login(self.driver)
        
        self.driver.get(DOMAIN + "/create-event.html")

        self.__set_value_fields(valid_event)
        self.__assign_shopping_list(shopping_list)

        time.sleep(0.5)
        self.driver.find_element_by_id("savebtn").click()
        time.sleep(0.5)

        self.__event_exists(valid_event)

    def test_edit_event(self):
        login(self.driver)
        
        self.driver.get(DOMAIN + "/manage-events.html")

        time.sleep(1)

        self.driver.find_element_by_id("savebtn").click()

        try:
            WebDriverWait(self.driver, 3).until(EC.alert_is_present())
            alert = self.driver.switch_to.alert
            alert.accept()
        except TimeoutException:
            raise Exception("'please select event' warning never appeared.")
        
        for telem in self.driver.find_elements_by_css_selector(".button"):
            if telem.text == valid_event["eventNameBox"]:
                elem = telem
                break
        else:
            raise Exception("Could not find button element in manage events.")        

        elem.click()
        time.sleep(0.5)

        valid_event["eventNameBox"] += " (edited)"
        self.__set_value_fields(valid_event)

        time.sleep(0.5)
        self.driver.find_element_by_id("savebtn").click()
        time.sleep(0.5)

        self.__event_exists(valid_event)

    def test_event_join(self):
        login(self.driver)

        self.driver.get(DOMAIN + "/index.html")
        self.driver.find_element_by_id("search").send_keys(valid_event["eventNameBox"])
        self.driver.find_element_by_id("search").send_keys(Keys.RETURN)
        time.sleep(0.5)
        self.driver.find_element_by_css_selector("li > .button").click()
        time.sleep(0.5)
        join_button = self.driver.find_element_by_id("join")
        self.assertEqual(join_button.text, "JOIN")
        self.driver.find_element_by_id("join").click()
        time.sleep(1)
        self.assertEqual(join_button.text, "JOINED")

    def __get_shopping_button(self):
        for button in self.driver.find_elements_by_css_selector(".shoppingitemdetails > button"):
            if "close-item-button" not in button.get_attribute("class"):
                return button
        raise Exception("Couldn't find shopping list details button.")

    def __get_first_shopping_item(self):
        return self.driver.find_element_by_css_selector("#shoppinglist > li")

    def test_event_shopping_list(self):
        login(self.driver)

        self.driver.get(DOMAIN + "/index.html")
        self.driver.find_element_by_id("search").send_keys(valid_event["eventNameBox"])
        self.driver.find_element_by_id("search").send_keys(Keys.RETURN)
        time.sleep(0.5)
        self.driver.find_element_by_css_selector("li > .button").click()
        time.sleep(0.5)
        for text in ["UNBRING", "BRING", "UNBRING"]:
            self.__get_first_shopping_item().click()
            time.sleep(0.5)
            self.__get_shopping_button().click()
            time.sleep(0.5)
            self.__get_first_shopping_item().click()
            self.assertEqual(self.__get_shopping_button().text, text)
            self.driver.find_element_by_css_selector(".close-item-button").click()
            time.sleep(0.5)

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
