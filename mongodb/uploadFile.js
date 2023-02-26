// MongoDB POST /Upload Endpoint
// https://us-east-1.aws.data.mongodb-api.com/app/filesystem-lkvhv/endpoint/upload

// MongoDB CreateFile function -> parses /upload request
// Creates a new document with 'name' & 'file' data
exports = function({ query, headers, body}, response) {
    const result = context.services
      .get("mongodb-atlas")
      .db("fileSystem")
      .collection("files")
      .insertOne({
        name: query.name,
        file : JSON.parse(body.text()).file
      });
      return result;
  };
  