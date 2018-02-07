import DS from 'ember-data';

//export default DS.JSONAPISerializer.extend({
export default DS.RESTSerializer.extend({
  modelNameFromPayloadKey: function() {
    console.log('model in serializer');
    return this._super('pdf');
  },
  extractMeta: function(store, type, payload) {
    console.log('extract');
    console.log('extract' + store);
    console.log(type);
    console.log(payload);
  },
  extract: function(store, type, payload, id, requestType) {
    console.log('ex');
  },
  normalize: function(modelClass, resourceHash) {
    console.log('norm');
    var data = {
      id: resourceHash.id,
      type: modelClass.modelName,
      attributes: resourceHash
    };
    return { data: data};
  }
});
