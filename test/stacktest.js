let chai = require('chai');
let expect = chai.expect;
let jsonDiff = require('./jsondiff');
let totalObjectKeys = require('./totalObjectKeys');

let expectedJSON = require('./json/stack.json');
let actualJSON = require('../output/stack.json');

describe('Test Application as Blackbox', function(){
  it ('Test JSON is well formed', function(done){

    done();
  });

  it('JSON has expected Number of Objects', function(done){
      let objMatrix = totalObjectKeys.traverse(actualJSON.data);
      expect(objMatrix.totalNoObjects).to.not.equal(0);
      expect(objMatrix.totalNoKeys).to.not.equal(0);
     done();
  });

  it('Test JSON is as expected', function(done){
    let compareResult = jsonDiff.compareJSONObjects(expectedJSON.data, actualJSON.data);
    expect(compareResult.diffs).equal(0);
    done();
  });
});
