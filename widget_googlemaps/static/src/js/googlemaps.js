odoo.define('widget_googlemaps.googlemaps', function (require) {
    'use strict';

    const DEFAULT_VALUE = {
        position: {
            lat: 0,
            lng: 0
        },
        zoom: 4
    };

    let DebouncedField = require('web.basic_fields').DebouncedField;
    let registry = require('web.field_registry');

    let GoogleMaps = DebouncedField.extend({
        className: 'googlemaps',
        tagName: 'div',
        supportedFieldTypes: ['char'],

        map: undefined,

        init: function (parent, name, record, options) {
            this._super(parent, name, record, options);

            console.log('init');

            this.nodeOptions = _.extend({
                center: {lat: 0, lng: 0},
                zoom: 4,
                mapTypeId: 'hybrid',
                mode: 'locator'
            }, this.attrs.options);

            console.log(this.nodeOptions);
        },

        start: function () {
            console.log('start');

            let options = this.nodeOptions;

            let mapDiv = $('<div>');
            mapDiv.addClass('googlemaps-map');
            $(this.el).append(mapDiv);

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

            return this._super();
        },

        _renderReadonly: function () {
            console.log('_renderReadonly');

            let options = this.nodeOptions;
            let value = this._readValue();

            switch (options.mode) {
                case 'marker':
                    this.map.setCenter(value.position);
                    this.map.setZoom(value.zoom);

                    this.marker.draggable = false;
                    this.marker.setPosition(value.position);

                    this.marker.setMap(this.map);
                    break;

                case 'rectangle':
                    this.rectangle.setBounds(value.rectangle);

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
            let options = this.nodeOptions;
            let value = this._readValue();

            this.map.addListener('zoom_changed', function () {
                that.isDirty = true;
                that._doDebouncedAction();
            });

            switch (options.mode) {
                case 'marker':
                    this.map.setCenter(value.position);
                    this.map.setZoom(value.zoom);

                    this.marker.draggable = true;
                    this.marker.setMap(this.map);
                    this.marker.setPosition(value.position);
                    this.marker.addListener('drag', function (event) {
                        that.isDirty = true;
                        that._doDebouncedAction();
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
            return this._formatValue(value);
        },

        _getValue: function () {
            console.log('_getValue');

            const position = this.marker.getPosition();

            return {
                position: {
                    lat: position.lat(),
                    lng: position.lng()
                },
                zoom: this.map.getZoom()
            }
        },

        _readValue: function () {
            if (!this.value
                || this.value === false
                || this.value === ''
                || this.value === '{}') {
                return DEFAULT_VALUE;
            }

            let value = undefined;

            try {
                value = JSON.parse(this.value);
            } catch (e) {
            }

            if (value === undefined
                || value === false
                || value === {}) {
                return DEFAULT_VALUE;
            }

            return value
        }
    });

    registry.add('googlemaps', GoogleMaps);

    return {
        'GoogleMaps': GoogleMaps
    };
});
