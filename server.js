const mongodb = require('mongodb').MongoClient
const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const { exec } = require('child_process')

const app = express()

let db

const startup = async () => {
  mongodb.connect('mongodb://localhost:27017/lab4', (err, _db) => {
    console.log(err)
    db = _db
  })

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.get('/backups', (req, res) => {
    const files = fs.readdirSync(path.resolve(__dirname, 'backups'), 'utf-8')
    res.json(files)
  });

  app.get('/list', async (req, res) => {
    const items = await db.collection('items').find().toArray()
    res.json(items);
  });

  app.post('/list', async (req, res) => {
    const item = req.body.text;
    await db.collection('items').insert({
      text: item
    })
    res.json(await db.collection('items').find().toArray())
  });

  app.post('/backup', (req, res) => {
    exec(`mongodump --db lab4 --out backups/${(new Date).getTime()}`, (err, stdout, stderr) => {
      const files = fs.readdirSync(path.resolve(__dirname, 'backups'), 'utf-8')
      res.json(files)
    })
  });

  app.get('/backup/:time', (req, res) => {
    exec(`mongorestore --db lab4 --drop backups/${req.params.time}/lab4/`, async (err, stdout, stderr) => {
      const items = await db.collection('items').find().toArray()
      res.json(items)
    })
  })

  app.get('/public/:filename', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/', req.params.filename))
  })

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '', 'index.html'));
  });

  const server = app.listen(8080, () => {
    console.log('Listening on port:' + 8080);
  });
};

startup()


