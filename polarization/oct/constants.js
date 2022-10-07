const BASE_PATH = "https://raw.githubusercontent.com/MiaMish/topographic-polarization/master/polarization_mechnisms/resources/database/";
const SCATTER_COLORS = [
    "#782372",
    "#B52B2B",
    "#182EB2",
    "#E48C1B",
    "#34912D"
];
const MAX_NUM_OF_CHARTS = 4;
const MAX_NUM_OF_RESEARCH_OPTIONS = 5;
const HIGH_LEVEL_FILTERS = [
    {
        name: "simulation_type_filter",
        displayName: "Simulation Type",
        options: ["SIMILARITY", "REPULSIVE", "ASSIMILATION"],
        experimentConfigColumn: "simulation_type"
    },
    {
        name: "polarization_reduction_mechanism_filter",
        displayName: "Polarization Reduction Mechanism",
        options: ["NONE", "RADICAL_EXPOSURE", "SWITCH_AGENTS"]
    },
    {
        name: "iterations_num_filter",
        displayName: "Number of Iterations",
        options: [30, 50],
        experimentConfigColumn: "num_iterations"
    },
];
const SERIES_FILTERS = [
    {
        name: "num_of_agents_filter",
        displayName: "Number of Agents",
        options: [15, 30],
        defaultFixedOption: 30,
        defaultSelectedResearchOptions: [15, 30],
        experimentConfigColumn: "num_of_agents",
        valueNormalizationFunc: x => parseInt(x),
    },
    {
        name: "mio",
        displayName: "Mio",
        options: [0.2, 0.4],
        defaultFixedOption: 0.2,
        defaultSelectedResearchOptions: [0.2, 0.4],
        experimentConfigColumn: "mio",
        valueNormalizationFunc: normalizeNumber,
    },
    {
        name: "num_of_repetitions",
        displayName: "Number of Repetitions",
        options: [5, 10],
        defaultFixedOption: 10,
        defaultSelectedResearchOptions: [5, 10],
        experimentConfigColumn: "num_of_repetitions",
        valueNormalizationFunc: x => parseInt(x),
    },
    {
        name: "switch_agent_rate",
        displayName: "Switch Agent Rate",
        options: [0, 5],
        defaultFixedOption: 5,
        defaultSelectedResearchOptions: [0, 5],
        experimentConfigColumn: "switch_agent_rate",
        valueNormalizationFunc: normalizeNumber,
    },
    {
        name: "switch_agent_sigma",
        displayName: "Switch Agent Sigma",
        options: [0, 0.2],
        defaultFixedOption: 0,
        defaultSelectedResearchOptions: [0, 0.2],
        experimentConfigColumn: "switch_agent_sigma",
        valueNormalizationFunc: normalizeNumber,
    },
    {
        name: "radical_exposure_eta",
        displayName: "Radical Exposure Eta",
        options: [0, 0.2],
        defaultFixedOption: 0,
        defaultSelectedResearchOptions: [0, 0.2],
        experimentConfigColumn: "radical_exposure_eta",
        valueNormalizationFunc: normalizeNumber,
    },
    {
        name: "truncate_at",
        displayName: "Truncate At",
        options: [0.0001],
        defaultFixedOption: 0.0001,
        defaultSelectedResearchOptions: [0.0001],
        experimentConfigColumn: "truncate_at",
        valueNormalizationFunc: normalizeNumber,
    },
    {
        name: "epsilon",
        displayName: "Epsilon",
        options: [0.2, 0.4, 0.6],
        defaultFixedOption: 0.4,
        defaultSelectedResearchOptions: [0.4, 0.6],
        experimentConfigColumn: "epsilon",
        valueNormalizationFunc: normalizeNumber,
    },
    {
        name: "mark_stubborn_at",
        displayName: "Mark Stubborn At",
        options: [0.1],
        defaultFixedOption: 0.1,
        defaultSelectedResearchOptions: [0.1],
        experimentConfigColumn: "mark_stubborn_at",
        valueNormalizationFunc: normalizeNumber,
    },
];
const MEASUREMENT_TYPES = [
    {name: "SPREAD"},
    {name: "DISPERSION"},
    {name: "NUM_OF_LOCAL_MAX"},
    {name: "COVERED_BINS"},
    {name: "DISCONNECT_INDEX"}
];
const HIGH_LEVEL_FILTER_ELEMENT_ID = "high_level_filters";
const RESEARCH_FILTER_OPTION_CHECKBOX_CLASS_NAME = "research_option_checkbox";
const RESEARCH_FIXED_TOGGLE_CLASS_NAME = "series_filter_fixed_checkbox";
const SERIES_CONFIG_ELEMENT_ID = "series_configs";
const SERIES_FILTER_CLASS_NAME = "seriesFilter";
const MEASUREMENT_TYPES_ELEMENT_ID = "measurement_types";
const MEASUREMENT_TYPE_CHECKBOX_CLASS_NAME = "measurement_type_checkbox"
function fixedFilterSelectElementId(seriesFilterName) {
    return `${seriesFilterName}_fixed_input`;
}

function researchFixedToggleElementId(seriesFilterName) {
    return `${seriesFilterName}_is_research`;
}

function researchFilterDivElementId(seriesFilterName) {
    return `${seriesFilterName}_research_input`;
}


function researchFilterOptionElementId(seriesFilterName, i) {
    return `${seriesFilterName}_research_input_${i}`;
}

function measurementCheckboxElementId(measurementTypeName) {
    return `${measurementTypeName}_checkbox`;
}