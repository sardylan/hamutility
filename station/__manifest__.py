{
    "name": "Station",
    "version": "12.0.0.0.0",
    "category": "Extra Tools",
    "summary": "HAM stations managements",
    "description": "This addon can be used to manage ham radio station entities",
    "depends": [
        "mail",
        "snailmail",
        "widget_googlemaps"
    ],
    "data": [
        "security/groups.xml",
        "security/access/station.xml",

        "views/station.xml",

        "menu/action.xml",
        "menu/items.xml"
    ],
    "application": False
}
