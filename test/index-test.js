describe('object-id', function() {
  var expect   = require('chai').expect;
  var range    = require('range');
  var uniq     = require('uniq');
  var objectId = require('object-id');

  it('generates 24 length hash', function() {
    expect(objectId()).length(24);
    expect(objectId()).match(/[a-f,0-9]{24}/);
  });

  it('algorithm is valid for big number of users', function() {
    var methods = [];
    var ids     = [];
    var counts  = range(0, 100);
    var tryes   = range(0, 50);

    counts.forEach(function() {
      var increment = 0x1000000;
      var localId1  = ((1+Math.random())*0x100000 | 0).toString(16).substring(1);
      var localId2  = ((1+Math.random())*0x100000 | 0).toString(16).substring(1);

      methods.push(function mongo() {
        var dateNow = ((new Date()).getTime()/100 | 0).toString(16);
        return dateNow + localId1 + localId2 + (++increment).toString(16).substring(1);
      });
    });

    tryes.forEach(function() {
      methods.forEach(function(method) { ids.push(method()) });
    });

    expect(ids[0]).match(/[a-f,0-9]{24}/);
    expect(uniq(ids)).length(counts.length * tryes.length);
  });
});
