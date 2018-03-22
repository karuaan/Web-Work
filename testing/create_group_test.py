import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

class PythonOrgSearch(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_create_group(self):
        #Get to new group page
        driver = self.driver
        address = "http://localhost:4200/"

        driver.get(address)
        username = driver.find_element_by_xpath('//*[@type="text"]')
        password = driver.find_element_by_xpath('//*[@type="password"]')
        submit = driver.find_element_by_class_name("submit")
        username.send_keys("admin")
        submit.click()

        driver.get("http://localhost:4200/home/group")
        email = driver.find_element_by_xpath('//*[@id="group-form-mail"]')
        submit = driver.find_element_by_xpath('//*[@type="submit"]')

        #Add valid email
        original = len(driver.find_elements_by_xpath('//*[@id="table-body"]/tr'))
        email.send_keys("JonSchwarz23@gmail.com")
        submit.click()

        #Check if successfully added
        table_size = len(driver.find_elements_by_xpath('//*[@id="table-body"]/tr'))
        assert(table_size == original + 1)

        #Try to add invalid email
        original = len(driver.find_elements_by_xpath('//*[@id="table-body"]/tr'))
        email.send_keys("InvalidEmail")
        submit.click()

        #Check if invalid email was ignored
        table_size = len(driver.find_elements_by_xpath('//*[@id="table-body"]/tr'))
        assert(table_size == original)

        #Add empty email
        original = len(driver.find_elements_by_xpath('//*[@id="table-body"]/tr'))
        submit.click()

        #Check if empty email submission was ignored
        table_size = len(driver.find_elements_by_xpath('//*[@id="table-body"]/tr'))
        assert(table_size)







    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()
