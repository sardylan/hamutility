odoo.define('widget_googlemaps.googlemaps', function (require) {
    'use strict';

    let DebouncedField = require('web.basic_fields').DebouncedField;
    let registry = require('web.field_registry');

    let GoogleMaps = DebouncedField.extend({
        className: 'googlemaps',
        tagName: 'div',
        supportedFieldTypes: ['char'],

        init: function () {
            console.log('init');
            this._super.apply(this, arguments);
        },

        start: function () {
            console.log('start');
            let options = this.attrs.options;

            let mapDiv = $('<div>');
            mapDiv.addClass('googlemaps-map');
            $(this.el).append(mapDiv);

            if (!('center' in options)) options.center = {lat: 0, lng: 0};
            if (!('zoom' in options)) options.zoom = 4;
            if (!('mapTypeId' in options)) options.mapTypeId = 'hybrid';

            if (!('mode' in options)) options.mode = 'locator';

            this.map = new google.maps.Map(mapDiv[0], {
                center: options.center,
                zoom: options.zoom,
                mapTypeId: options.mapTypeId
            });

            switch (options.mode) {
                case 'marker':
                    this.marker = new google.maps.Marker({
                        position: {lat: 0, lng: 0},
                        title: '',
                        draggable: false,
                        map: this.map
                    });

                    break;

                case 'rectangle':
                    this.rectangle = new google.maps.Rectangle({
                        strokeColor: '#00FF00',
                        strokeOpacity: 0.75,
                        strokeWeight: 1.5,
                        fillColor: '#00FF00',
                        fillOpacity: 0.25,
                        map: this.map,
                        bounds: {
                            north: 1,
                            south: -1,
                            east: 1,
                            west: -1
                        }
                    });

                    break;
            }

            return this._super.apply(this, arguments);
        },

        _renderReadonly: function () {
            console.log('_renderReadonly');

            if (this.value === undefined) {
                return;
            }

            console.log(this.value);

            const options = this.attrs.options;

            this._setValue(this.value);

            switch (options.mode) {
                case 'marker':
                    this.marker.draggable = false;
                    this.marker.setMap(this.map);
                    break;

                case 'rectangle':
                    this.rectangle.setBounds(this.value.rectangle);
                    this.rectangle.setMap(this.map);
                    break;
            }

            const thisMap = this.map;
            setTimeout(function () {
                google.maps.event.trigger(thisMap, 'resize');
            }, 500);
        },

        _renderEdit: function () {
            console.log('_renderEdit');

            let that = this;
            let options = this.attrs.options;

            this.map.addListener('zoom_changed', function () {
                that.value = that._getValue();

                that._doDebouncedAction();
                console.log(that.value);
            });

            switch (options.mode) {
                case 'marker':
                    this.marker.draggable = true;
                    this.marker.addListener('drag', function (event) {
                        let value = that._getValue();
                        value.position = {
                            lat: event.latLng.lat(),
                            lng: event.latLng.lng()
                        };
                        that.value = value;

                        that._doDebouncedAction();
                        console.log(that.value);
                    });
                    break;

                case 'rectangle':
                    this.rectangle.setBounds(value.rectangle);

                    this.rectangle.setMap(this.map);
                    break;
            }
        },

        _formatValue: function (value) {
            console.log('_formatValue');

            try {
                return JSON.stringify(value);
            } catch (e) {
                return '{}';
            }
        },

        _parseValue: function (value) {
            console.log('_parseValue');

            try {
                return JSON.parse(value);
            } catch (e) {
                return undefined;
            }
        },

        _getValue: function () {
            console.log('_getValue');

            let options = this.attrs.options;

            if (options.mode === 'marker') {
                return {
                    position: {
                        lat: this.marker.position.lat,
                        lng: this.marker.position.lng
                    },
                    zoom: this.map.zoom
                };
            }

            return this._super.apply(this, arguments);
        },

        _setValue: function (value) {
            console.log('_setValue');

            let options = this.attrs.options;

            if (options.mode === 'marker') {
                this.map.setCenter(value.position);
                this.map.setZoom(value.zoom);

                this.marker.setPosition(value.position);
            }

        }
    });

    registry.add('googlemaps', GoogleMaps);

    return {
        'GoogleMaps': GoogleMaps
    };
});
