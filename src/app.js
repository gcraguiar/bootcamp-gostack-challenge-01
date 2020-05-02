const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
//app.use("/repositories/:id", checkRepositoryExists);

const repositories = [];

function checkRepositoryExists(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: 'Invalid Repository ID.' });
  }

  let repository = repositories.find(f => f.id === id);
  
  if (!repository) {
    return res.status(400).json({ error: 'Repository does not exists.' });
  }  

  req.params = {
    index: repositories.indexOf(repository),
    id: repository.id,                
  };  

  return next();
}

app.get("/repositories", (req, res) => {  
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs} = req.body;

  const repository = {
    id: uuid(),
    title,
    url, 
    techs,
    likes: 0
  };

  repositories.push(repository);

  return res.json(repository);
});

app.put("/repositories/:id", checkRepositoryExists, (req, res) => {
  const { title, url, techs} = req.body;

  const repo = {
    id: req.params.id,
    title,
    url,
    techs,
    likes: repositories[req.params.index].likes,
  };

  repositories[req.params.index] = repo;

  return res.json(repo);
});

app.delete("/repositories/:id", checkRepositoryExists, (req, res) => {
  repositories.splice(req.params.index, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", checkRepositoryExists, (req, res) => {
  repositories[req.params.index].likes++;

  return res.status(200).json(repositories[req.params.index]);
});

module.exports = app;
