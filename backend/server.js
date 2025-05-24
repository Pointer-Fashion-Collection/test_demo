const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

require('dotenv').config(); // Optional: If using .env locally

app.use(cors());
app.use(express.json());

// GitHub API setup
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'your-github-username';      // 🔁 Replace with your GitHub username
const REPO = 'your-repo-name';             // 🔁 Replace with your GitHub repo name
const BRANCH = 'main';                     // 🔁 Use your default branch if not 'main'

// Helper to get file from GitHub
async function getGitHubFile(path) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (!response.ok) throw new Error(`GitHub GET error: ${response.statusText}`);
  return response.json(); // includes content and sha
}

// Helper to update file on GitHub
async function updateGitHubFile(path, newContent, sha) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
  const body = {
    message: `Update ${path}`,
    content: Buffer.from(newContent).toString('base64'),
    sha: sha,
    branch: BRANCH
  };

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) throw new Error(`GitHub PUT error: ${response.statusText}`);
  return response.json();
}

/** === MEN'S T-SHIRTS === **/

// GET T-shirt data (still using local file for now, optional to change)
app.get('/api/mens/tshirt', async (req, res) => {
  try {
    const filePath = 'mens/t-shirt/0-100.json';
    const file = await getGitHubFile(filePath);
    const content = Buffer.from(file.content, 'base64').toString('utf8');
    res.json(JSON.parse(content));
  } catch (err) {
    console.error("GET T-shirt error:", err);
    res.status(500).json({ error: 'Failed to read T-shirt data from GitHub' });
  }
});

// POST T-shirt data
app.post('/api/mens/tshirt', async (req, res) => {
  try {
    const filePath = 'mens/t-shirt/0-100.json';
    const githubFile = await getGitHubFile(filePath);

    const data = JSON.parse(Buffer.from(githubFile.content, 'base64').toString('utf8'));
    data.push(req.body); // Add new T-shirt

    const updatedContent = JSON.stringify(data, null, 2);
    await updateGitHubFile(filePath, updatedContent, githubFile.sha);

    res.status(201).json({ message: 'T-shirt added to GitHub' });
  } catch (err) {
    console.error("POST T-shirt error:", err);
    res.status(500).json({ error: 'Failed to update T-shirt data on GitHub' });
  }
});

/** === MEN'S PANTS === **/

// GET Pant data
app.get('/api/mens/pant', async (req, res) => {
  try {
    const filePath = 'mens/pant/0-100.json';
    const file = await getGitHubFile(filePath);
    const content = Buffer.from(file.content, 'base64').toString('utf8');
    res.json(JSON.parse(content));
  } catch (err) {
    console.error("GET Pant error:", err);
    res.status(500).json({ error: 'Failed to read Pant data from GitHub' });
  }
});

// POST Pant data
app.post('/api/mens/pant', async (req, res) => {
  try {
    const filePath = 'mens/pant/0-100.json';
    const githubFile = await getGitHubFile(filePath);

    const data = JSON.parse(Buffer.from(githubFile.content, 'base64').toString('utf8'));
    data.push(req.body); // Add new Pant

    const updatedContent = JSON.stringify(data, null, 2);
    await updateGitHubFile(filePath, updatedContent, githubFile.sha);

    res.status(201).json({ message: 'Pant added to GitHub' });
  } catch (err) {
    console.error("POST Pant error:", err);
    res.status(500).json({ error: 'Failed to update Pant data on GitHub' });
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
