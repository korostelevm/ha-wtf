'use strict'
global.logger = require('tracer').console({
  format: '<{{title}}> (in {{file}}:{{line}}) {{message}}',
  error:
          '<{{title}}> (in {{file}}:{{line}}) {{message}}\nCall Stack:\n{{stack}}' // error format
});
const util = require('util');
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const app = express()
const router = express.Router()

var AWSXRay = require('aws-xray-sdk');
app.use(AWSXRay.express.openSegment('HaWtf'));

var fs = require('fs');
const { notDeepEqual } = require('assert');

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

router.use(compression())
router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(awsServerlessExpressMiddleware.eventContext())




router.get('/', (req, res) => {
  res.setHeader("Content-Type","text/html");
  res.sendFile(`${__dirname}/public/index.html`)
})

router.get('/stuff', async (req, res) => {
  var results = {}
  res.json(results)
})


app.use('/api/', router)

app.use(AWSXRay.express.closeSegment());

module.exports = app




