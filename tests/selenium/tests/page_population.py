import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from .util import *

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
                

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()
