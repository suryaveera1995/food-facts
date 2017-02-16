let chai = require('chai');
let expect = chai.expect;
let jsonDiff = require('./jsondiff');
let totalObjectKeys = require('./totalObjectKeys');
 
let expectedJSON = require('./json/line.json');

let actualJSON = require('../output/line.json');
let objectKeys = Object.keys(expectedJSON);

describe('Test Application as Blackbox', function(){
  it ('Test JSON is well formed', function(done){

    done();
  });

  it('JSON has expected Number of Objects', function(done){
    for(let i=0; i < objectKeys.length; i++ ){
      let objMatrix = totalObjectKeys.traverse(actualJSON[objectKeys[i]]);
      expect(objMatrix.totalNoObjects).to.not.equal(0);
      expect(objMatrix.totalNoKeys).to.not.equal(0);
    }
    done();
  });

  it('Test JSON is as expected', function(done){
    for(let i=0; i < objectKeys.length; i++ ){
      let compareResult = jsonDiff.compareJSONObjects(expectedJSON[objectKeys[i]], actualJSON[objectKeys[i]]);
      expect(compareResult.diffs).equal(0);
    }
    done();
  });
});
