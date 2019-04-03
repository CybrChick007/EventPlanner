import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from .util import *
import time
import random

class PagePopulation(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_create_thread_with_self(self):

        login(self.driver)
        self.driver.get(DOMAIN + "/messaging.html")
        email_box = self.driver.find_element_by_id("email")
        email_box.send_keys(GOOGLE_EMAIL)
        email_box.send_keys(Keys.RETURN)

        time.sleep(0.5)

        container = self.driver.find_element_by_id("messagescontainer")
        self.assertNotEqual(container.value_of_css_property("display"), "none")

    def test_message_self(self):

        login(self.driver)
        self.driver.get(DOMAIN + "/messaging.html")

        time.sleep(1)
        
        for elem in self.driver.find_elements_by_css_selector("#threads > li"):
            if elem.text == GOOGLE_EMAIL:
                elem.click()
                break
        else:
            raise Exception("Couldn't find thread. Thread should be made by previous test.")

        time.sleep(0.5)

        TEST_STRING = str(random.randint(1000,9999))

        message_box = self.driver.find_element_by_id("message")
        message_box.send_keys(TEST_STRING)
        message_box.send_keys(Keys.RETURN)

        time.sleep(1)

        for message in self.driver.find_elements_by_css_selector("#messages > li"):
            if message.text == TEST_STRING:
                break
        else:
            raise Exception("Failed to recieve test string.")
        

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
