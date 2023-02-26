import React, { useEffect } from "react";
import "./styles.css";
import style from "./style.module.css";

// -- BASIC RENDER MAP --
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import esriConfig from "@arcgis/core/config";

// -- LAYER --
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";

// -- WIDGETS --
import Search from "@arcgis/core/widgets/Search";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import LayerList from "@arcgis/core/widgets/LayerList";

// -- LAYER STYLE --
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import Color from "@arcgis/core/Color";

const MyMap = () => {
  useEffect(() => {
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

    let urlProvince = "https://provincias-api-default-rtdb.firebaseio.com/data.json";
    let urlGeoRed = "https://redes-geodesicas-default-rtdb.firebaseio.com/data.json";
    
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
      opacity: 0.7,
      show: false,
      visible: false,
    });

    // -- MAP --

    var myMap = new Map({
      basemap: "satellite",
      layers: [province, geored],
    });

    // -- RENDER -> VIEW MAP --
    const view = new MapView({
      container: "mapContainer",
      map: myMap,
      center: [-58.37723, -34.61315],
      zoom: 5,
    });

    // -- WIDGET -> SEARCH --
    const search = new Search({
      //Add Search widget
      view: view,
    });

    // -- WIDGET -> BASEMAP GALLERY --
    const basemapGallery = new BasemapGallery({
      view: view,
    });

    // -- WIDGET ->  --
    const layerList = new LayerList({
      view: view,
    });

    // -- AGREGAR WIDGETS --
    view.ui.add(search, "top-right");
    view.ui.add(basemapGallery, {
      position: "top-right",
    });
    view.ui.add(layerList, {
      position: "top-right",
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
