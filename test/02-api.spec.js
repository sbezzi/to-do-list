/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const supertest = require('supertest');
const should = require('should');

const port = process.env.PORT || 3000;
const url = 'http://localhost:' + port;
const request = supertest.agent(url);

let NEXT_ORDER = 1;
function getOrder() { return NEXT_ORDER++; }

describe('API', () => {

  before((done) => {
    done();
  });

  after((done) => {
    done();
  });

  describe('scenario 1 - create an entry and retrieve it', () => {

    it('database must be empty', (done) => {
      request
        .get('/api/todos')
        .set('Accept', 'application/json; charset=utf-8')
        .send()
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.be.an.Array();
            res.body.should.be.empty();
            done();
          }
        });
    });

    let itemId = null;

    it('create an item', (done) => {
      const item = {
        title: 'sample item',
        completed: false,
        order: getOrder()
      };

      request
        .post('/api/todos')
        .set('Accept', 'application/json; charset=utf-8')
        .send(item)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property('id').which.is.a.String();
            res.body.should.have.property('title','sample item');
            itemId = res.body.id;
            done();
          }
        });
    });

    it('retrieve an item', (done) => {
      request
        .get('/api/todos/' + itemId)
        .set('Accept', 'application/json; charset=utf-8')
        .send()
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property('id', '0');
            res.body.should.have.property('title','sample item');
            res.body.should.have.property('completed', false);
            res.body.should.have.property('order', 1);
            done();
          }
        });
    });

    it('update an item', (done) => {
      const item = {
        _id: itemId,
        title: 'updated item',
        completed: true,
        order: getOrder()
      };

      request
        .put('/api/todos/' + itemId)
        .set('Accept', 'application/json; charset=utf-8')
        .send(item)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property('id','0');
            res.body.should.have.property('title','updated item');
            res.body.should.have.property('completed', true);
            res.body.should.have.property('order', 2);
            done();
          }
        });
    });

    it('delete an item', (done) => {
      request
        .delete('/api/todos/' + itemId)
        .set('Accept', 'application/json; charset=utf-8')
        .send()
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property('id','0');
            res.body.should.have.property('title','updated item');
            res.body.should.have.property('completed', true);
            res.body.should.have.property('order', 2);
            done();
          }
        });
    });

    it('database should be empty', (done) => {
      request
        .get('/api/todos')
        .set('Accept', 'application/json; charset=utf-8')
        .send()
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.be.an.Array();
            res.body.should.be.empty();
            done();
          }
        });
    });
  });
});
