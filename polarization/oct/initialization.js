function fillHighLevelFilters() {
    let parentDiv = document.getElementById(HIGH_LEVEL_FILTER_ELEMENT_ID);
    HIGH_LEVEL_FILTERS.forEach(highLevelFilter => {
        let selectList = document.createElement("select");
        selectList.id = highLevelFilter.name;
        selectList.addEventListener('change', () => fillSeriesFilters());
        parentDiv.appendChild(selectList);
        highLevelFilter.options.forEach(highLevelOption => {
            let option = document.createElement("option");
            option.value = highLevelOption;
            option.text = highLevelOption;
            selectList.appendChild(option);
        })
    })
}


function _createFilterInputElement(seriesFilter) {
    let filterInput = document.createElement("div");

    // Add the fixed input element (disabled text input)
    let fixedFilterInput = document.createElement("select");
    fixedFilterInput.id = fixedFilterSelectElementId(seriesFilter.name);
    fixedFilterInput.value = seriesFilter.defaultFixedOption;
    fixedFilterInput.hidden = false;
    seriesFilter.options.forEach(seriesOption => {
        let fixedOption = document.createElement("option");
        fixedOption.value = seriesOption.toString();
        fixedOption.innerText = seriesOption.toString();
        fixedOption.selected = (seriesFilter.defaultFixedOption === seriesOption);
        fixedFilterInput.appendChild(fixedOption);
    })

    // Add the research input element (checkbox group)
    let researchFilterInput = document.createElement("div");
    researchFilterInput.id = researchFilterDivElementId(seriesFilter.name);
    let i = 0;
    seriesFilter.options.forEach(seriesOption => {
        let researchCheckbox = document.createElement("input");
        researchCheckbox.type = "checkbox";
        researchCheckbox.value = seriesOption.toString();
        researchCheckbox.checked = seriesFilter.defaultSelectedResearchOptions.includes(seriesOption);
        researchCheckbox.className = RESEARCH_FILTER_OPTION_CHECKBOX_CLASS_NAME;
        researchCheckbox.id = researchFilterOptionElementId(seriesFilter.name, i);

        researchCheckbox.addEventListener("click", (event) => {
            let myCheckbox = document.getElementById(researchCheckbox.id);
            if (!myCheckbox.checked) {
                return;
            }
            let numOfCheckedCheckboxes = 0;
            let allCheckboxes = document.getElementById(researchFilterDivElementId(seriesFilter.name)).getElementsByClassName(RESEARCH_FILTER_OPTION_CHECKBOX_CLASS_NAME);
            Array.prototype.forEach.call(allCheckboxes, function (checkbox) {
                if (checkbox.checked) {
                    numOfCheckedCheckboxes += 1;
                }
            });
            if (numOfCheckedCheckboxes > MAX_NUM_OF_RESEARCH_OPTIONS) {
                myCheckbox.checked = false;
                window.alert(`Sorry! You can choose up to ${MAX_NUM_OF_RESEARCH_OPTIONS} options.`)
            }
        });

        let label = document.createElement('label')
        label.htmlFor = researchFilterOptionElementId(seriesFilter.name, i);
        label.appendChild(document.createTextNode(seriesOption.toString()));
        researchFilterInput.appendChild(researchCheckbox);
        researchFilterInput.appendChild(label);
        i += 1;
    })
    researchFilterInput.hidden = true;

    filterInput.appendChild(fixedFilterInput);
    filterInput.appendChild(researchFilterInput);
    return filterInput
}

function _createFixedCheckboxElement(seriesFilter) {
    let fixedCheckbox = document.createElement("input");
    fixedCheckbox.type = "checkbox";
    fixedCheckbox.innerText = "Fixed";
    fixedCheckbox.className = RESEARCH_FIXED_TOGGLE_CLASS_NAME;
    fixedCheckbox.checked = false;
    fixedCheckbox.id = researchFixedToggleElementId(seriesFilter.name);
    fixedCheckbox.addEventListener("click", () => {
        let myCheckbox = document.getElementById(researchFixedToggleElementId(seriesFilter.name));
        if (!myCheckbox.checked) {
            return;
        }
        let allCheckboxes = document.getElementsByClassName(RESEARCH_FIXED_TOGGLE_CLASS_NAME);
        Array.prototype.forEach.call(allCheckboxes, function (checkbox) {
            if (checkbox.id !== researchFixedToggleElementId(seriesFilter.name)) {
                checkbox.checked = false;
                // Setting the checked property of a checkbox doesn't trigger a change event from that checkbox.
                // Dispatch it manually...
                let change = new Event('change');
                checkbox.dispatchEvent(change);
            }
        });
    });
    fixedCheckbox.addEventListener("change", () => {
        let myCheckbox = document.getElementById(researchFixedToggleElementId(seriesFilter.name));
        document.getElementById(fixedFilterSelectElementId(seriesFilter.name)).hidden = myCheckbox.checked;
        document.getElementById(researchFilterDivElementId(seriesFilter.name)).hidden = !myCheckbox.checked;
    });
    return fixedCheckbox;
}

function fillSeriesFilters() {
    let parentDiv = document.getElementById(SERIES_CONFIG_ELEMENT_ID);
    SERIES_FILTERS.forEach(seriesFilter => {
        let filterDiv = document.createElement("div");
        filterDiv.class = SERIES_FILTER_CLASS_NAME;

        // Add the div fixed/research toggle
        filterDiv.appendChild(_createFixedCheckboxElement(seriesFilter));

        // Add the div display name
        filterDiv.appendChild(document.createTextNode(seriesFilter.displayName));

        // Add the input filter
        filterDiv.appendChild(_createFilterInputElement(seriesFilter));

        // Append filter div to parent
        parentDiv.appendChild(filterDiv);
    })
}

function fillMeasurementTypeCheckbox() {
    let measurementTypeContainer = document.getElementById(MEASUREMENT_TYPES_ELEMENT_ID);
    MEASUREMENT_TYPES.forEach(measurementType => {
        let measurementTypeCheckbox = document.createElement("input");
        measurementTypeCheckbox.type = "checkbox";
        measurementTypeCheckbox.value = measurementType.name;
        measurementTypeCheckbox.checked = false;
        measurementTypeCheckbox.id = measurementCheckboxElementId(measurementType.name);
        measurementTypeCheckbox.className = MEASUREMENT_TYPE_CHECKBOX_CLASS_NAME;
        measurementTypeCheckbox.addEventListener("click", () => {
            let myCheckbox = document.getElementById(measurementCheckboxElementId(measurementType.name));
            if (!myCheckbox.checked) {
                return;
            }
            let numOfCheckedCheckboxes = 0;
            let allCheckboxes = document.getElementsByClassName(MEASUREMENT_TYPE_CHECKBOX_CLASS_NAME);
            Array.prototype.forEach.call(allCheckboxes, function (checkbox) {
                if (checkbox.checked) {
                    numOfCheckedCheckboxes += 1;
                }
            });
            if (numOfCheckedCheckboxes > MAX_NUM_OF_CHARTS) {
                myCheckbox.checked = false;
                window.alert(`Sorry! You can choose up to ${MAX_NUM_OF_CHARTS} measurements types.`)
            }
        });
        let label = document.createElement('label')
        label.htmlFor = measurementCheckboxElementId(measurementType.name);
        label.appendChild(document.createTextNode(measurementType.name));
        measurementTypeContainer.appendChild(measurementTypeCheckbox);
        measurementTypeContainer.appendChild(label);
    });
}

function setDefaultChartsConfig() {
    // click on the first fixed/research toggle
    document.getElementsByClassName(RESEARCH_FIXED_TOGGLE_CLASS_NAME).item(0).click();

    // click on the first measurement type
    document.getElementsByClassName(MEASUREMENT_TYPE_CHECKBOX_CLASS_NAME).item(0).click();
}

function initializePage() {
    fillHighLevelFilters();
    fillSeriesFilters();
    fillMeasurementTypeCheckbox();
    setDefaultChartsConfig();
}