import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from .util import *
import time

class PagePopulation(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_types_populated(self):

        login(self.driver)
        self.driver.get(DOMAIN + "/index.html")
        self.assertNotEqual(0, len(self.driver.find_elements_by_css_selector("#type > *")))
        
        self.driver.get(DOMAIN + "/create-event.html")
        self.assertNotEqual(0, len(self.driver.find_elements_by_css_selector("#typeSelect > *")))
        
        self.driver.get(DOMAIN + "/manage-events.html")
        self.assertNotEqual(0, len(self.driver.find_elements_by_css_selector("#typeSelect > *")))
                

    def test_index_view_button(self):

        login(self.driver)
        self.driver.get(DOMAIN + "/index.html")
        time.sleep(1)
        
        title = self.driver.find_element_by_css_selector("li > p").text
        self.driver.find_element_by_css_selector("li > .button").click()
        time.sleep(1)
        self.assertIn(title, self.driver.find_element_by_id("title").text)

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
