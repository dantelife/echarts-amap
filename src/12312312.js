(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object')
    module.exports = factory(require('echarts'));
  else if (typeof define === 'function' && define.amd)
    define(['echarts'], factory);
  else if (typeof exports === 'object')
    exports['amap'] = factory(require('echarts'));
  else
    (root['echarts'] = root['echarts'] || {}),
      (root['echarts']['amap'] = factory(root['echarts']));
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
  return /******/ (function(modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/ var installedModules = {}; // The require function
    /******/
    /******/ /******/ function __webpack_require__(moduleId) {
      /******/
      /******/ // Check if module is in cache
      /******/ if (installedModules[moduleId]) {
        /******/ return installedModules[moduleId].exports;
        /******/
      } // Create a new module (and put it into the cache)
      /******/ /******/ var module = (installedModules[moduleId] = {
        /******/ i: moduleId,
        /******/ l: false,
        /******/ exports: {},
        /******/
      }); // Execute the module function
      /******/
      /******/ /******/ modules[moduleId].call(
        module.exports,
        module,
        module.exports,
        __webpack_require__,
      ); // Flag the module as loaded
      /******/
      /******/ /******/ module.l = true; // Return the exports of the module
      /******/
      /******/ /******/ return module.exports;
      /******/
    } // expose the modules object (__webpack_modules__)
    /******/
    /******/
    /******/ /******/ __webpack_require__.m = modules; // expose the module cache
    /******/
    /******/ /******/ __webpack_require__.c = installedModules; // identity function for calling harmony imports with the correct context
    /******/
    /******/ /******/ __webpack_require__.i = function(value) {
      return value;
    }; // define getter function for harmony exports
    /******/
    /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
      /******/ if (!__webpack_require__.o(exports, name)) {
        /******/ Object.defineProperty(exports, name, {
          /******/ configurable: false,
          /******/ enumerable: true,
          /******/ get: getter,
          /******/
        });
        /******/
      }
      /******/
    }; // getDefaultExport function for compatibility with non-harmony modules
    /******/
    /******/ /******/ __webpack_require__.n = function(module) {
      /******/ var getter =
        module && module.__esModule
          ? /******/ function getDefault() {
              return module['default'];
            }
          : /******/ function getModuleExports() {
              return module;
            };
      /******/ __webpack_require__.d(getter, 'a', getter);
      /******/ return getter;
      /******/
    }; // Object.prototype.hasOwnProperty.call
    /******/
    /******/ /******/ __webpack_require__.o = function(object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    }; // __webpack_public_path__
    /******/
    /******/ /******/ __webpack_require__.p = ''; // Load entry module and return exports
    /******/
    /******/ /******/ return __webpack_require__((__webpack_require__.s = 4));
    /******/
  })(
    /************************************************************************/
    /******/ [
      /* 0 */
      /***/ function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

        /***/
      },
      /* 1 */
      /***/ function(module, exports, __webpack_require__) {
        var echarts = __webpack_require__(0);

        function AMapCoordSys(amap, api) {
          this._amap = amap;
          this.dimensions = ['lng', 'lat'];
          this._mapOffset = [0, 0];

          this._api = api;
        }

        AMapCoordSys.prototype.dimensions = ['lng', 'lat'];

        AMapCoordSys.prototype.setZoom = function(zoom) {
          this._zoom = zoom;
        };

        AMapCoordSys.prototype.setCenter = function(center) {
          this._center = this._amap.lnglatToPixel(center); //, 10)
        };

        AMapCoordSys.prototype.setMapOffset = function(mapOffset) {
          this._mapOffset = mapOffset;
        };

        AMapCoordSys.prototype.getAMap = function() {
          return this._amap;
        };

        AMapCoordSys.prototype.dataToPoint = function(data) {
          var point = new AMap.LngLat(data[0], data[1]);
          var px = this._amap.lngLatToContainer(point); //, this._zoom);
          var mapOffset = this._mapOffset;
          return [px.x - mapOffset[0], px.y - mapOffset[1]];
        };

        AMapCoordSys.prototype.pointToData = function(pt) {
          var mapOffset = this._mapOffset;
          var pt = this._amap.containerToLngLat({
            x: pt[0] + mapOffset[0],
            y: pt[1] + mapOffset[1],
          });
          return [pt.lng, pt.lat];
        };

        AMapCoordSys.prototype.getViewRect = function() {
          var api = this._api;
          return new echarts.graphic.BoundingRect(
            0,
            0,
            api.getWidth(),
            api.getHeight(),
          );
        };

        AMapCoordSys.prototype.getRoamTransform = function() {
          return echarts.matrix.create();
        };

        var Overlay;

        // For deciding which dimensions to use when creating list data
        AMapCoordSys.dimensions = AMapCoordSys.prototype.dimensions;

        AMapCoordSys.create = function(ecModel, api) {
          var amapCoordSys;
          var root = api.getDom();

          // TODO Dispose
          ecModel.eachComponent('amap', function(amapModel) {
            var viewportRoot = api.getZr().painter.getViewportRoot();
            if (typeof AMap === 'undefined') {
              throw new Error('AMap api is not loaded');
            }

            if (amapCoordSys) {
              throw new Error('Only one amap component can exist');
            }
            if (!amapModel.__amap) {
              // Not support IE8
              var amapRoot = root.querySelector('.ec-extension-amap');
              if (amapRoot) {
                // Reset viewport left and top, which will be changed
                // in moving handler in AMapView
                viewportRoot.style.left = '0px';
                viewportRoot.style.top = '0px';
                root.removeChild(amapRoot);
              }
              amapRoot = document.createElement('div');
              amapRoot.style.cssText = 'width:100%;height:100%';
              // Not support IE8
              amapRoot.classList.add('ec-extension-amap');
              root.appendChild(amapRoot);

              var options = amapModel.get() || {};
              options = amapModel.__options = echarts.util.clone(options);
              var amap = (amapModel.__amap = new AMap.Map(amapRoot, options));

              var layer = (amapModel.__layer = new AMap.CustomLayer(
                viewportRoot,
              ));
              layer.setMap(amap);
            }
            var amap = amapModel.getAMap();
            var layer = amapModel.getLayer();
            layer.hide();

            var zoom = amap.getZoom();
            var center = amap.getCenter();

            amapCoordSys = new AMapCoordSys(amap, api);
            amapCoordSys.setMapOffset(amapModel.__mapOffset || [0, 0]);
            amapCoordSys.setZoom(zoom);
            amapCoordSys.setCenter([center.lng, center.lat]);

            amapModel.coordinateSystem = amapCoordSys;
            layer.show();
          });

          ecModel.eachSeries(function(seriesModel) {
            if (seriesModel.get('coordinateSystem') === 'amap') {
              seriesModel.coordinateSystem = amapCoordSys;
            }
          });
        };

        module.exports = AMapCoordSys;

        /***/
      },
      /* 2 */
      /***/ function(module, exports, __webpack_require__) {
        function v2Equal(a, b) {
          return a && b && a[0] === b[0] && a[1] === b[1];
        }

        module.exports = __webpack_require__(0).extendComponentModel({
          type: 'amap',

          getAMap: function() {
            // __amap is injected when creating AMapCoordSys
            return this.__amap;
          },

          getLayer: function() {
            // __layer is injected when creating AMapCoordSys
            return this.__layer;
          },

          getMapOptions: function() {
            return this.__options;
          },

          setCenterAndZoom: function(center, zoom) {
            this.option.center = center;
            this.option.zoom = zoom;
          },
          setRotation: function(rotation) {
            this.option.rotation = rotation;
          },
          setPitch: function(pitch) {
            this.option.pitch = pitch;
          },
          centerOrZoomChanged: function(center, zoom) {
            var option = this.option;
            return !(v2Equal(center, option.center) && zoom === option.zoom);
          },

          defaultOption: {
            center: [116.397475, 39.908695],
            zoom: 4,
            pitch: 0,
            rotation: 0,
          },
        });

        /***/
      },
      /* 3 */
      /***/ function(module, exports, __webpack_require__) {
        /*
 * this function bollowed from:
 * https://github.com/Leaflet/Leaflet/blob/master/src/core/Util.js
 */
        function throttle(fn, time, context) {
          var lock, args, wrapperFn, later;

          later = function() {
            // reset lock and call if queued
            lock = false;
            if (args) {
              wrapperFn.apply(context, args);
              args = false;
            }
          };

          wrapperFn = function() {
            if (lock) {
              // called too soon, queue to call later
              args = arguments;
            } else {
              // call and lock until later
              fn.apply(context, arguments);
              setTimeout(later, time);
              lock = true;
            }
          };

          return wrapperFn;
        }

        var echarts = __webpack_require__(0);

        module.exports = __webpack_require__(0).extendComponentView({
          type: 'amap',

          render: function(aMapModel, ecModel, api) {
            var rendering = true;

            var amap = aMapModel.getAMap();
            var viewportRoot = api.getZr().painter.getViewportRoot();
            var coordSys = aMapModel.coordinateSystem;
            var moveHandler = function(e) {
              if (rendering) {
                return;
              }
              var offsetEl = viewportRoot.parentNode.parentNode.parentNode;
              var mapOffset = [
                -parseInt(offsetEl.style.left, 10) || 0,
                -parseInt(offsetEl.style.top, 10) || 0,
              ];
              viewportRoot.style.left = mapOffset[0] + 'px';
              viewportRoot.style.top = mapOffset[1] + 'px';

              coordSys.setMapOffset(mapOffset);
              aMapModel.__mapOffset = mapOffset;

              api.dispatchAction({
                type: 'amapRoam',
              });
            };

            function zoomEndHandler() {
              if (rendering) {
                return;
              }
              api.dispatchAction({
                type: 'amapRoam',
              });
            }

            function resizeHandler(e) {
              echarts.getInstanceByDom(api.getDom()).resize();
              moveHandler.call(this, e);
            }

            var throttledResizeHandler = throttle(resizeHandler, 300, amap);

            amap.off('movestart', this._oldMoveHandler);
            amap.off('zoomend', this._oldZoomEndHandler);
            amap.off('moveend', this._oldZoomEndHandler);
            amap.off('complete', this._oldZoomEndHandler);
            aMapModel.get('resizeEnable') &&
              amap.off('resize', this._oldResizeHandler);

            amap.on('movestart', moveHandler);
            amap.on('zoomend', zoomEndHandler);
            amap.on('moveend', zoomEndHandler);
            amap.on('complete', zoomEndHandler);
            aMapModel.get('resizeEnable') &&
              amap.on('resize', throttledResizeHandler);

            this._oldMoveHandler = moveHandler;
            this._oldZoomEndHandler = zoomEndHandler;
            this._oldResizeHandler = throttledResizeHandler;

            // var roam = aMapModel.get('roam');
            // if (roam && roam !== 'scale') {
            //     amap.enableDragging();
            // }
            // else {
            //     amap.disableDragging();
            // }
            // if (roam && roam !== 'move') {
            //     amap.enableScrollWheelZoom();
            //     amap.enableDoubleClickZoom();
            //     amap.enablePinchToZoom();
            // }
            // else {
            //     amap.disableScrollWheelZoom();
            //     amap.disableDoubleClickZoom();
            //     amap.disablePinchToZoom();
            // }

            rendering = false;
          },
        });

        /***/
      },
      /* 4 */
      /***/ function(module, exports, __webpack_require__) {
        /**
         * BMap component extension
         */
        __webpack_require__(0).registerCoordinateSystem(
          'amap',
          __webpack_require__(1),
        );
        __webpack_require__(2);
        __webpack_require__(3);

        // Action
        __webpack_require__(0).registerAction(
          {
            type: 'amapRoam',
            event: 'amapRoam',
            update: 'updateLayout',
          },
          function(payload, ecModel) {
            ecModel.eachComponent('amap', function(aMapModel) {
              var amap = aMapModel.getAMap();
              var center = amap.getCenter();
              aMapModel.setCenterAndZoom(
                [center.lng, center.lat],
                amap.getZoom(),
              );
              aMapModel.setRotation(amap.getRotation());
              aMapModel.setPitch(amap.getPitch());
            });
          },
        );

        module.exports = {
          version: '1.0.0-rc.6',
        };

        /***/
      },
      /******/
    ],
  );
});

// WEBPACK FOOTER //
// echarts-amap.min.js
