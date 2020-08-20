module.exports = {
    extends: "@cybozu/eslint-config/presets/kintone-customize-es5",
    "env": {"browser": true},
    "globals": {
        "kintoneUIComponent": false,
        "KintoneRestAPIClient": false
    }
};