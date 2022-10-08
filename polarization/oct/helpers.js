function getCsvData(path_to_csv) {
    return new Promise((resolve, reject) => {
        $.ajax({
            // url: "https://raw.githubusercontent.com/WaydeHerman/ScatterPlot/master/data.csv",
            url: path_to_csv,
            success: function (csv) {
                const output = Papa.parse(csv, {
                    header: true, // Convert rows to Objects using headers as properties
                });
                resolve(output.data);
            },
            error: function (error) {
                reject(error)
            },
        });
    });
}

function normalizeNumber(x) {
    if (x === "" || x === "NULL") {
        return "0.0000";
    }
    return parseFloat(x).toFixed(4);
}