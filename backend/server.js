const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Load env vars
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'Pointer-Fashion-Collection'; // Your GitHub username/org
const REPO = 'test_demo';                   // Your GitHub repo
const BRANCH = 'main';                      // Your branch

// Check if token is loaded
if (!GITHUB_TOKEN) {
  console.error('ERROR: GITHUB_TOKEN not set in .env');
  process.exit(1);
}

// Fetch a file from GitHub
async function getGitHubFile(path) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`;
  console.log(`Fetching: ${url}`);

  const response = await fetch(url, {
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`GitHub GET ${response.status}:`, errorText);
    throw new Error(`GitHub GET error: ${response.statusText}`);
  }

  return response.json();
}

// Update a file on GitHub
async function updateGitHubFile(path, newContent, sha) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
  const body = {
    message: `Update ${path} via API`,
    content: Buffer.from(newContent).toString('base64'),
    sha: sha,
    branch: BRANCH
  };

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`GitHub PUT ${response.status}:`, errorText);
    throw new Error(`GitHub PUT error: ${response.statusText}`);
  }

  return response.json();
}

// Get parsed JSON + sha from GitHub
async function getData(path) {
  const file = await getGitHubFile(path);
  const content = Buffer.from(file.content, 'base64').toString('utf8');
  return { data: JSON.parse(content), sha: file.sha };
}

// Add an item to a JSON file on GitHub
async function addData(path, newItem) {
  const { data, sha } = await getData(path);
  data.push(newItem);
  const updatedContent = JSON.stringify(data, null, 2);
  return await updateGitHubFile(path, updatedContent, sha);
}

// ------------------------ ROUTES ------------------------

// GET Men's T-shirt data
app.get('/api/mens/tshirt', async (req, res) => {
  try {
    const { data } = await getData('backend/mens/t-shirt/0-100.json');
    res.json(data);
  } catch (err) {
    console.error("GET /api/mens/tshirt error:", err.message);
    res.status(500).json({ error: 'Failed to read T-shirt data from GitHub' });
  }
});

// POST Men's T-shirt data
app.post('/api/mens/tshirt', async (req, res) => {
  try {
    const newItem = req.body;
    if (!newItem.name || !newItem.price) {
      return res.status(400).json({ error: 'Missing required fields: name, price' });
    }

    await addData('backend/mens/t-shirt/0-100.json', newItem);
    res.status(201).json({ message: 'T-shirt added to GitHub' });
  } catch (err) {
    console.error("POST /api/mens/tshirt error:", err.message);
    res.status(500).json({ error: 'Failed to update T-shirt data on GitHub' });
  }
});

// GET Men's Pant data
app.get('/api/mens/pant', async (req, res) => {
  try {
    const { data } = await getData('backend/mens/pant/0-100.json');
    res.json(data);
  } catch (err) {
    console.error("GET /api/mens/pant error:", err.message);
    res.status(500).json({ error: 'Failed to read Pant data from GitHub' });
  }
});

// POST Men's Pant data
app.post('/api/mens/pant', async (req, res) => {
  try {
    const newItem = req.body;
    if (!newItem.name || !newItem.price) {
      return res.status(400).json({ error: 'Missing required fields: name, price' });
    }

    await addData('backend/mens/pant/0-100.json', newItem);
    res.status(201).json({ message: 'Pant added to GitHub' });
  } catch (err) {
    console.error("POST /api/mens/pant error:", err.message);
    res.status(500).json({ error: 'Failed to update Pant data on GitHub' });
  }
});

// ------------------------ START SERVER ------------------------

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
