import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

class PythonOrgSearch(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_login(self):
        driver = self.driver
        address = "http://localhost:4200/"
        driver.get(address)
        username = driver.find_element_by_xpath('//*[@type="text"]')
        password = driver.find_element_by_xpath('//*[@type="password"]')

        #No Login
        Submit = driver.find_element_by_class_name("submit")
        Submit.click()
        self.assertTrue(driver.current_url == address)

        #Wrong Login
        username.send_keys("wrongUsername")
        password.send_keys("wrongPassword")
        Submit.click()
        self.assertTrue(driver.current_url == address)

        #Successful Login
        username.clear()
        password.clear()
        username.send_keys("admin")
        Submit.click()
        self.assertTrue(driver.current_url == "http://localhost:4200/home/assign")

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()
