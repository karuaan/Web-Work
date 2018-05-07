var log = function(results, res, jsonText) {
    result.then(function(results) {
        res.json{"books": results};
    }, function(err) {
        console.log("Error: ", err);
    });
};

exports.log = log;
