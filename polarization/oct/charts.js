function zipExperimentsConfigsAndID(configIDs, researchFilter, experimentResults) {
    return configIDs.map(experimentConfig => {
        let configId = experimentConfig["config_id"];
        let displayName = `${researchFilter.displayName}: ${experimentConfig[researchFilter["experimentConfigColumn"]]}`;
        let experimentsForConfig = experimentResults.filter(experiment_result => experiment_result["config_id"] === configId)
            .sort((result, other) => other.timestamp - result.timestamp);
        let experimentId = experimentsForConfig[0].experiment_id;

        return {displayName: displayName, experimentId: experimentId};
    });
}

function chartMeasurements(measurementsToChart, configIDs) {
    return data => {
        for (let i = 0; i < measurementsToChart.length; i++) {
            let chart = anychart.scatter();
            for (let seriesIndex = 0; seriesIndex < configIDs.length; seriesIndex++) {
                let seriesData = data.filter(item => item.experiment_id === configIDs[seriesIndex]["experimentId"] && item.measurement_type === measurementsToChart[i]).map(item => ({
                    x: item.x,
                    value: item.value
                }));
                let seriesMarker = chart.marker(seriesData);
                seriesMarker.normal().fill(SCATTER_COLORS[seriesIndex]);
                seriesMarker.name(configIDs[seriesIndex].displayName);
            }
            let legend = chart.legend();
            legend.enabled(true);
            document.getElementById(`chart_container_${i}`).innerHTML = "";
            chart.container(`chart_container_${i}`).draw();
        }

    };
}

function generateCharts() {
    let researchFilter;
    SERIES_FILTERS.forEach(seriesFilter => {
        if (document.getElementById(researchFixedToggleElementId(seriesFilter.name)).checked) {
            researchFilter = seriesFilter;
        }
    });
    let measurementsToChart = [];
    Array.prototype.forEach.call(document.getElementsByClassName(MEASUREMENT_TYPE_CHECKBOX_CLASS_NAME), checkbox => {
        if (checkbox.checked) {
            measurementsToChart.push(checkbox.value);
        }
    });

    getCsvData(BASE_PATH + "experiment_configs")
        .then(filterExperiments)
        .then(filteredConfigs => {
            return getCsvData(BASE_PATH + "experiment_result")
                .then(experimentResults => zipExperimentsConfigsAndID(filteredConfigs, researchFilter, experimentResults))
            })
        .then(configIDs => {
            getCsvData(BASE_PATH + "measurements")
                .then(chartMeasurements(measurementsToChart, configIDs))
        });

    function filterExperiments(experimentConfigs) {
        let configIDs = experimentConfigs.filter(experimentConfig => experimentConfig["config_id"] && experimentConfig["config_id"] !== "");

        HIGH_LEVEL_FILTERS.forEach(highLevelFilter => {

            let valueNormalizationFunc = x => x;
            if (highLevelFilter["valueNormalizationFunc"]) {
                valueNormalizationFunc = highLevelFilter["valueNormalizationFunc"];
            }

            if (highLevelFilter["experimentConfigColumn"]) {
                let valueToFilter = valueNormalizationFunc(document.getElementById(`${highLevelFilter.name}`).value);
                configIDs = configIDs.filter(experimentConfig => valueNormalizationFunc(experimentConfig[highLevelFilter["experimentConfigColumn"]]) === valueToFilter);
            }
        });

        SERIES_FILTERS.forEach(seriesFilter => {
            if (!seriesFilter["experimentConfigColumn"]) {
                return;
            }
            let valueNormalizationFunc = x => x;
            if (seriesFilter["valueNormalizationFunc"]) {
                valueNormalizationFunc = seriesFilter["valueNormalizationFunc"];
            }
            let is_fixed = !document.getElementById(researchFixedToggleElementId(seriesFilter.name)).checked;
            if (is_fixed) {
                let valueToFilter = valueNormalizationFunc(document.getElementById(fixedFilterSelectElementId(seriesFilter.name)).value);
                configIDs = configIDs.filter(experimentConfig => valueNormalizationFunc(experimentConfig[seriesFilter["experimentConfigColumn"]]) === valueToFilter)
            } else {
                let parentDiv = document.getElementById(researchFilterDivElementId(seriesFilter.name));
                let inValueList = [];
                Array.prototype.forEach.call(parentDiv.getElementsByClassName(RESEARCH_FILTER_OPTION_CHECKBOX_CLASS_NAME), researchInputCheckbox => {
                    if (researchInputCheckbox.checked) {
                        let valueToFilter = valueNormalizationFunc(researchInputCheckbox.value);
                        inValueList.push(valueToFilter);
                    }
                });
                configIDs = configIDs.filter(experimentConfig => inValueList.includes(valueNormalizationFunc(experimentConfig[seriesFilter["experimentConfigColumn"]])));

            }
        });
        return configIDs;
    }


}