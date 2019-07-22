from odoo import models, api


class GoogleMapsUtility(models.AbstractModel):
    _name = "widget_googlemaps.utility_googlemaps"

    @api.model
    def compute_default_position_value(self):
        return '{}'
