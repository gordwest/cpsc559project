// MongoDB GET /Doenload Endpoint
// https://us-east-1.aws.data.mongodb-api.com/app/filesystem-lkvhv/endpoint/download

// MongoDB DownloadFile function -> parses /download request
// Returns the first document matching the 'name' param
exports = function({ query, headers, body}, response) {
    const doc = context.services
      .get("mongodb-atlas")
      .db("fileSystem")
      .collection("files")
      .findOne({name: query.name})    
      return doc
};