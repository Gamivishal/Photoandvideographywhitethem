/* ============================================================
 * YASH RAJ MOTION PICTURE — API Integration Layer
 * (Currently not in use as site operates statically)
 * ============================================================ */

const API_BASE_URL = 'https://api.yashrajmotionpicture.com'; // Replace with your actual API URL

/**
 * Fetch portfolio items from backend
 */
async function fetchPortfolio() {
  try {
    const res = await fetch(`${API_BASE_URL}/portfolio`);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return [];
  }
}

/**
 * Submit contact form to backend
 */
async function submitContactForm(data) {
  try {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch (error) {
    console.error('Error submitting form:', error);
    return false;
  }
}
