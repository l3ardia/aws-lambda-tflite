import * as convict from 'convict';

// Add validation for arrays
// See: https://github.com/mozilla/node-convict/tree/master/packages/convict#custom-format-for-array-items
convict.addFormat({
  name: 'source-array',
  validate: function (sources, schema) {
    if (!Array.isArray(sources)) {
      throw new Error('must be of type Array');
    }

    for (const source of sources) {
      convict(schema.children).load(source).validate();
    }
  },
});
