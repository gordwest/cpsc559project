// MongoDB POST /Delete Endpoint
// https://us-east-1.aws.data.mongodb-api.com/app/filesystem-lkvhv/endpoint/delete

// MongoDB DeleteFile function -> parses /delete request
// Deletes the first document matching the 'name' param
exports = function({ query, headers, body}, response) {
    const result = context.services
      .get("mongodb-atlas")
      .db("fileSystem")
      .collection("files")
      .deleteOne({name : query.name});
    return result;
  };
  