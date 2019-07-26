import json

from odoo import models, api


class GoogleMapsUtility(models.AbstractModel):
    _name = "widget_googlemaps.utility_googlemaps"

    @api.model
    def compute_default_position_value(self):
        return json.dumps({
            "position": {
                "lat": 0,
                "lng": 0
            },
            "zoom": 4
        })

    @api.model
    def get_coordinates_from_position(self, raw_position):
        position = json.loads(raw_position)

        if "position" not in position:
            return 0, 0

        if "lat" not in position["position"] or "lng" not in position["position"]:
            return 0, 0

        latitude = float(position["position"]["lat"])
        longitude = float(position["position"]["lng"])

        return latitude, longitude
