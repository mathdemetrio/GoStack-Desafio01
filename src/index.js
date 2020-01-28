const express = require('express');

const server = express();

server.use(express.json());

const projects = [{ id: '1', title: 'Novo projeto', tasks: [] }];

/**
 * Count number of requests
 */
function logRequests(req, res, next) {
  console.count('Número de requisições');

  return next();
}

server.use(logRequests);

/**
 * check if project exists in array before continue
 */
function checkProjectExists(req, res, next) {
  const projectIndex = projects.findIndex((project) => project.id === req.params.id);

  if (projectIndex < 0) return res.status('400').json({ error: 'Project not found' });

  req.params.projectIndex = projectIndex;

  return next();
}

/**
 * Lists all projects in array
 */
server.get('/projects', (req, res) => res.json(projects));

/**
 * Register new project - request body: id, title
 */
server.post('/projects', (req, res) => {
  projects.push(req.body);

  return res.json(projects);
});

/**
 * Edit title's project - param route: id - request body: title
 */
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { projectIndex } = req.params;

  projects[projectIndex].title = req.body.title;

  return res.json(projects[projectIndex]);
});

/**
 * Delete project - param route: id
 */
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { projectIndex } = req.params;

  projects.splice(projectIndex, 1);

  return res.send();
});

/**
 * Add tasks to project - param route: project id - request body: title
 */
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { projectIndex } = req.params;

  projects[projectIndex].tasks.push(req.body.title);

  return res.json(projects[projectIndex]);
});

server.listen(3000);
