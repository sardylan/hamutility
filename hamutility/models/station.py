from odoo import models, fields


class Station(models.Model):
    _name = "hamutility.station"
    _description = "HAM radio stations"
    _inherit = "mail.thread"
    _rec_name = "callsign"
    _order = "callsign ASC"

    _sql_constraints = [
        ("callsign_uniq", "UNIQUE(callsign)", "Callsign already present")
    ]

    callsign = fields.Char(
        string="Name",
        required=True,
        translate=False,
        track_visibility="onchange"
    )

    owner_partner_id = fields.Many2one(
        string="Owner",
        help="Station owner",
        comodel_name="res.partner"
    )

    position = fields.Char(
        string="Position",
        help="Position on the world",
        required=True,
        default=lambda self: self.env["widget_googlemaps.utility_googlemaps"].compute_default_position_value()
    )

    note = fields.Html(
        string="Note"
    )
