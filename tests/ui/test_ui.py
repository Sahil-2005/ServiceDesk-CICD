import os
import pytest
from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Use env var or default
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Use env var for WebDriver path, do not use webdriver-manager dynamically
EDGEDRIVER_PATH = os.getenv("EDGEDRIVER_PATH", r"C:\\tools\\webdriver\\msedgedriver.exe")

@pytest.fixture(scope="module")
def driver():
    if not os.path.exists(EDGEDRIVER_PATH):
        pytest.fail(f"EdgeDriver executable not found at: {EDGEDRIVER_PATH}")
        
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    
    try:
        service = Service(executable_path=EDGEDRIVER_PATH)
        driver_instance = webdriver.Edge(service=service, options=options)
    except Exception as e:
        pytest.fail(f"Failed to start Edge browser with driver at {EDGEDRIVER_PATH}. Error: {str(e)}")
        
    driver_instance.implicitly_wait(5)
    
    try:
        yield driver_instance
    finally:
        driver_instance.quit()

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    # Execute all other hooks to obtain the report object
    outcome = yield
    rep = outcome.get_result()
    # Set a report attribute for each phase of a call, which can
    # be "setup", "call", "teardown"
    setattr(item, "rep_" + rep.when, rep)

@pytest.fixture(autouse=True)
def take_screenshot_on_failure(request, driver):
    yield
    # Check if test failed
    if hasattr(request.node, "rep_call") and request.node.rep_call.failed:
        os.makedirs("tests/ui", exist_ok=True)
        filename = f"tests/ui/{request.node.name}_failure.png"
        try:
            driver.save_screenshot(filename)
        except Exception as e:
            print(f"Failed to save screenshot: {e}")

def test_dashboard_loads(driver):
    driver.get(FRONTEND_URL)
    
    # Wait for heading
    heading = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Dashboard')]"))
    )
    assert heading.is_displayed()
    
    # Verify Total Tickets box is present (contains "Total Tickets" text)
    total_box = driver.find_element(By.XPATH, "//*[contains(text(), 'Total Tickets')]")
    assert total_box.is_displayed()

def test_ticket_list_loads(driver):
    driver.get(f"{FRONTEND_URL}/tickets")
    
    # Wait for the main heading
    heading = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Tickets')]"))
    )
    assert heading.is_displayed()
    
    # Verify New Ticket button exists
    new_ticket_btn = driver.find_element(By.XPATH, "//a[contains(text(), 'New Ticket')]")
    assert new_ticket_btn.is_displayed()

def test_ticket_create_form_loads(driver):
    driver.get(f"{FRONTEND_URL}/tickets/new")
    
    # Wait for Create New Ticket heading
    heading = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Create New Ticket')]"))
    )
    assert heading.is_displayed()
    
    # Check inputs are present
    assert driver.find_element(By.ID, "title").is_displayed()
    assert driver.find_element(By.ID, "description").is_displayed()
    assert driver.find_element(By.ID, "category").is_displayed()

def test_ticket_create_validation(driver):
    driver.get(f"{FRONTEND_URL}/tickets/new")
    
    # Wait for the form to load
    submit_btn = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Create Ticket')]"))
    )
    
    # Click submit without filling required fields
    submit_btn.click()
    
    # Verify validation errors appear
    title_error = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//p[contains(text(), 'Title is required')]"))
    )
    desc_error = driver.find_element(By.XPATH, "//p[contains(text(), 'Description is required')]")
    cat_error = driver.find_element(By.XPATH, "//p[contains(text(), 'Category is required')]")
    
    assert title_error.is_displayed()
    assert desc_error.is_displayed()
    assert cat_error.is_displayed()
