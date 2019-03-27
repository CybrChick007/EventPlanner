import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from .util import *

class Redirect(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_redirect_to_login_page(self):
        """ makes sure all pages redirect to the login page when not logged in """
        
        driver = self.driver
        for url in get_all_pages():
            driver.get(url)
            self.assertIn("login.html", driver.current_url)

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()
