var LANG = parent.cockpit.language || 'en'
var LANG_OBJ = {}

$.get("i18n/locale-" + LANG + ".json", function (data) {
    LANG_OBJ = data
    $(document).trigger("nethserver-loaded");
});

function _(string) {
    return LANG_OBJ[string]
}