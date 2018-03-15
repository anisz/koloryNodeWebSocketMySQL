var qs = require('querystring');

exports.table = function (db) {
    var query = "SELECT * FROM avarage ";
    var html;
    db.query(
        query,
        function (err, rows) {
            if (err) throw err;
            exports.html = '<table class="table table-striped" >';
            exports.html += ' <thead><tr><th><font color="green">Zielony</font></th><th><font color="#990099">Fioletowy</font></th><th><font color="#FE0606">Czerwony</font></th><th><font color="#0066FF">Niebieski</font></th> <th><font color="#FF6A00">Pomarańczowy</font></th></tr></thead> ';
            for (var i in rows) {
                exports.html += '<tr>';
                exports.html += '<td><font color="green">' + rows[i].green + '</font></td>';
                exports.html += '<td><font color="#990099">' + rows[i].purple + '</font></td>';
                exports.html += '<td><font color="#FE0606">' + rows[i].red + '</font></td>';
                exports.html += '<td><font color="#0066FF">' + rows[i].blue + '</font></td>';
                exports.html += '<td><font color="#FF6A00">' + rows[i].yellow + '</font></td>';
                exports.html += '</tr>';
            }
            exports.html += '</table>';
        }
    );
}


exports.add = function (db, req) {
    exports.parseReceivedData(req, function (kolory) {
        db.query(
            "INSERT INTO avarage (id, red, purple, blue, green, yellow) " +
            " VALUES (?, ?, ?, ?, ?, ?)",
            [kolory.id, kolory.red, kolory.purple, kolory.blue, kolory.green, kolory.yellow],
            function (err) {
                if (err) throw err;
            }
        );
    });
};

exports.delete = function (db, req) {
    exports.parseReceivedData(req, function (kolory) {
        db.query(
            "DELETE FROM avarage WHERE id=?",
            [kolory.id],
            function (err) {
                if (err) throw err;
            }
        );
    });
};

exports.deleteAll = function (db, req) {
    exports.parseReceivedData(req, function (kolory) {
        db.query(
            "DELETE FROM avarage",
            function (err) {
                if (err) throw err;
            }
        );
    });
};

exports.avarage = function (db) {
    var query = "SELECT ROUND(AVG(red),2) as redAvg, ROUND(AVG(purple),2) as purlpeAvg, ROUND(AVG(blue),2) blueAvg, ROUND(AVG(green),2) as greenAvg, ROUND(AVG(yellow),2) as yellowAvg FROM avarage";
    db.query(
        query,
        function (err, rows) {
            if (err) throw err;
            exports.red = rows[0].redAvg;
            exports.purple = rows[0].purlpeAvg;
            exports.blue = rows[0].blueAvg;
            exports.green = rows[0].greenAvg;
            exports.yellow = rows[0].yellowAvg;
        }
    );
};

exports.parseReceivedData = function (req, cb) {
    var body = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) { body += chunk });
    req.on('end', function () {
        var data = qs.parse(body);
        cb(data);
    });
};


