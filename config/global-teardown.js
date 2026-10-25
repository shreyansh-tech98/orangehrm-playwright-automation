/**
 * Runs once after the whole suite finishes. Use this for cleanup that
 * shouldn't happen per-test: deleting test data created via API, clearing
 * temp files, closing external DB connections, etc.
 */
module.exports = async () => {
  console.log('[global-teardown] Test suite finished. Add cleanup logic here.');
};
