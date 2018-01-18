/*
Copyright 2018 Kyle E. Mitchell

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var https = require('https')
var parse = require('json-parse-errback')

module.exports = function (repository, publisher, project, callback) {
  https.request({
    host: repository,
    path: (
      '/publishers/' + publisher +
      '/projects/' + project +
      '/publications'
    )
  })
    .once('response', function (response) {
      var statusCode = response.statusCode
      if (statusCode === 404) return callback(null, false)
      if (statusCode !== 200) {
        var statusError = new Error()
        statusError.statusCode = statusCode
        return callback(statusError)
      }
      var chunks = []
      response
        .on('data', function (chunk) {
          chunks.push(chunk)
        })
        .once('error', function (error) {
          callback(error)
        })
        .once('end', function () {
          parse(Buffer.concat(chunks), callback)
        })
    })
    .end()
}