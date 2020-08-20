module.exports = {
    extends: "@cybozu/eslint-config/presets/es5",
    "env": {"browser": true},
    "globals": {
        "kintoneUIComponent": false,
        "KintoneRestAPIClient": false
    }
};