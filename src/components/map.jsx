import React, { useEffect } from "react";
import "./styles.css";
import style from "./style.module.css";

// -- BASIC RENDER MAP --
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import esriConfig from "@arcgis/core/config";

// -- LAYER --
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import RouteLayer from "@arcgis/core/layers/RouteLayer";

// -- WIDGETS --
import Search from "@arcgis/core/widgets/Search";
import Directions from "@arcgis/core/widgets/Directions.js";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle.js";
import LayerList from "@arcgis/core/widgets/LayerList";

// -- LAYER STYLE --
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import Color from "@arcgis/core/Color";

const MyMap = () => {
  useEffect(() => {
    const apikey = process.env.REACT_APP_API_KEY;
    esriConfig.apiKey = apikey;
    // -- POP-UP --

    const template = {
      title: "{nam}",
      content: [
        {
          type: "fields",
          fieldInfos: [
            { fieldName: "pop", label: "Población" },
            { fieldName: "rural", label: "Población rural" },
            { fieldName: "urbana", label: "Población urbana" },
          ],
        },
      ],
    };

    // -- LAYER STYLE -> PROVINCE --

    const rendererP = new UniqueValueRenderer({
      field: "fna",
      defaultSymbol: new SimpleFillSymbol({
        style: SimpleFillSymbol.STYLE_SOLID,
        color: new Color("#e81e5e"),
        outline: new SimpleLineSymbol({
          style: SimpleLineSymbol.STYLE_SOLID,
          color: new Color([0, 0, 0]),
        }),
      }),
    });

    // -- LAYERS --

    const routeLayer = new RouteLayer();

    let urlProvince =
      "https://provincias-api-default-rtdb.firebaseio.com/data.json";
    let urlGeoRed =
      "https://redes-geodesicas-default-rtdb.firebaseio.com/data.json";

    const province = new GeoJSONLayer({
      title: "Provincias",
      url: urlProvince,
      opacity: 0.4,
      renderer: rendererP,
      popupTemplate: template,
      visible: false,
    });

    const geored = new GeoJSONLayer({
      title: "Redes geodésicas",
      url: urlGeoRed,
      visible: false,
    });

    // -- MAP --

    var myMap = new Map({
      basemap: "satellite",
      layers: [province, geored, routeLayer],
    });

    // -- RENDER -> VIEW MAP --
    const view = new MapView({
      container: "mapContainer",
      map: myMap,
      center: [-58.37723, -34.61315],
      zoom: 5,
    });

    // --WIDGET -> DIRECTIONS --
    const directionWidget = new Directions({
      apiKey: apikey,
      view,
      layer: routeLayer
    });

    // -- WIDGET -> SEARCH --
    const search = new Search({
      //Add Search widget
      view: view,
    });

    // -- WIDGET -> BASEMAP TOGGLE --
    const basemapToggle = new BasemapToggle({
      view: view,
      nextBasemap: "arcgis-topographic",
    });

    // -- WIDGET ->  --
    const layerList = new LayerList({
      view: view,
    });

    // -- AGREGAR WIDGETS --
    view.ui.add(search, "top-right");
    view.ui.add(directionWidget, {
      position: "top-right",
    });
    view.ui.add(layerList, {
      position: "top-right",
    });
    view.ui.add(basemapToggle, {
      position: "top-left",
    });
  }, []);
  return (
    <div className={style.mainContainer}>
      <div className={style.divContainer}>
        <div id="mapContainer"></div>
      </div>
    </div>
  );
};

export default MyMap;
