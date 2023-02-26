// MongoDB GET /FILES Endpoint
// https://us-east-1.aws.data.mongodb-api.com/app/filesystem-lkvhv/endpoint/files

// MongoDB GetFiles function -> /files request
// Returns all documents in the 'files' collection
exports = function({ query, headers, body}, response) {
    const docs = context.services
      .get("mongodb-atlas")
      .db("fileSystem")
      .collection("files")
      .find({})
      .toArray();
      
      return docs
};

  