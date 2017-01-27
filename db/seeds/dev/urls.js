const shortenURL = require('../../../shorten-url');

exports.seed = function(knex, Promise) {
  return knex('urls').del()
  .then(() => {
    return Promise.all([
      knex('urls').insert({
        longURL: 'http://www.espn.com/',
        shortURL: shortenURL('http://www.espn.com/'),
        parentFolder: 'Sports',
        id: 1,
        folder_id: 1167,
        clickCount: 0,
        created_at: new Date,
        requestType: 'bookmark-update',
      }),
      knex('urls').insert({
        longURL: 'http://bleacherreport.com/',
        shortURL: shortenURL('http://bleacherreport.com/'),
        parentFolder: 'Sports',
        id: 2,
        folder_id: 1167,
        clickCount: 0,
        created_at: new Date,
        requestType: 'bookmark-update',
      }),
      knex('urls').insert({
        longURL: 'http://www.cats.com/',
        shortURL: shortenURL('http://www.cats.com/'),
        parentFolder: 'Cats',
        id: 3,
        folder_id: 1169,
        clickCount: 0,
        created_at: new Date,
        requestType: 'bookmark-update',
      }),
      knex('urls').insert({
        longURL: 'http://kittens.com/',
        shortURL: shortenURL('http://kittens.com/'),
        parentFolder: 'Cats',
        id: 4,
        folder_id: 1169,
        clickCount: 0,
        created_at: new Date,
        requestType: 'bookmark-update',
      })
    ]);
  });
};
