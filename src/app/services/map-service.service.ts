import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapServiceService {

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  mapReadySub = new Subject();
  transitingFromView = new Subject();

  constructor() { }
  loadMap(longitude: any, latitude: any) {
    // @ts-ignore
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2FmZXQtMTk5MCIsImEiOiJjam16eGw1aXkyODVrM3FxeWs1NzhrNzE5In0.zS31UERwy9uupx_Ajw7nOw';
    this.map = new mapboxgl.Map({
      container: 'map',
      zoom: 12,
      style: 'mapbox://styles/safet-1990/ck3e2qsz740k61cml22pf6qpf',
      center: [longitude, latitude],
      interactive: false,
    });
    this.map.on('load', listener =>  {
      this.map.resize();
      this.mapReadySub.next(true);
    });
    const marker = new mapboxgl.Marker({
      anchor: 'center',
      color: '#273859'
    })
        .setLngLat([longitude, latitude])
        .addTo(this.map);
  }
  removeMap() {
    this.map.remove();
  }
}
