require('colors');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var wd;
try {
  wd = require('wd');
} catch( err ) {
  wd = require('../../lib/main');
}

// enables chai assertion chaining
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

var Q = wd.Q;

var browser = wd.promiseChainRemote();

// optional extra logging
//browser._debugPromise();
browser.on('status', function(info) {
  console.log(info.cyan);
});
browser.on('command', function(meth, path, data) {
  console.log(' > ' + meth.yellow, path.grey, data || '');
});

browser
  .init({browserName: 'chrome'})
  .get('http://angularjs.org/')
  .elementById('the-basics')
  .text().should.become('The Basics')
  .then(function() {
    return Q.all([
      browser.elementById('the-basics'),
      browser.sleep(1000)]);
  })
  .get('http://google.com/')
  .then(function() { console.log("Hey I've finished"); })
  .fin(function() { return browser.quit(); })
  .done();
